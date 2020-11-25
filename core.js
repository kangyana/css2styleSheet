"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
// 短横线转小驼峰
var line2Hump = function (str) {
    var result = "";
    var arr = str
        .split("-")
        .map(function (v, i) { return (i > 0 ? v.slice(0, 1).toUpperCase() + v.slice(1) : v); });
    result = arr.join("");
    return result;
};
// 是否为纯数字
var isNumber = function (str) {
    var result = false;
    var reg = /^\d+$/;
    if (reg.test(str)) {
        result = true;
    }
    return result;
};
// 去除空格
var trim = function (str) {
    var result = "";
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    result = result.replace(/\s/g, "");
    return result;
};
// 分组
var split = function (str) {
    var result = [];
    result = str.split("}");
    result = result.map(function (v) { return v + "}"; });
    result = result.slice(0, result.length - 1);
    return result;
};
// 转对象
var toObject = function (arr) {
    var result = [];
    result = arr.map(function (v) {
        var key = v
            .match(/..*{/)[0]
            .replace(/./, "")
            .replace(/{/, "") || 0;
        var value = v
            .match(/{.*}/)[0]
            .replace(/({|})/g, "")
            .split(";")
            .filter(function (v) { return v; })
            .map(function (v) {
            var obj = {};
            var _a = v.split(":"), key = _a[0], value = _a[1];
            obj[line2Hump(key)] = isNumber(value) ? Number(value) : line2Hump(value);
            return obj;
        })
            .reduce(function (p, v) { return (__assign(__assign({}, p), v)); }, {});
        var obj = {};
        obj[key] = value;
        return obj;
    });
    result = result.reduce(function (p, v) { return (__assign(__assign({}, p), v)); }, {});
    return result;
};
// 函子容器
exports.Box = function (x) { return ({
    map: function (f) { return exports.Box(f(x)); },
    fold: function (f) { return f(x); }
}); };
// className转换StyleSheet
exports.transformStyles = function (classNames) {
    var result = exports.Box(classNames)
        .map(trim)
        .map(split)
        .fold(toObject);
    return result;
};
