'use strict';

define(['exports', './Client', './Frame'], function (exports, _Client, _Frame) {
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

    var Stomp = {
        VERSIONS: {
            V1_0: '1.0',
            V1_1: '1.1',
            V1_2: '1.2',
            supportedVersions: function supportedVersions() {
                return '1.1,1.0';
            }
        }
    };

    if (typeof window !== 'undefined' && window !== null) {
        Stomp.setInterval = function (interval, f) {
            return window.setInterval(f, interval);
        };

        Stomp.clearInterval = function (id) {
            return window.clearInterval(id);
        };
    }

    exports.default = Stomp;
});
//# sourceMappingURL=Stomp.js.map
