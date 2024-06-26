! function(u) {
    "use strict";
    u(document).on("click", "[data-callout]", function(o) {
        u(this).zrCallout("show")
    }).on("mouseover focus", '[data-callout][data-hoverable="true"]', function(o) {
        if (a) return !(a = !1);
        var t = u(this);
        clearTimeout(t.data("horverableHideTimeout")), u(this).zrCallout("show")
    }).on("mouseout blur", '[data-callout][data-hoverable="true"]', function(o) {
        var t = u(this);
        clearTimeout(t.data("horverableHideTimeout")), t.data("horverableHideTimeout", setTimeout(function() {
            t.zrCallout("hide", !0)
        }, 100))
    }).on("mouseover focusin", '.zrCallout[data-hoverable="true"]', function(o) {
        for (var t, a = u(this).data("callout-object-callouts"), e = 0, l = a.length; e < l; e++) t = a[e], clearTimeout(t.$el.data("horverableHideTimeout"))
    }).on("mouseout blur", '.zrCallout[data-hoverable="true"]', function(o) {
        for (var t = u(this).data("callout-object-callouts"), a = 0, e = t.length; a < e; a++) ! function(o) {
            clearTimeout(o.data("horverableHideTimeout")), o.data("horverableHideTimeout", setTimeout(function() {
                o.zrCallout("hide", !0)
            }, 100))
        }(t[a].$el)
    }).on("mouseover focus", '[data-callout="tooltip"]', function(o) {
        if (a) return !(a = !1);
        u(this).zrCallout("show")
    }).on("mouseout blur", '[data-callout="tooltip"]', function(o) {
        u(this).zrCallout("hide", !0)
    }).on("touchstart", '[data-callout="tooltip"]', function(o) {
        i = !1, e = o.originalEvent.touches[0].pageX, l = o.originalEvent.touches[0].pageY
    }).on("touchend", '[data-callout="tooltip"]', function(o) {
        var t = o.originalEvent.changedTouches[0].pageX,
            o = o.originalEvent.changedTouches[0].pageY,
            t = Math.floor(Math.sqrt(Math.pow(t - e, 2) + Math.pow(o - l, 2)));
        !i && t < 10 && (a = !0, (n = u(this)).zrCallout("toggle"))
    });
    var a, e, l, i = !1,
        n = null;
    u(window).on("scroll", function() {
        i = !0, n && n.zrCallout("hide")
    }), u(window).on("show.bs.modal cbox_open", function() {
        u("[data-callout]").zrCallout("hide")
    }), u('[data-callout][data-show="true"]').zrCallout()
}(window.Zepto || window.jQuery || window.$);