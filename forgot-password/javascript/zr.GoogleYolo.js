! function(t, i) {
    "use strict";

    function n() {
        this.src = "https://accounts.google.com/gsi/client", this.scriptTimeout = 500, this.yolo = null, this.async = "", this.modalShownResolve = function() {}, this.modalShownReject = function() {}, this.signInResolve = function() {}, this.signInReject = function() {}
    }
    n.prototype.loadScript = function() {
        var o = this;
        return new i(function(t, n) {
            var e = document.createElement("script");
            e.setAttribute("type", "text/javascript"), e.setAttribute("src", o.src), e.setAttribute("async", o.async), window.onGoogleLibraryLoad = function() {
                t && t()
            }, e.onerror = function(t) {
                n && n(t)
            }, document.getElementsByTagName("head")[0].appendChild(e)
        })
    }, n.prototype.showModal = function(t) {
        var e = this,
            n = new i(function(t, n) {
                e.modalShownResolve = t, e.modalShownReject = n
            }),
            o = (google.accounts.id.initialize({
                client_id: t,
                callback: function(t) {
                    e.signInResolve(t)
                }
            }), !1);
        return google.accounts.id.prompt(function(t) {
            t.isDisplayed() ? (e.modalShownResolve(), o = !0) : (o ? e.signInReject : e.modalShownReject)({
                type: t.getNotDisplayedReason() || t.getSkippedReason() || t.getDismissedReason()
            })
        }), n
    }, n.prototype.getCredentials = function() {
        var e = this;
        return new i(function(t, n) {
            e.signInResolve = t, e.signInReject = n
        })
    }, t.GoogleYolo = n
}(window.zr = window.zr || {}, (window.jQuery, window.Promise));