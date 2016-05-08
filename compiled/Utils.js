define(['exports'], function (exports) {
    'use strict';

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
        repeatEvery = function repeatEvery(interval, func) {
            return window.setInterval(func, interval);
        };

        stopRepeatation = function stopRepeatation(id) {
            return window.clearInterval(id);
        };
    }

    var generateUUID = function generateUUID() {
        var d = now();

        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }

        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
        });

        return uuid;
    };

    exports.default = { noop: noop, now: now, trim: trim, repeatEvery: repeatEvery, stopRepeatation: stopRepeatation };
});
//# sourceMappingURL=Utils.js.map
