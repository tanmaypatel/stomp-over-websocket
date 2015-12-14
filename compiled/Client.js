'use strict';

define(['exports', './Byte', './Frame'], function (exports) {
    (function (global, factory) {
        if (typeof define === "function" && define.amd) {
            define(['exports', './Byte', './Frame'], factory);
        } else if (typeof exports !== "undefined") {
            factory(exports);
        } else {
            var mod = {
                exports: {}
            };
            factory(mod.exports, global.Byte, global.Frame);
            global.Client = mod.exports;
        }
    })(this, function (exports, _Byte, _Frame) {
        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _Byte2 = _interopRequireDefault(_Byte);

        var _Frame2 = _interopRequireDefault(_Frame);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

        var now = function now() {
            if (Date.now) {
                return Date.now();
            } else {
                return new Date().valueOf;
            }
        };

        var Client = (function () {
            function Client(ws) {
                _classCallCheck(this, Client);

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

            _createClass(Client, [{
                key: 'debug',
                value: function debug(message) {
                    console.log(message);
                }
            }, {
                key: '_transmit',
                value: function _transmit(command, headers, body) {
                    var out = _Frame2.default.marshall(command, headers, body);

                    if (typeof this.debug === 'function') {}
                }
            }]);

            return Client;
        })();

        exports.default = Client;
    });
});
//# sourceMappingURL=Client.js.map
