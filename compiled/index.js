(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Frame', './Client', './Commands', './Versions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Frame'), require('./Client'), require('./Commands'), require('./Versions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Frame, global.Client, global.Commands, global.Versions);
    global.index = mod.exports;
  }
})(this, function (exports, _Frame, _Client, _Commands, _Versions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Versions = exports.Commands = exports.Frame = exports.Client = undefined;

  var _Frame2 = _interopRequireDefault(_Frame);

  var _Client2 = _interopRequireDefault(_Client);

  var _Commands2 = _interopRequireDefault(_Commands);

  var _Versions2 = _interopRequireDefault(_Versions);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Client = _Client2.default;
  exports.Frame = _Frame2.default;
  exports.Commands = _Commands2.default;
  exports.Versions = _Versions2.default;
});
//# sourceMappingURL=index.js.map
