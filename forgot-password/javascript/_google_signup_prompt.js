! function(g, n) {
    "use strict";
    n.page.model.doNotShowGoogleYolo || new n.GoogleYolo.ZrLoginOrRegister({
        clientId: n.page.model.GOOGLE_SIGNIN_CLIENT_ID,
        regMethod: n.page.model.google_signin_reg_method,
        loginMethod: n.page.model.google_signin_login_method,
        autoLoginMethod: n.page.model.google_signin_auto_login_method,
        autoLogin: n.page.model.google_signin_auto_login,
        disableAutoLogin: n.page.model.google_signin_disable_auto_login,
        search: n.page.model.google_signin_search,
        location: n.page.model.google_signin_location,
        encrypted_id: n.page.model.google_signin_encrypted_id
    }).showModal(function(o) {
        var e = "desktop";
        0 === parseInt(o.css("bottom")) && (e = "mobile"), g(document.body).addClass("yolo_pos_" + e)
    }).then(function(o) {
        o && o.success && (n.page.model.google_signin_refresh_and_apply ? (n.store({
            json: !1,
            session: !1
        }), window.location.reload(!0)) : n.page.model.google_signin_refresh ? window.location.reload(!0) : n.page.model.google_signin_next_url ? window.location = n.page.model.google_signin_next_url : o.data && o.data.next_url ? window.location.href = o.data.next_url : window.location.href = "/")
    }, function(o) {
        if (g(document).trigger("google_one_tap_closed"), o && o.type) switch (o.type) {
            case "tap_outside":
            case "user_cancel":
                var e;
                n.page.model.google_signin_close_cookie && ((e = new Date).setTime(e.getTime() + 6048e5), document.cookie = n.page.model.google_signin_close_cookie + "=1; expires=" + e.toUTCString() + "; path=/"), g(document).trigger("google_one_tap_closed")
        }
    })
}(window.jQuery, window.zr);