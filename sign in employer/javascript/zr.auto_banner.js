! function(t, o) {
    function r() {
        n.css("margin-bottom", 0);
        var e = i.height();
        n.css("margin-bottom", e), a = !1
    }
    var a, e, n = t(document.body),
        i = t(".auto_banners");
    t(document).delegate('[data-type="auto_banner_close"]', "click", function() {
        var e = t(this),
            a = e.closest('[data-type="auto_banner"]'),
            e = (a.addClass("hiding"), e.closest(".auto_right_rail_banners").length && t(document.body).removeClass("has_right_rail"), t(window).trigger("auto_banner_close", {
                $auto_banner: a
            }), setTimeout(function() {
                a.remove(), r(), t(window).trigger("header-adjust")
            }, 300), a.data("auto-banner-cookie")),
            n = a.data("auto-banner-expires"),
            n = (e && (n ? t.cookie(e, 1, {
                expires: n,
                path: "/"
            }) : t.cookie(e, 1, {
                path: "/"
            })), a.data("auto-banner-user-preference")),
            e = a.data("auto-banner-user-preference-token");
        n && e && o && o.preference && (o.page.model.set_preference_token = e, o.preference.set("user", n, 1))
    }), t('[data-type="auto_banner"]').each(function() {
        var e, a = t(this),
            n = a.data("auto-banner-cookie");
        a.data("auto-banner-name");
        n && t.cookie(n) ? a.hide() : (t.log_event && t.log_event("auto_banner_show", {
            name: a.data("auto-banner-name"),
            non_interaction: 1
        }), a.data("auto-banner-external-script") && (e = t("<script/>").attr("crossorigin", "crossorigin").attr("async", "async").appendTo(a.find(".auto_banner_message")), setTimeout(function() {
            e.attr("src", a.data("auto-banner-external-script"))
        }, 100)))
    }), t(window).bind("auto_banner:adjust", function(e, a) {
        r()
    }).bind("resize", function() {
        a || (clearTimeout(e), e = setTimeout(r, 100))
    }), r()
}(window.jQuery, window.zr);