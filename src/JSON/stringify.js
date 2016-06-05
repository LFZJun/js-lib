/**
 * Created by LJun on 2017/4/18.
 */

(function () {
    var stringify = function (obj) {
        var text = "";
        var tabNum = 0;

        var append = function (chs) {
            text += chs;
        };

        var indent = function (tabs) {
            for (var i = 0; i < tabs; i++)
                append('\t');
        };

        var join = function (arr, sep, func) {
            var len = arr.length;
            if (func) {
                switch (len) {
                    case 0:
                        break;
                    case 1:
                        func(arr[0]);
                        break;
                    default:
                        func(arr[0]);
                        arr.slice(1).forEach(function (p1) {
                            append(sep);
                            func(p1);
                        });
                        break;
                }
            }
        };

        var objectt = function (obj) {
            append('{\n');
            var keys = Object.keys(obj);
            var len = keys.length;
            join(keys, ',\n', function (p1) {
                indent(tabNum);
                append(p1);
                append(': ');
                value(obj[p1]);
            });
            append('\n');
            indent(tabNum - 1);
            append('}');
        };

        var arrayy = function (arr) {
            append('[');
            var len = arr.length;
            join(arr, ', ', function (p1) {
                value(p1);
            });
            append(']');
        };

        var numberr = function (num) {
            append(num + '');
        };
        var stringg = function (str) {
            append(str);
        };

        var value = function (obj) {
            var type = typeof obj;
            switch (type) {
                case 'object':
                    if (Object.prototype.toString.apply(obj) === '[object Array]') {
                        arrayy(obj);
                        break;
                    }
                    tabNum++;
                    objectt(obj);
                    tabNum--;
                    break;
                case 'string':
                    stringg(obj);
                    break;
                case 'number':
                    numberr(obj);
                    break;
            }
        };
        value(obj);
        return text;
    };
})();
