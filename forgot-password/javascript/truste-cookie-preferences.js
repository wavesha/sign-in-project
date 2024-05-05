! function(r) {
    "use strict";
    r(function() {
        function n() {
            var n, t, e, a, o = r('[data-auto-banner-name="truste_cookie_banner"]');
            return !!o.length && (e = function() {
                n.is(":hidden") && (clearInterval(t), o.remove(), r(window).trigger("auto_modal:adjust"))
            }, a = setInterval(function() {
                (n = r("#truste-consent-track")).length && !n.is(":hidden") && (o.removeClass("showing_truste_banner"), clearInterval(a), t = setInterval(e, 500), r(window).trigger("auto_modal:adjust"))
            }, 500), !0)
        }
        n() || (window.__auto_modal_fns = window.__auto_modal_fns || [n])
    })
}(window.jQuery);