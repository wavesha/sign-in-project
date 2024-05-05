! function(a) {
    "use strict";
    window.zr = window.zr || {}, window.zr.DEBUG = /unminified/.test(function() {}), window.zr.log = function() {
        zr.DEBUG && console.log.apply(console, arguments)
    }, window.zr.util = {
        namespace: function(e, n, r) {
            if (void 0 === n && (n = null), e) {
                for (var t = e.split("."), o = window, c = 0; c < t.length - 1; c++) void 0 === o[t[c]] && (o[t[c]] = {}), o = o[t[c]];
                return !r && (o[t[t.length - 1]], 1) && (o[t[t.length - 1]] = n), o[t[t.length - 1]]
            }
        },
        keys: function(e) {
            return Object.keys(e)
        }
    }, window.zr.form = {
        get_field: function(e, n, r) {
            return e.find("input[name=" + (r ? r + "_" + n : n) + "]")
        },
        populate_form: function(e, n, r, t) {
            for (var o = 0; o < n.length; o++) {
                var c = n[o],
                    a = r[c] || "";
                zr.form.get_field(e, c, t).val(a)
            }
        },
        clear: function(e, n, r) {
            for (var t = 0; t < n.length; t++) {
                var o = n[t];
                zr.form.get_field(e, o, r).val("")
            }
        }
    }, window.zr.preference_path = function(e) {
        return "contact" === e ? "/jobseeker/preference" : "/" + e + "/preference"
    }, window.zr.preference = {
        set: function(e, n, r, t, o, c) {
            return !(!e || !n || null == r || (n = {
                pref_key: n,
                pref_value: r,
                _token: zr.page.model.set_preference_token
            }, c && (n.expire_seconds = c), "org" !== e && "user" !== e && "contact" !== e) || (a.ajax({
                url: window.zr.preference_path(e) + "/set",
                type: "POST",
                dataType: "json",
                data: n,
                error: function() {
                    o && o()
                },
                success: function(e) {
                    t && t(e)
                }
            }), 0))
        },
        get: function(e, n, r, t) {
            return r ? e && n && ("org" !== e && "user" !== e && "contact" !== e || a.ajax({
                url: window.zr.preference_path(e) + "/get",
                data: {
                    pref_key: n
                },
                type: "GET",
                dataType: "json",
                error: function() {
                    t && t()
                },
                success: function(e) {
                    r(e.data)
                }
            })) : console.log("zr.preference.get requires a success callback function"), !1
        },
        remove: function(e, n, r, t, o) {
            return !(!e || !n || (n = {
                pref_key: n,
                _token: r
            }, "org" !== e && "user" !== e && "contact" !== e) || (a.ajax({
                url: window.zr.preference_path(e) + "/remove",
                type: "POST",
                dataType: "json",
                data: n,
                error: function() {
                    o && o()
                },
                success: function(e) {
                    t && t(e)
                }
            }), 0))
        }
    }, window.zr.preference_external = {
        set: function(e, n, r, t, o, c) {
            return console.log("setting external preference"), !(!e || !n || null == r || (n = {
                pref_key: n,
                pref_value: r
            }, c && (n.expire_seconds = c), "org" !== e && "user" !== e && "contact" !== e) || (a.ajax({
                url: window.zr.preference_path(e) + "/external/set",
                type: "POST",
                dataType: "json",
                data: n,
                error: function() {
                    o && o()
                },
                success: function(e) {
                    t && t(e)
                }
            }), 0))
        },
        get: function(e, n, r, t) {
            return console.log("getting external preference"), !(!e || !n || "org" !== e && "user" !== e && "contact" !== e || (a.ajax({
                url: window.zr.preference_path(e) + "/external/get?pref_key=" + n,
                type: "GET",
                dataType: "json",
                error: function() {
                    t && t()
                },
                success: function(e) {
                    r && r(e.data)
                }
            }), 0))
        },
        remove: function(e, n, r, t, o) {
            return !(!e || !n || (n = {
                pref_key: n,
                _token: r
            }, "org" !== e && "user" !== e && "contact" !== e) || (a.ajax({
                url: window.zr.preference_path(e) + "/external/remove",
                type: "POST",
                dataType: "json",
                data: n,
                error: function() {
                    o && o()
                },
                success: function(e) {
                    t && t(e)
                }
            }), 0))
        }
    }
}(jQuery);