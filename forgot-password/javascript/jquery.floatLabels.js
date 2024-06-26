! function(i) {
    "use strict";

    function s(e, t, a) {
        a = a || !1;
        var l, r, n, s = i(e);
        s.is(t.filter) || (l = t.wrapper ? s.closest(t.wrapper) : s.parent()).length && ((n = l.find("label")).length || (r = e.id || s.attr("id", t.prepend + "input-" + (d += c++)).attr("id"), n = i("<label/>").html(e.placeholder || e.name).attr("for", r), l.prepend(n)), t.removePlaceholder && s.attr("placeholder") && s.attr({
            placeholder: ""
        }), setTimeout(function() {
            s.is(":focus") && s.val() ? l.addClass(t.focusedClass) : l.removeClass(t.focusedClass), "" !== s.val() || o && s[0].matches && s[0].matches(":-webkit-autofill") ? l.addClass(t.filledClass) : l.removeClass(t.filledClass)
        }, 0), a) && l.addClass(t.prepend + "wrapper")
    }
    var p = {
            wrapper: null,
            input: "input, textarea",
            filledClass: "filled",
            focusedClass: "focused",
            removePlaceholder: !0,
            prepend: "js-float-labels-",
            filter: '[type="checkbox"], [type="submit"], [type="hidden"], [type="image"], [type="button"], [type="image"], [type="date"]'
        },
        o = -1 !== navigator.userAgent.toLowerCase().indexOf("chrome"),
        d = (new Date).getTime(),
        c = 0,
        u = [],
        f = [];
    i.fn.floatLabels = function(e) {
        function t() {
            s(this, a)
        }
        var a = i.extend({}, p, e),
            e = this,
            l = (a.wrapper ? e.find(a.wrapper) : e).find(a.input),
            r = "focus blur propertychange change click keyup input paste",
            n = e.selector + "|" + a.input;
        return void 0 !== u[n] && (e.undelegate(a.input, r, u[n]), clearInterval(f[n])), u[n] = t, f[n] = setInterval(function() {
            l.each(t)
        }, 200), e.delegate(a.input, r, t), l.each(function() {
            s(this, a, !0)
        }), e
    }
}(window.jQuery || window.Zepto || window.$);