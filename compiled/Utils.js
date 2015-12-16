'use strict';

define(['exports'], function (exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var noop = function noop() {};

    var now = function now() {
        if (Date.now) {
            return Date.now();
        } else {
            return new Date().valueOf;
        }
    };

    var trim = function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    var repeatEvery = noop;
    var stopRepeatation = noop;

    if (typeof window !== 'undefined' && window !== null) {
        repeatEvery = function (interval, func) {
            return window.setInterval(func, interval);
        };

        stopRepeatation = function (id) {
            return window.clearInterval(id);
        };
    }

    exports.default = { noop: noop, now: now, trim: trim, repeatEvery: repeatEvery, stopRepeatation: stopRepeatation };
});
//# sourceMappingURL=Utils.js.map
