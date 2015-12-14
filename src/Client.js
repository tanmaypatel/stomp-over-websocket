import Byte from './Byte';
import Frame from './Frame';

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
}

export default Client;
