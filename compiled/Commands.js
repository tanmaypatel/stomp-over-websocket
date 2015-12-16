'use strict';

define(['exports'], function (exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Commands = {
        CONNECT: 'CONNECT',
        DISCONNECT: 'DISCONNECT',
        CONNECTED: 'CONNECTED',
        SUBSCRIBE: 'SUBSCRIBE',
        UNSUBSCRIBE: 'UNSUBSCRIBE',
        SEND: 'SEND',
        MESSAGE: 'MESSAGE',
        ACK: 'ACK',
        NACK: 'NACK',
        RECEIPT: 'RECEIPT',
        BEGIN: 'BEGIN',
        COMMIT: 'COMMIT',
        ABORT: 'ABORT',
        ERROR: 'ERROR'
    };
    exports.default = Commands;
});
//# sourceMappingURL=Commands.js.map
