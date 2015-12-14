'use strict';

define(['exports', './Byte', './Frame', './Client'], function (exports) {
  (function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define(['exports', './Byte', './Frame', './Client'], factory);
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports, global.Byte, global.Frame, global.Client);
      global.index = mod.exports;
    }
  })(this, function (exports, _Byte, _Frame, _Client) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Client = exports.Frame = exports.Byte = undefined;

    var _Byte2 = _interopRequireDefault(_Byte);

    var _Frame2 = _interopRequireDefault(_Frame);

    var _Client2 = _interopRequireDefault(_Client);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.Byte = _Byte2.default;
    exports.Frame = _Frame2.default;
    exports.Client = _Client2.default;
  });
});
//# sourceMappingURL=index.js.map
