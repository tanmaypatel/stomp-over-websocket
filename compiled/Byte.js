'use strict';

define(['exports'], function (exports) {
    (function (global, factory) {
        if (typeof define === "function" && define.amd) {
            define(['exports'], factory);
        } else if (typeof exports !== "undefined") {
            factory(exports);
        } else {
            var mod = {
                exports: {}
            };
            factory(mod.exports);
            global.Byte = mod.exports;
        }
    })(this, function (exports) {
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var Byte = {
            LF: '\x0A',
            NULL: '\x00'
        };
        exports.default = Byte;
    });
});
//# sourceMappingURL=Byte.js.map
