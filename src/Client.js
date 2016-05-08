import Events from 'minivents';

import Byte from './Byte';
import Frame from './Frame';
import Versions from './Versions';
import Commands from './Commands';
import Utils from './Utils';

class Client
{
    constructor(url, WebSocketClass = WebSocket, options = {}, protocols = ['v10.stomp', 'v11.stomp'])
    {
        // this.ws = new WebSocketClass(url, protocols, options);
        this.ws = new WebSocketClass(url);
        this.ws.binaryType = 'arraybuffer';

        this.connected = false;
        this.heartbeat = {
            outgoing: 10000,
            incoming: 10000
        };
        this.maxWebSocketFrameSize = 16 * 1024;
        this.subscriptions = {};
        this.partialData = '';

        // applying events mixins to support event handlers
        Events(this);
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
        if([Versions.V1_1, Versions.V1_2].indexOf(headers.version) >= 0)
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

            this.pinger = Utils.repeatEvery(ttl, () =>
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

            this.ponger = Utils.repeatEvery(ttl, () =>
            {
                let delta = Utils.now() - this.serverActivity;

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

    connect(headers)
    {
        if(typeof this.debug === 'function')
        {
            this.debug(`Opening Web Socket...`);
        }

        this.ws.onopen = (evt) =>
        {
            if(typeof this.debug === 'function')
            {
             this.debug(`Web Socket Opened...`);
            }

            headers['accept-version'] = Versions.supportedVersions();
            headers['heart-beat'] = [this.heartbeat.outgoing, this.heartbeat.incoming].join(',');

            this._transmit(Commands.CONNECT, headers);
        };

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
                data = evt.data;
            }

            this.serverActivity = Utils.now();

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
                this.emit('frame', frame);

                switch(frame.command)
                {
                    case Commands.CONNECTED:
                        if(typeof this.debug === 'function')
                        {
                            this.debug(`connected to server ${frame.headers.server}`);
                        }

                        this.connected = true;
                        this._setupHeartBeat(frame.headers);

                        this.emit('connection', frame);

                        break;

                    case Commands.MESSAGE:
                        let subscription = frame.headers.subscription;

                        let onreceive = this.subscriptions[subscription] || this.onreceive;

                        this.emit('message', frame);

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

                    case Commands.RECEIPT:

                        this.emit('receipt', frame);

                        break;

                    case Commands.ERROR:

                        this.emit('error', frame);

                        break;

                    default:

                        if(typeof this.debug === 'function')
                        {
                            this.debug(`Unhandled frame: ${frame}`);
                        }
                }
            }
        }

        this.ws.onclose = (evt) =>
        {
            let didConnectionFail = !evt.wasClean || !this.connected ? true : false;

            let msg = `Whoops! Lost connection to ${this.ws.url}`;

            if(typeof this.debug === 'function')
            {
                this.debug(msg);
            }

            this._cleanUp();

            if(didConnectionFail)
            {
                this.emit('connection_failed', {
                    code: evt.code,
                    reason: evt.reason
                });
            }
            else
            {
                this.emit('connection_error', {
                    code: evt.code,
                    reason: evt.reason
                });
            }
        };
    }

    disconnect()
    {
        this._transmit(Commands.DISCONNECT);

        let client = this;

        this.ws.onclose = function(evt)
        {
            client.emit('disconnect');
        };

        this.ws.close();
        this._cleanUp();
    }

    _cleanUp()
    {
        this.connected = false;

        if(this.pinger)
        {
            Utils.stopRepeatation(this.pinger);
        }

        if(this.ponger)
        {
            Utils.stopRepeatation(this.ponger);
        }
    }

    send(destination, headers = {}, body = '')
    {
        headers.destination = destination;
        return this._transmit(Commands.SEND, headers, body);
    }

    subscribe(destination, callback, headers = {})
    {
        if(!headers.id)
        {
            headers.id = 'subscription-' + Utils.generateUUID();
        }

        headers.destination = destination;

        this.subscriptions[headers.id] = callback;

        this._transmit(Commands.SUBSCRIBE, headers);

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

        this._transmit(Commands.UNSUBSCRIBE, {
            id: id
        });
    }

    begin(transaction)
    {
        let txid = transaction || 'tx-' + Utils.generateUUID();

        this._transmit(Commands.BEGIN, {
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
        return this._transmit(Commands.COMMIT, {
            transaction: transaction
        });
    }

    abort(transaction)
    {
        return this._transmit(Commands.ABORT, {
            transaction: transaction
        });
    }

    ack(messageID, subscription, headers = {})
    {
        headers['message-id'] = messageID;
        headers.subscription = subscription;
        return this._transmit(Commands.ACK, headers);
    }

    nack(messageID, subscription, headers = {})
    {
        headers['message-id'] = messageID;
        headers.subscription = subscription;
        return this._transmit(Commands.NACK, headers);
    }
}

export default Client;
