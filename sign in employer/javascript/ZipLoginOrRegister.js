! function(e) {
    "use strict";

    function o(e) {
        this.clientId = e.clientId, this.loginMethod = e.loginMethod || "google_login.unknown", this.autoLoginMethod = e.autoLoginMethod || "google_login.unknown.auto", this.regMethod = e.regMethod || "google_reg.unknown", this.autoLogin = e.autoLogin || !1, this.disableAutoLogin = e.disableAutoLogin || !1, this.search = e.search, this.location = e.location, this.encrypted_id = e.encrypted_id, this.zrLoginOrRegisterUri = e.zrLoginOrRegisterUri || "/auth/api/google_login_or_reg/v1", this.zrLoginOrRegisterParams = e.zrLoginOrRegisterParams || {}
    }
    o.prototype.showModal = function(i) {
        var o = new zr.GoogleYolo,
            t = this;
        return o.loadScript().then(function() {
            return t.disableAutoLogin && o.yolo.disableAutoSignIn(), o.showModal(t.clientId)
        }).then(function() {
            var t, e = o.getCredentials();
            return i && (t = $('iframe[src^="https://accounts.google.com/gsi/iframe/select"]')).length && new MutationObserver(function(e, o) {
                o.disconnect(), i(t)
            }).observe(t[0], {
                attributes: !0,
                childList: !1,
                subtree: !1
            }), e
        }).then(function(e) {
            return t.loginOrRegister(e)
        })
    }, o.prototype.loginOrRegister = function(i) {
        var n = this,
            r = i.id;
        return new Promise(function(o, t) {
            var e = {
                token: i.credential,
                reg_method: n.regMethod,
                login_method: i.__auto ? n.autoLoginMethod : n.loginMethod
            };
            n.search && (e.search = n.search), n.location && (e.location = n.location), n.encrypted_id && (e.encrypted_id = n.encrypted_id), $.extend(e, n.zrLoginOrRegisterParams), $.ajax(n.zrLoginOrRegisterUri, {
                method: "POST",
                data: e
            }).done(function(e) {
                (e.success ? (e.email_address = r, o) : t)(e)
            }).fail(function(e) {
                clearInterval(n.iframeCheckInterval);
                try {
                    "user_already_logged_in" === e.responseJSON.data.error_code && document.location.reload(!0)
                } catch (e) {}
                t(e)
            })
        })
    }, e.ZrLoginOrRegister = o
}(window.zr.GoogleYolo);