! function() {
    "use strict";
    $.fn.multi_value = function(e) {
        var v = $.extend({
            value_template: '<div class="tag_item"><span class="value_text"></span><button type="button" class="tag_item_remove" title="remove this">Remove</button></div>',
            value_text_selector: ".value_text",
            remove_selector: ".tag_item_remove",
            currentValues: []
        }, e);
        return this.each(function() {
            function e(e) {
                e.preventDefault();
                var t = (e = v.input).val();
                return v.bool ? a(t) : r({
                    vals: t,
                    action: function(e) {
                        s.push(e)
                    }
                }), e.val(""), !1
            }

            function t(e) {
                var t;
                return e.preventDefault(), v.bool ? (t = Number($(this).parent().parent()[0].getAttribute("data-index")), s.splice(t, 1), a(), v.removeHook && v.removeHook(s), c.data("currentValues", s), c.trigger("multi_value_change")) : (t = (e = 0 == (e = (t = $(e.target)).siblings(v.value_text_selector)).size ? t.parent().siblings(v.value_text_selector) : e).text(), e = function(e, t) {
                    for (var r = 0; e[r] !== t && r < e.length - 1;) ++r;
                    if (e[r] === t) return e.splice(r, 1);
                    throw new Error(t + " not found in array " + e)
                }(s, t), $(this).parent().remove(), e && 0 < e.length && c.data("currentValues", s), c.trigger("multi_value_change")), !1
            }
            var c = $(this),
                s = v.currentValues,
                r = function(e) {
                    var t = e.vals,
                        r = "object" == typeof t ? t : [t],
                        a = e.action,
                        n = [];
                    if (v.preProcess && "function" == typeof v.preProcess && !v.preProcess(t)) return !1;
                    for (var o = 0; o < r.length; o++) {
                        var l, i, u = r[o];
                        0 < u.length && (-1 === s.indexOf(u) || e.init) && ((l = $(v.value_template)).find(v.value_text_selector).text(u), (i = v.postProcessValElem) && "function" == typeof i && i(l), n.push(l), "function" == typeof a) && a(u)
                    }
                    0 < n.length && (v.container.append(n), c.data("currentValues", s), c.trigger("multi_value_change"))
                },
                a = function(e) {
                    v.transformValues && (s = e ? v.transformValues(e, s) : s) && (e = v.updateDisplay(s), c.data("currentValues", s), c.data("queryStr", e), c.trigger("multi_value_change"))
                };
            0 < s.length && (v.bool ? a() : r({
                vals: s,
                init: !0
            }), c.data("currentValues", s)), v.bool ? (v.container.on("click", ".boolList " + v.remove_selector, t), v.container.on("click", ".boolopt", function(e) {
                var e = $(e.target),
                    t = e.html(),
                    e = e.closest(".tag_item");
                s[e.attr("data-index")].bool = t, a(), c.trigger("multi_value_change")
            })) : v.container.on("click", v.remove_selector, t), c.on("click blur", e), v.input.on("change select autocomplete_close", e)
        }), this
    }
}();