! function(u) {
    "use strict";
    var i = u(document),
        l = {
            selector: null,
            speed: 200
        };
    u.zrHoverIntent = function(e) {
        var o, t, s, n, r, e = u.extend({}, l, e = "string" == typeof e ? {
            selector: e
        } : e);

        function a() {
            u(n).removeClass("mouseover").removeClass("focusin"), t.addClass("mouseover")
        }
        e.selector && (e = e, s = u("html"), n = e.selector, r = e.speed, i.delegate(n, "mouseover", function() {
            clearTimeout(t ? t.data("outTO") : void 0), clearTimeout(o), t = u(this), u(n).filter(".mouseover").length ? o = setTimeout(a, r) : a(), s.addClass("hoverIntent_open")
        }).delegate(n, "focusin", function() {
            t = u(this), u(n).removeClass("mouseover").removeClass("focusin"), t.addClass("focusin"), s.addClass("hoverIntent_open")
        }).delegate(n, "mouseout", function() {
            t && t.data("outTO", setTimeout(function() {
                t.removeClass("mouseover"), s.removeClass("hoverIntent_open")
            }, r))
        }).delegate(n, "focusout", function() {
            t && (t.removeClass("focusin").removeClass("force_open"), s.removeClass("hoverIntent_open"))
        }).delegate(n, "keypress", function(e) {
            e = e.keyCode || e.which;
            13 !== e && 32 !== e || (t.addClass("clickedin"), t.find("button").attr("aria-expanded", "true"), t.find("a").removeAttr("tabindex"))
        }))
    }
}(window.jQuery);