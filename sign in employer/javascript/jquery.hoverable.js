! function(e) {
    function s() {
        var a = e(this);
        a.addClass(a.data("hoverable-addClass"))
    }

    function d() {
        var a = e(this);
        a.removeClass(a.data("hoverable-addClass"))
    }
    var t = e("body"),
        o = {
            addClass: "hovered"
        };
    e.fn.hoverable = function(a) {
        a = e.extend({}, o, a = "string" == typeof a ? {
            addClass: o.addClass + " " + a
        } : a);
        return this.data("hoverable-addClass", a.addClass), t.delegate(this.selector, "mouseenter focusin", s).delegate(this.selector, "mouseleave focusout", d), this
    }
}(window.jQuery);