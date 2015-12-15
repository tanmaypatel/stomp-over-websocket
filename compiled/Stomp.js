'use strict';

define(['exports', './Client', './Frame'], function (exports) {
    (function (global, factory) {
        if (typeof define === "function" && define.amd) {
            define(['./Client', './Frame'], factory);
        } else if (typeof exports !== "undefined") {
            factory();
        } else {
            var mod = {
                exports: {}
            };
            factory(global.Client, global.Frame);
            global.Stomp = mod.exports;
        }
    })(this, function (_Client, _Frame) {
        var _Client2 = _interopRequireDefault(_Client);

        var _Frame2 = _interopRequireDefault(_Frame);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }

        var Stomp = {
            VERSIONS: {
                V1_0: '1.0',
                V1_1: '1.1',
                V1_2: '1.2',
                supportedVersions: function supportedVersions() {
                    return '1.1,1.0';
                }
            },
            client: function client(url) {
                var protocols = arguments.length <= 1 || arguments[1] === undefined ? ['v10.stomp', 'v11.stomp'] : arguments[1];
                var klass = Stomp.WebSocketClass || WebSocket;
                var ws = new klass(url, protocols);
                return new _Client2.default(ws);
            },
            over: function over(ws) {
                return new _Client2.default(ws);
            },
            Frame: _Frame2.default
        };

        if (typeof window !== 'undefined' && window !== null) {
            Stomp.setInterval = function (interval, f) {
                return window.setInterval(f, interval);
            };

            Stomp.clearInterval = function (id) {
                return window.clearInterval(id);
            };
        }
    });
});
//# sourceMappingURL=Stomp.js.map
