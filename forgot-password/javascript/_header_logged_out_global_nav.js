! function(i) {
    "use strict";
    i(function() {
        function a(e) {
            e.preventDefault(), t.toggleClass("active"), o.trigger("nav_toggle"), n.hasClass("site_header_open") ? (n.removeClass("site_header_open"), o.scrollTop(s)) : (s = i(window).scrollTop(), n.addClass("site_header_open"), o.scrollTop(0)), setTimeout(function() {
                o.trigger("header-adjust")
            }, 1)
        }
        var s, n = i("html"),
            e = i("body"),
            o = i(window),
            t = i(".nav_toggle");
        i.zrHoverIntent({
            selector: ".has_subnav",
            speed: 200
        }), e.delegate(".nav.force_open_nav .headline_nav", "touchstart", function(e) {
            ! function() {
                var e = i(this),
                    a = e.closest(".nav");
                a.is(".force_open") ? (e.blur(), i(".site_header .nav").removeClass("force_open")) : (i(".site_header .nav").removeClass("force_open"), a.addClass("force_open"))
            }.call(this, e)
        });
        t.on("click", function(e) {
            a(e)
        }), i(".has_subnav .headline_nav").on("click", function() {
            var e = i(this).closest(".nav"),
                a = !1;
            e.hasClass("active") ? e.removeClass("active") : (e.hasClass("enterprise_nav") && i(".smb_nav").hasClass("active") && (a = !0), i(".has_subnav.active").removeClass("active"), e.addClass("active"), a && i("html, body").animate({
                scrollTop: 0
            }, 300)), o.trigger("header-adjust")
        }), i(".sign_in_nav").on("click", function() {
            window.location = i(this).find("a").attr("href")
        }), o.on("solvvy-loaded", function(e) {
            t.hasClass("active") && a(e)
        })
    })
}(window.jQuery || window.Zepto || window.$);