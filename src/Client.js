import Byte from './Byte';
import Frame from './Frame';
import Stomp from './Stomp';
import FrameTypes from './FrameTypes';

let now = ()=>
{
    if(Date.now)
    {
        return Date.now();
    }
    else
    {
        return new Date().valueOf;
    }
}

class Client
{
    constructor(ws)
    {
        this.ws = ws;
        this.ws.binaryType = 'arraybuffer';

        this.counter = 0;
        this.connected = false;
        this.heartbeat = {
            outgoing: 10000,
            incoming: 10000
        };
        this.maxWebSocketFrameSize = 16 * 1024;
        this.subscriptions = {};
        this.partialData = '';
    }

    debug(message)
    {
        console.log(message);
    }

    _transmit(command, headers, body)
    {
        let out = Frame.marshall(command, headers, body);

        if(typeof this.debug === 'function')
        {
            this.debug(`>>> ${out}`);
        }

        while(true)
        {
            if(out.length > this.maxWebSocketFrameSize)
            {
                this.ws.send(out.substring(0, this.maxWebSocketFrameSize));

                out = out.substring(this.maxWebSocketFrameSize);

                if(typeof this.debug === 'function')
                {
                    this.debug(`remaining = ${out.length}`);
                }
            }
            else
            {
                return this.ws.send(out);
            }
        }
    }

    _setupHeartBeat(headers)
    {
        if([Stomp.VERSIONS.V1_1, Stomp.VERSIONS.V1_2].indexOf(headers.version) >= 0)
        {
            return;
        }

        let serverOutgoing, serverIncoming;
        [serverOutgoing, serverIncoming] = headers['heart-beat'].split(',').map((v) =>
        {
            return parseInt(v);
        });

        let ttl;
        if(this.heartbeat.outgoing == 0 || serverIncoming == 0)
        {
            ttl = Math.max(this.heartbeat.outgoing, serverIncoming);

            if(typeof this.debug === 'function')
            {
                this.debug(`send PING every ${ttl}ms`);
            }

            this.pinger = Stomp.setInterval(ttl, () =>
            {
                this.ws.send(Byte.LF);

                if(typeof this.debug === 'function')
                {
                    this.debug(`>>> PING`);
                }
            });
        }

        if(this.heartbeat.incoming == 0 || serverOutgoing == 0)
        {
            ttl = Math.max(this.heartbeat.incoming, serverOutgoing);

            if(typeof this.debug === 'function')
            {
                this.debug(`check PONG every ${ttl}ms`);
            }

            this.ponger = Stomp.setInterval(ttl, () =>
            {
                let delta = now() - this.serverActivity;

                if(delta > ttl * 2)
                {
                    if(typeof this.debug === 'function')
                    {
                        this.debug(`did not receive server activity for the last ${delta}ms`);
                    }

                    this.ws.close();
                }
            });
        }
    }

    _parseConnect(...args)
    {
        let headers = {};
        let connectCallback = null;
        let errorCallback = null;

        switch(args.length)
        {
            case 2:
                [headers, connectCallback] = args;
                break;

            case 3:
                if(args[1] instanceof Function)
                {
                    [headers, connectCallback, errorCallback] = args;
                }
                else
                {
                    [headers.login, headers.passcode, connectCallback] = args;
                }
                break;
            case 4:
                [headers.login, headers.passcode, connectCallback, errorCallback] = args;
                break;
            default:
                [headers.login, headers.passcode, connectCallback, errorCallback, headers.host] = args;
                break;
        }

        return [headers, connectCallback, errorCallback];
    }

    connect(...args)
    {
        let out = this._parseConnect.apply(this, args);

        let headers, errorCallback;
        [headers, this.connectCallback, errorCallback] = out;

        if(typeof this.debug === 'function')
        {
            this.debug(`Opening Web Socket...`);
        }

        this.ws.onmessage = (evt) =>
        {
            let data, arr;

            if(typeof(ArrayBuffer) != 'undefined' && evt.data instanceof ArrayBuffer)
            {
                let arr = new Uint8Array(evt.data) ;

                if(typeof this.debug === 'function')
                {
                    this.debug(`--- got data length: ${arr.length}`);
                }

                let results = [];

                for(let c of arr)
                {
                    results.push(String.fromCharCode(c));
                }

                data = results.join('');
            }
            else
            {
                data = event.data;
            }

            this.serverActivity = now();

            if(data == Byte.LF)
            {
                if(typeof this.debug === 'function')
                {
                    this.debug(`<<< PONG`);
                }

                return;
            }

            if(typeof this.debug === 'function')
            {
                this.debug(`<<< ${data}`);
            }

            let results = [];
            for(let frame of Frame.unmarshall(data))
            {
                switch(frame.command)
                {
                    case FrameTypes.CONNECTED:
                        if(typeof this.debug === 'function')
                        {
                            this.debug(`connected to server ${frame.headers.server}`);
                        }

                        this.connected = true;
                        this._setupHeartBeat(frame.headers);
                        results.push(typeof this.debug === 'function' ? this.connectCallback(frame) : void 0);
                        break;

                    case FrameTypes.MESSAGE:
                        let subscription = frame.headers.subscription;

                        let onreceive = this.subscriptions[subscription] || this.onreceive;

                        if(onreceive)
                        {
                            let client = this;
                            let messageID = frame.headers['message-id'];

                            frame.ack = (headers = {}) =>
                            {
                                return client.ack(messageID, subscription, headers);
                            };

                            frame.nack = (headers = {}) =>
                            {
                                return client.nack(messageID, subscription, headers);
                            };

                            onreceive(frame);
                        }
                        else
                        {
                            if(typeof this.debug === 'function')
                            {
                                this.debug(`Unhandled received MESSAGE: ${frame}`);
                            }
                        }
                        break;

                    case FrameTypes.RECEIPT:
                        if(typeof this.onreceipt === 'function')
                        {
                            this.onreceipt(frame);
                        }

                        break;

                    case FrameTypes.ERROR:
                        if(typeof errorCallback === 'function')
                        {
                            errorCallback(frame);
                        }

                        break;

                    default:
                        if(typeof this.debug === 'function')
                        {
                            this.debug(`Unhandled frame: ${frame}`);
                        }
                }
            }
        }

        this.ws.onclose = () =>
        {
             let msg = `Whoops! Lost connection to ${this.ws.url}`;

             if(typeof this.debug === 'function')
             {
                 this.debug(msg);
             }

             this._cleanUp();

             if(typeof errorCallback === 'function')
             {
                 errorCallback(msg);
             }
        };

        this.ws.onopen = () =>
        {
             if(typeof this.debug === 'function')
             {
                 this.debug(`Web Socket Opened...`);
             }

             headers['accept-version'] = Stomp.VERSIONS.supportedVersions();
             headers['heart-beat'] = [this.heartbeat.outgoing, this.heartbeat.incoming].join(',');

             this._transmit(FrameTypes.CONNECT, headers);
        };
    }

    disconnect(disconnectCallback)
    {
        this._transmit(FrameTypes.DISCONNECT);

        this.ws.onclose = null;
        this.ws.close();
        this._cleanUp();

        if(typeof disconnectCallback === 'function')
        {
            disconnectCallback();
        }
    }

    _cleanUp()
    {
        this.connected = false;

        if(this.pinger)
        {
            Stomp.clearInterval(this.pinger);
        }

        if(this.ponger)
        {
            Stomp.clearInterval(this.ponger);
        }
    }

    send(destination, headers = {}, body = '')
    {
        headers.destination = destination;
        return this._transmit(FrameTypes.SEND, headers, body);
    }

    subscribe(destination, callback, headers = {})
    {
        if(!headers.id)
        {
            headers.id = 'sub-' + this.counter++;
        }

        headers.destination = destination;

        this.subscriptions[headers.id] = callback;

        this._transmit(FrameTypes.SUBSCRIBE, headers);

        let client = this;

        return {
            id: headers.id,
            unsubscribe: function()
            {
                return client.unsubscribe(headers.id);
            }
        };
    }

    unsubscribe(id)
    {
        delete this.subscriptions[id];

        this._transmit(FrameTypes.UNSUBSCRIBE, {
            id: id
        });
    }

    begin(transaction)
    {
        let txid = transaction || 'tx' + this.counter++;

        this._transmit(FrameTypes.BEGIN, {
            transaction: txid
        });

        let client = this;

        return {
            id: txid,
            commit: function()
            {
                return client.commit(txid);
            },
            abort: function()
            {
                return client.abort(txid);
            }
        };
    }

    commit(transaction)
    {
        return this._transmit(FrameTypes.COMMIT, {
            transaction: transaction
        });
    }

    abort(transaction)
    {
        return this._transmit(FrameTypes.ABORT, {
            transaction: transaction
        });
    }

    ack(messageID, subscription, headers = {})
    {
        headers['message-id'] = messageID;
        headers.subscription = subscription;
        return this._transmit(FrameTypes.ACK, headers);
    }

    nack(messageID, subscription, headers = {})
    {
        headers['message-id'] = messageID;
        headers.subscription = subscription;
        return this._transmit(FrameTypes.NACK, headers);
    }
}

export default Client;
