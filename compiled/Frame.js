'use strict';

define(['exports', './Byte'], function (exports) {
    (function (global, factory) {
        if (typeof define === "function" && define.amd) {
            define(['exports', './Byte'], factory);
        } else if (typeof exports !== "undefined") {
            factory(exports);
        } else {
            var mod = {
                exports: {}
            };
            factory(mod.exports, global.Byte);
            global.Frame = mod.exports;
        }
    })(this, function (exports, _Byte) {
        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _Byte2 = _interopRequireDefault(_Byte);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var _createClass = (function () {
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
        })();

        var unmarshallSingle = function unmarshallSingle(data) {
            var divider = data.search(new RegExp('/' + _Byte2.default.LF + _Byte2.default.LF + '/'));
            var headerLines = data.substring(0, divider).split(_Byte2.default.LF);
            var command = headerLines.shift();
            var headers = {};
            trim(str);
            {
                return str.replace(/^\s+|\s+$/g, '');
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = headerLines.reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var line = _step.value;
                    var inx = line.indexOf(':');
                    headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
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

            var body = '';
            var start = divider + 2;

            if (headers['content-length']) {
                var len = parseInt(headers['content-length']);
                body = ('' + data).substring(start, start + len);
            } else {
                var chr = null;

                for (var i = start; i <= data.length; i++) {
                    chr = data.charAt(i);

                    if (chr === _Byte2.default.NULL) {
                        break;
                    }

                    body += chr;
                }
            }

            return new Frame(command, headers, body);
        };

        var Frame = (function () {
            _createClass(Frame, null, [{
                key: 'sizeOfUTF8',
                value: function sizeOfUTF8(s) {
                    if (s) {
                        return encodeURI(s).split(/%..|./).length - 1;
                    } else {
                        return 0;
                    }
                }
            }, {
                key: 'unmarshall',
                value: function unmarshall(datas) {
                    var frames = [];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = data.split(new RegExp('/' + _Byte2.default.NULL + _Byte2.default.LF + '/'))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _data = _step2.value;

                            if (_data.length > 0) {
                                frames.push(unmarshallSingle(_data));
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

                    return frames;
                }
            }, {
                key: 'marshall',
                value: function marshall(command, headers, body) {
                    var frame = new Frame(command, headers, body);
                    return frame.toString() + _Byte2.default.NULL;
                }
            }]);

            function Frame(command) {
                var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                var body = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

                _classCallCheck(this, Frame);

                this.command = command;
                this.headers = headers;
                this.body = body;
            }

            _createClass(Frame, [{
                key: 'toString',
                value: function toString() {
                    var lines = [this.command];
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = Object.keys(this.headers)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var key = _step3.value;
                            var value = this.headers[key];
                            lines.push(key + ':' + value);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    if (body) {
                        lines.push('content-length:' + Frame.sizeOfUTF8(this.body));
                    }

                    lines.push(_Byte2.default.LF + this.body);
                    return lines.join(_Byte2.default.LF);
                }
            }]);

            return Frame;
        })();

        exports.default = Frame;
    });
});
//# sourceMappingURL=Frame.js.map
