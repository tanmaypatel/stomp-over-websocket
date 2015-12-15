'use strict';

define(['exports', './Byte', './Frame', './Client', './Stomp'], function (exports, _Byte, _Frame, _Client, _Stomp) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.over = exports.client = exports.Frame = undefined;

    var _Byte2 = _interopRequireDefault(_Byte);

    var _Frame2 = _interopRequireDefault(_Frame);

    var _Client2 = _interopRequireDefault(_Client);

    var _Stomp2 = _interopRequireDefault(_Stomp);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var client = function client(url) {
        var protocols = arguments.length <= 1 || arguments[1] === undefined ? ['v10.stomp', 'v11.stomp'] : arguments[1];
        var klass = _Stomp2.default.WebSocketClass || WebSocket;
        var ws = new klass(url, protocols);
        var client = new _Client2.default(ws);
        return client;
    };

    var over = function over(ws) {
        var client = new _Client2.default(ws);
        return client;
    };

    exports.Frame = _Frame2.default;
    exports.client = client;
    exports.over = over;
});
//# sourceMappingURL=index.js.map
