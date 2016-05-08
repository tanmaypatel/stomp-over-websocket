(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './Client', './Frame'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./Client'), require('./Frame'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Client, global.Frame);
        global.Versions = mod.exports;
    }
})(this, function (exports, _Client, _Frame) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Client2 = _interopRequireDefault(_Client);

    var _Frame2 = _interopRequireDefault(_Frame);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var Versions = {
        V1_0: '1.0',
        V1_1: '1.1',
        V1_2: '1.2',
        supportedVersions: function supportedVersions() {
            return '1.1,1.0';
        }
    };

    exports.default = Versions;
});
//# sourceMappingURL=Versions.js.map
