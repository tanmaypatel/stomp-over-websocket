(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'minivents', './Byte', './Frame', './Versions', './Commands', './Utils'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('minivents'), require('./Byte'), require('./Frame'), require('./Versions'), require('./Commands'), require('./Utils'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.minivents, global.Byte, global.Frame, global.Versions, global.Commands, global.Utils);
        global.Client = mod.exports;
    }
})(this, function (exports, _minivents, _Byte, _Frame, _Versions, _Commands, _Utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _minivents2 = _interopRequireDefault(_minivents);

    var _Byte2 = _interopRequireDefault(_Byte);

    var _Frame2 = _interopRequireDefault(_Frame);

    var _Versions2 = _interopRequireDefault(_Versions);

    var _Commands2 = _interopRequireDefault(_Commands);

    var _Utils2 = _interopRequireDefault(_Utils);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Client = function () {
        function Client(url) {
            var WebSocketClass = arguments.length <= 1 || arguments[1] === undefined ? WebSocket : arguments[1];
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var protocols = arguments.length <= 3 || arguments[3] === undefined ? ['v10.stomp', 'v11.stomp'] : arguments[3];

            _classCallCheck(this, Client);

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
            (0, _minivents2.default)(this);
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

                if (typeof this.debug === 'function') {
                    this.debug('>>> ' + out);
                }

                while (true) {
                    if (out.length > this.maxWebSocketFrameSize) {
                        this.ws.send(out.substring(0, this.maxWebSocketFrameSize));

                        out = out.substring(this.maxWebSocketFrameSize);

                        if (typeof this.debug === 'function') {
                            this.debug('remaining = ' + out.length);
                        }
                    } else {
                        return this.ws.send(out);
                    }
                }
            }
        }, {
            key: '_setupHeartBeat',
            value: function _setupHeartBeat(headers) {
                var _this = this;

                if ([_Versions2.default.V1_1, _Versions2.default.V1_2].indexOf(headers.version) >= 0) {
                    return;
                }

                var serverOutgoing = void 0,
                    serverIncoming = void 0;

                var _headers$heartBeat$s = headers['heart-beat'].split(',').map(function (v) {
                    return parseInt(v);
                });

                var _headers$heartBeat$s2 = _slicedToArray(_headers$heartBeat$s, 2);

                serverOutgoing = _headers$heartBeat$s2[0];
                serverIncoming = _headers$heartBeat$s2[1];


                var ttl = void 0;
                if (this.heartbeat.outgoing == 0 || serverIncoming == 0) {
                    ttl = Math.max(this.heartbeat.outgoing, serverIncoming);

                    if (typeof this.debug === 'function') {
                        this.debug('send PING every ' + ttl + 'ms');
                    }

                    this.pinger = _Utils2.default.repeatEvery(ttl, function () {
                        _this.ws.send(_Byte2.default.LF);

                        if (typeof _this.debug === 'function') {
                            _this.debug('>>> PING');
                        }
                    });
                }

                if (this.heartbeat.incoming == 0 || serverOutgoing == 0) {
                    ttl = Math.max(this.heartbeat.incoming, serverOutgoing);

                    if (typeof this.debug === 'function') {
                        this.debug('check PONG every ' + ttl + 'ms');
                    }

                    this.ponger = _Utils2.default.repeatEvery(ttl, function () {
                        var delta = _Utils2.default.now() - _this.serverActivity;

                        if (delta > ttl * 2) {
                            if (typeof _this.debug === 'function') {
                                _this.debug('did not receive server activity for the last ' + delta + 'ms');
                            }

                            _this.ws.close();
                        }
                    });
                }
            }
        }, {
            key: 'connect',
            value: function connect(headers) {
                var _this2 = this;

                if (typeof this.debug === 'function') {
                    this.debug('Opening Web Socket...');
                }

                this.ws.onopen = function (evt) {
                    if (typeof _this2.debug === 'function') {
                        _this2.debug('Web Socket Opened...');
                    }

                    headers['accept-version'] = _Versions2.default.supportedVersions();
                    headers['heart-beat'] = [_this2.heartbeat.outgoing, _this2.heartbeat.incoming].join(',');

                    _this2._transmit(_Commands2.default.CONNECT, headers);
                };

                this.ws.onmessage = function (evt) {
                    var data = void 0,
                        arr = void 0;

                    if (typeof ArrayBuffer != 'undefined' && evt.data instanceof ArrayBuffer) {
                        var _arr = new Uint8Array(evt.data);

                        if (typeof _this2.debug === 'function') {
                            _this2.debug('--- got data length: ' + _arr.length);
                        }

                        var _results = [];

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var c = _step.value;

                                _results.push(String.fromCharCode(c));
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        data = _results.join('');
                    } else {
                        data = evt.data;
                    }

                    _this2.serverActivity = _Utils2.default.now();

                    if (data == _Byte2.default.LF) {
                        if (typeof _this2.debug === 'function') {
                            _this2.debug('<<< PONG');
                        }

                        return;
                    }

                    if (typeof _this2.debug === 'function') {
                        _this2.debug('<<< ' + data);
                    }

                    var results = [];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _Frame2.default.unmarshall(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var frame = _step2.value;

                            _this2.emit('frame', frame);

                            switch (frame.command) {
                                case _Commands2.default.CONNECTED:
                                    if (typeof _this2.debug === 'function') {
                                        _this2.debug('connected to server ' + frame.headers.server);
                                    }

                                    _this2.connected = true;
                                    _this2._setupHeartBeat(frame.headers);

                                    _this2.emit('connection', frame);

                                    break;

                                case _Commands2.default.MESSAGE:
                                    var subscription = frame.headers.subscription;

                                    var onreceive = _this2.subscriptions[subscription] || _this2.onreceive;

                                    _this2.emit('message', frame);

                                    if (onreceive) {
                                        (function () {
                                            var client = _this2;
                                            var messageID = frame.headers['message-id'];

                                            frame.ack = function () {
                                                var headers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                                                return client.ack(messageID, subscription, headers);
                                            };

                                            frame.nack = function () {
                                                var headers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                                                return client.nack(messageID, subscription, headers);
                                            };

                                            onreceive(frame);
                                        })();
                                    } else {
                                        if (typeof _this2.debug === 'function') {
                                            _this2.debug('Unhandled received MESSAGE: ' + frame);
                                        }
                                    }
                                    break;

                                case _Commands2.default.RECEIPT:

                                    _this2.emit('receipt', frame);

                                    break;

                                case _Commands2.default.ERROR:

                                    _this2.emit('error', frame);

                                    break;

                                default:

                                    if (typeof _this2.debug === 'function') {
                                        _this2.debug('Unhandled frame: ' + frame);
                                    }
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                };

                this.ws.onclose = function (evt) {
                    var didConnectionFail = !evt.wasClean || !_this2.connected ? true : false;

                    var msg = 'Whoops! Lost connection to ' + _this2.ws.url;

                    if (typeof _this2.debug === 'function') {
                        _this2.debug(msg);
                    }

                    _this2._cleanUp();

                    if (didConnectionFail) {
                        _this2.emit('connection_failed', {
                            code: evt.code,
                            reason: evt.reason
                        });
                    } else {
                        _this2.emit('connection_error', {
                            code: evt.code,
                            reason: evt.reason
                        });
                    }
                };
            }
        }, {
            key: 'disconnect',
            value: function disconnect() {
                this._transmit(_Commands2.default.DISCONNECT);

                var client = this;

                this.ws.onclose = function (evt) {
                    client.emit('disconnect');
                };

                this.ws.close();
                this._cleanUp();
            }
        }, {
            key: '_cleanUp',
            value: function _cleanUp() {
                this.connected = false;

                if (this.pinger) {
                    _Utils2.default.stopRepeatation(this.pinger);
                }

                if (this.ponger) {
                    _Utils2.default.stopRepeatation(this.ponger);
                }
            }
        }, {
            key: 'send',
            value: function send(destination) {
                var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                var body = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

                headers.destination = destination;
                return this._transmit(_Commands2.default.SEND, headers, body);
            }
        }, {
            key: 'subscribe',
            value: function subscribe(destination, callback) {
                var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                if (!headers.id) {
                    headers.id = 'subscription-' + _Utils2.default.generateUUID();
                }

                headers.destination = destination;

                this.subscriptions[headers.id] = callback;

                this._transmit(_Commands2.default.SUBSCRIBE, headers);

                var client = this;

                return {
                    id: headers.id,
                    unsubscribe: function unsubscribe() {
                        return client.unsubscribe(headers.id);
                    }
                };
            }
        }, {
            key: 'unsubscribe',
            value: function unsubscribe(id) {
                delete this.subscriptions[id];

                this._transmit(_Commands2.default.UNSUBSCRIBE, {
                    id: id
                });
            }
        }, {
            key: 'begin',
            value: function begin(transaction) {
                var txid = transaction || 'tx-' + _Utils2.default.generateUUID();

                this._transmit(_Commands2.default.BEGIN, {
                    transaction: txid
                });

                var client = this;

                return {
                    id: txid,
                    commit: function commit() {
                        return client.commit(txid);
                    },
                    abort: function abort() {
                        return client.abort(txid);
                    }
                };
            }
        }, {
            key: 'commit',
            value: function commit(transaction) {
                return this._transmit(_Commands2.default.COMMIT, {
                    transaction: transaction
                });
            }
        }, {
            key: 'abort',
            value: function abort(transaction) {
                return this._transmit(_Commands2.default.ABORT, {
                    transaction: transaction
                });
            }
        }, {
            key: 'ack',
            value: function ack(messageID, subscription) {
                var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                headers['message-id'] = messageID;
                headers.subscription = subscription;
                return this._transmit(_Commands2.default.ACK, headers);
            }
        }, {
            key: 'nack',
            value: function nack(messageID, subscription) {
                var headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                headers['message-id'] = messageID;
                headers.subscription = subscription;
                return this._transmit(_Commands2.default.NACK, headers);
            }
        }]);

        return Client;
    }();

    exports.default = Client;
});
//# sourceMappingURL=Client.js.map
