/**
 * Created by LJun on 16/8/24.
 */
(function (window) {
    var L = function (opt) {
        var el = document.querySelector(opt.el);
        var data = opt.data;

        return L.prototype.init(el, data);
    }

    L.prototype = {
        constructor: L,

        init: function (el, data) {
            this.el = el;
            this.data = data;
            this.elems = this.bindNodes(el);

            this.scan();
            this.bindText();
            this.bindModel();

            return this;
        },

        command: {
            text: function (datum) {
                this.innerHTML = datum;
            },
            model: function (datum) {
                this.setAttribute('value', datum);
                this.value = datum;
            }
        },

        bindNodes: function (el) {
            var elems = [],
                childs = el.childNodes,
                len = childs.length,
                i, j,
                attr,
                lenAttr;

            if (len) {
                for (i = 0; i < len; i++) {
                    el = childs[i];
                    if (el.nodeType === 1) {
                        for (j = 0, lenAttr = el.attributes.length; j < lenAttr; j++) {
                            attr = el.attributes[j];
                            if (attr.nodeName.indexOf('l-') == 0) {
                                elems.push(el);
                                break;
                            }
                        }
                        elems = elems.concat(this.bindNodes(el));
                    }
                }
            }
            return elems;
        },

        scan: function () {
            var els = this.elems,
                data = this.data,
                command = this.command,
                elsLen = els.length,
                i, j;
            /**
             * 扫描带指令的节点属性
             */
            for (i = 0; i < elsLen; i++) {
                var elem = els[i];
                var elemLen = elem.attributes.length;
                elem.command = [];
                for (j = 0; j < elemLen; j++) {
                    var attr = elem.attributes[j];
                    if (attr.nodeName.indexOf('l-') == 0) {
                        /**
                         * 调用属性指令
                         */
                        command[attr.nodeName.slice(2)].call(elem, data[attr.nodeValue]);
                        elem.command.push(attr.nodeName.slice(2));
                    }
                }
            }
        },

        bindText: function () {
            var doms = this.el.querySelectorAll('[l-text]'),
                lenDoms = doms.length;

            var _this = this,
                i,
                prop;

            for (i = 0; i < lenDoms; i++) {
                prop = doms[i].getAttribute('l-text');
                // tofix.........
                doms[i].value = this.data[prop] || '';
                // 前端数据劫持
                this.defineObj(this.data, prop, doms[i].value);
            }
        },

        bindModel: function () {
            var doms = this.el.querySelectorAll('[l-model]'),
                lenDoms = doms.length;

            var _this = this,
                i,
                prop;

            for (i = 0; i < lenDoms; i++) {
                prop = doms[i].getAttribute('l-model');
                // tofix.........
                doms[i].value = this.data[prop] || '';
                // 前端数据劫持
                this.defineObj(this.data, prop, doms[i].value);
                if (document.addEventListener) {
                    // 这里不能是keydown, 否则model和text会有一个字符差bug，因为keydown时,e.target.value还未变化
                    doms[i].addEventListener('keyup', function (e) {
                        e = e || window.event;
                        _this.data[prop] = e.target.value;
                    }, false);
                } else {
                    doms[i].attachEvent('onkeyup', function (e) {
                        e = e || window.event;
                        _this.data[prop] = e.target.value;
                    }, false);
                }
            }
        },

        defineObj: function (obj, key, value) {
            var _this = this,
                _value = value || '';

            try {
                Object.defineProperty(obj, key, {
                    get: function () {
                        return _value;
                    },
                    set: function (newValue) {
                        _value = newValue;
                        _this.scan();
                    },
                    enumerable: true,
                    configurable: true
                });
            } catch (error) {
                console.log("Browser must be IE8+ !");
            }
        }
    }

    L.prototype.init.prototype = L.prototype;
    window.L = L;
})(window);