'use strict';

define(['exports', './Byte', './Frame', './Client', './Stomp'], function (exports) {
  (function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define(['exports', './Byte', './Frame', './Client', './Stomp'], factory);
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports, global.Byte, global.Frame, global.Client, global.Stomp);
      global.index = mod.exports;
    }
  })(this, function (exports, _Byte, _Frame, _Client, _Stomp) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Stomp = exports.Client = exports.Frame = exports.Byte = undefined;

    var _Byte2 = _interopRequireDefault(_Byte);

    var _Frame2 = _interopRequireDefault(_Frame);

    var _Client2 = _interopRequireDefault(_Client);

    var _Stomp2 = _interopRequireDefault(_Stomp);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    exports.Byte = _Byte2.default;
    exports.Frame = _Frame2.default;
    exports.Client = _Client2.default;
    exports.Stomp = _Stomp2.default;
  });
});
//# sourceMappingURL=index.js.map
