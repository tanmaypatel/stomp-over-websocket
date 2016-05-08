(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.Commands = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Commands = {
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

    exports.default = Commands;
});
//# sourceMappingURL=Commands.js.map
