import Byte from './Byte';
import Frame from './Frame';
import Client from './Client';
import Stomp from './Stomp';

let client = function(url, protocols = ['v10.stomp', 'v11.stomp'])
{
    let klass = Stomp.WebSocketClass || WebSocket;
    let ws = new klass(url, protocols);
    let client = new Client(ws);
    return client;
};

let over = function(ws)
{
    let client = new Client(ws);
    return client;
};

export {Frame, client, over};
