! function(t) {
    "use strict";
    t("#login_form").floatLabels(), document.location.hash && (a = (e = t('[name="next_url"]')).val()) && e.val(a + document.location.hash);
    var e, a, o, r = "#login_form";
    window.reCaptchaLoadCallback = function() {
        t.log_event("google_recaptcha_loaded"), o = grecaptcha.render("recaptcha_login", {
            sitekey: t("#recaptchaScript").data("sitekey"),
            badge: "bottomright",
            size: "invisible",
            callback: function() {
                t(r)[0].submit()
            }
        })
    }, t(function() {
        var a = t(r);
        a.validate({
            rules: {
                email: {
                    required: {
                        depends: function() {
                            var e = t(this),
                                a = e.val();
                            return a.match(/^\s+|\s+$/) && e.val(t.trim(a)), !0
                        }
                    },
                    email: !0
                },
                password: {
                    required: !0
                }
            },
            messages: {
                email: "Please enter a valid email address"
            },
            submitHandler: function(e) {
                return window.grecaptcha ? grecaptcha.execute(o) : a[0].submit(), !1
            }
        })
    }), t("#forgotPasswordLink").click(function() {
        var e;
        e = "members", e = "realm=" + (e = t("#job_seeker_realm").attr("checked") ? "candidates" : e), zr.page.model.next_url && (e += "&next_url=" + encodeURIComponent(zr.page.model.next_url)), zr.page.model.email && (e += "&email=" + encodeURIComponent(zr.page.model.email)), document.location = "/login/forgot-password?" + e
    })
}(window.jQuery);