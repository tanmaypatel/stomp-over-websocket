const FrameTypes = {
    // connection
    CONNECT: 'CONNECT',
    DISCONNECT: 'DISCONNECT',
    CONNECTED: 'CONNECTED',

    // subscription
    SUBSCRIBE: 'SUBSCRIBE',
    UNSUBSCRIBE: 'UNSUBSCRIBE',

    // messaging
    SEND: 'SEND',
    MESSAGE: 'MESSAGE',
    ACK: 'ACK',
    NACK: 'NACK',
    RECEIPT: 'RECEIPT',

    // transcations
    BEGIN: 'BEGIN',
    COMMIT: 'COMMIT',
    ABORT: 'ABORT',


    // error
    ERROR: 'ERROR'
};

export default FrameTypes;
