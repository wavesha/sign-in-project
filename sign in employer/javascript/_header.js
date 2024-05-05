! function(s) {
    "use strict";

    function o() {
        a.removeClass("_header-stick").css("padding-top", 0);
        var t = i.height();
        a.addClass("_header-stick").css("padding-top", t), d.css({
            top: t
        }), e = !1, s(window).trigger("header-adjusted", t)
    }

    function t(t) {
        var e = s(window).scrollTop();
        e <= 0 ? a.addClass("at-top").removeClass("has-scrolled") : e < c ? a.removeClass("has-scrolled at-top") : a.addClass("has-scrolled").removeClass("at-top"), c = e
    }
    var e, n, a = s("body"),
        i = (s(document).delegate(".skip_to_content", "focusin", function(t) {
            s(this).addClass("focusIn")
        }).delegate(".skip_to_content", "focusout", function(t) {
            s(this).removeClass("focusIn")
        }).delegate(".skip_to_content a", "click", function(t) {
            var e = this.hash;
            s(e).is("input,select,textarea,button,object,a[href]") || s(e).attr("tabIndex", -1)
        }), s(".main_site_header")),
        d = s(".auto_right_rail_banners"),
        c = 0;
    s(window).bind("header-adjust", function(t, e) {
        o()
    }).bind("resize scroll", t).bind("resize", function() {
        e || (clearTimeout(n), n = setTimeout(o, 100))
    }), o(), t(), s("body").on("focus", "*", function() {
        this !== document.activeElement || i.get(0).contains(this) || s(this).hasClass("ReactModal__Content") || s(this).parents(".ReactModal__Content").length || setTimeout(function() {
            var t = s(this).offset().top,
                e = i.height();
            t - window.scrollY < e && (t = window.scrollY - e - 4, window.scrollTo(0, t))
        }.bind(this), 0)
    })
}(window.jQuery);