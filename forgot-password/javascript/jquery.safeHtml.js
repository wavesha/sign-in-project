! function(e) {
    "use strict";

    function r(t, n) {
        return t = "string" == typeof(t = Array.isArray(t) ? t.concat("") : t) ? n ? e.stripHtml(t) : e.filterHtml(t) : t
    }
    var i = e.fn.html,
        f = e.fn.append,
        u = e.fn.prepend,
        n = e("<div>"),
        l = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        },
        c = /[&<>"']/g,
        s = RegExp(c.source);
    e.escape = function(t) {
        return t && s.test(t) ? t.replace(c, function(t) {
            return l[t]
        }) : t
    }, e.stripHtml = function(t) {
        return t = e.filterHtml(t), t = n.html(t).text(), n.empty(), t
    }, e.filterHtml = function(t) {
        return t = DOMPurify.sanitize(t)
    };
    e.fn.safeHtml = function(t, n) {
        var e = this[0] || {};
        return void 0 === t && 1 === e.nodeType ? e.innerHTML : (t = r(t, n), i.call(this, t))
    }, e.fn.safeAppend = function(t, n) {
        return t = r(t, n), f.call(this, t)
    }, e.fn.safePrepend = function(t, n) {
        return t = r(t, n), u.call(this, t)
    }
}(window.jQuery);