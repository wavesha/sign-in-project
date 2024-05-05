// is copyright 2008 A Beautiful Site, LLC.
! function(n) {
    var s = {};
    n.alerts = {
        verticalOffset: -75,
        horizontalOffset: 0,
        repositionOnResize: !0,
        overlayOpacity: .01,
        overlayColor: "#FFF",
        draggable: !0,
        okButton: "&nbsp;OK&nbsp;",
        cancelButton: "&nbsp;Cancel&nbsp;",
        dialogClass: null,
        _overrides: {},
        alert: function(e, p, o, t, a) {
            s = a || {}, n.alerts._show(p = null == p ? "Alert" : p, e, null, "alert", function(e) {
                o && o(e)
            }, t)
        },
        confirm: function(e, p, o, t, a) {
            s = a || {}, n.alerts._show(p = null == p ? "Confirm" : p, e, null, "confirm", function(e) {
                o && o(e)
            }, t)
        },
        prompt: function(e, p, o, t, a, i) {
            s = i || {}, n.alerts._show(o = null == o ? "Prompt" : o, e, p, "prompt", function(e) {
                t && t(e)
            }, a)
        },
        loader: function(e) {
            n.alerts._show(e, null, null, "loader")
        },
        _show: function(e, p, o, t, a, i) {
            n.alerts._hide(), n.alerts._overlay("show"), n("BODY").append('<div id="popup_container"><h1 id="popup_title"></h1><div id="popup_content"><div id="popup_message"></div></div></div>'), (s.dialogClass || n.alerts.dialogClass) && n("#popup_container").addClass(s.dialogClass || n.alerts.dialogClass);
            switch (n("#popup_container").css({
                position: "fixed",
                zIndex: 99999,
                padding: 0,
                margin: 0
            }), n("#popup_title").text(e), n("#popup_content").addClass(t), n("#popup_message").text(p), n("#popup_message").html(n("#popup_message").text().replace(/\n/g, "<br />")), n("#popup_container").css({
                minWidth: n("#popup_container").outerWidth(),
                maxWidth: n("#popup_container").outerWidth()
            }), n.alerts._reposition(), n.alerts._maintainPosition(!0), t) {
                case "alert":
                    n("#popup_message").after('<div id="popup_panel"><input type="button" value="' + (s.okButton || n.alerts.okButton) + '" id="popup_ok" class="btn"/></div>'), i && (n("#popup_panel").after('<div id="popup_submessage"></div>'), n("#popup_submessage").text(i), n("#popup_submessage").html(n("#popup_submessage").text().replace(/\n/g, "<br />"))), n("#popup_ok").click(function() {
                        n.alerts._hide(), a(!0)
                    }), n("#popup_ok").focus().on("keypress", function(e) {
                        13 != e.keyCode && 27 != e.keyCode || n("#popup_ok").trigger("click")
                    });
                    break;
                case "confirm":
                    n("#popup_message").after('<div id="popup_panel"><input type="button" value="' + (s.okButton || n.alerts.okButton) + '" id="popup_ok" class="btn"/> <input type="button" value="' + (s.cancelButton || n.alerts.cancelButton) + '" id="popup_cancel" class="btn"/></div>'), i && (n("#popup_panel").after('<div id="popup_submessage"></div>'), n("#popup_submessage").text(i), n("#popup_submessage").html(n("#popup_submessage").text().replace(/\n/g, "<br />"))), n("#popup_ok").click(function() {
                        n.alerts._hide(), a && a(!0)
                    }), n("#popup_cancel").click(function() {
                        n.alerts._hide(), a && a(!1)
                    }), n("#popup_ok").focus(), n("#popup_ok, #popup_cancel").on("keypress", function(e) {
                        13 == e.keyCode && n("#popup_ok").trigger("click"), 27 == e.keyCode && n("#popup_cancel").trigger("click")
                    });
                    break;
                case "prompt":
                    n("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + n.alerts.okButton + '" id="popup_ok" class="btn"/> <input type="button" value="' + n.alerts.cancelButton + '" id="popup_cancel" class="btn"/></div>'), n("#popup_prompt").width(n("#popup_message").width()), i && (n("#popup_panel").after('<div id="popup_submessage"></div>'), n("#popup_submessage").text(i), n("#popup_submessage").html(n("#popup_submessage").text().replace(/\n/g, "<br />"))), n("#popup_ok").click(function() {
                        var e = n("#popup_prompt").val();
                        n.alerts._hide(), a && a(e)
                    }), n("#popup_cancel").click(function() {
                        n.alerts._hide(), a && a(null)
                    }), n("#popup_prompt, #popup_ok, #popup_cancel").on("keypress", function(e) {
                        13 == e.keyCode && n("#popup_ok").trigger("click"), 27 == e.keyCode && n("#popup_cancel").trigger("click")
                    }), o && n("#popup_prompt").val(o), n("#popup_prompt").focus().select();
                    break;
                case "loader":
                    n("#popup_message").html(`
            <svg class="zrs_spinner" width="66px" height="66px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="25"></circle>
            </svg>
          `)
            }
            if (s.draggable || n.alerts.draggable) try {
                n("#popup_container").draggable({
                    handle: n("#popup_title")
                }), n("#popup_title").css({
                    cursor: "move"
                })
            } catch (e) {}
        },
        _hide: function() {
            n("#popup_container").remove(), n.alerts._overlay("hide"), n.alerts._maintainPosition(!1)
        },
        _overlay: function(e) {
            switch (e) {
                case "show":
                    n.alerts._overlay("hide"), n("BODY").append('<div id="popup_overlay"></div>'), n("#popup_overlay").css({
                        position: "absolute",
                        zIndex: 99998,
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        height: n(document).height(),
                        background: s.overlayColor || n.alerts.overlayColor,
                        opacity: s.overlayOpacity || n.alerts.overlayOpacity
                    });
                    break;
                case "hide":
                    n("#popup_overlay").remove()
            }
        },
        _reposition: function() {
            var e = n(window).height() / 2 - n("#popup_container").outerHeight(!0) / 2 + (s.verticalOffset || n.alerts.verticalOffset),
                p = n(window).width() / 2 - n("#popup_container").outerWidth(!0) / 2 + (s.horizontalOffset || n.alerts.horizontalOffset);
            e < 0 && (e = 0), p < 0 && (p = 0), n("#popup_container").css({
                top: e + "px",
                left: p + "px"
            }), n("#popup_overlay").height(n(document).height())
        },
        _maintainPosition: function(e) {
            if (s.repositionOnResize || n.alerts.repositionOnResize) switch (e) {
                case !0:
                    n(window).bind("resize", n.alerts._reposition);
                    break;
                case !1:
                    n(window).unbind("resize", n.alerts._reposition)
            }
        }
    }, jAlert = function(e, p, o, t, a) {
        n.alerts.alert(e, p, o, t, a)
    }, jConfirm = function(e, p, o, t, a) {
        n.alerts.confirm(e, p, o, t, a)
    }, jPrompt = function(e, p, o, t, a, i) {
        n.alerts.prompt(e, p, o, t, a, i)
    }, jConfirmDialogWithLoader = ({
        callback: p,
        cancelButton: o,
        errorMessage: t,
        loadMessage: e,
        okButton: a,
        title: i
    }) => {
        n.alerts.loader(i), e().then(e => {
            n.alerts._hide(), n.alerts.confirm(e, i, p, null, {
                cancelButton: o,
                okButton: a
            })
        }).catch(e => {
            n.alerts._hide();
            n.alerts.alert(t, i, () => p(!1, e))
        })
    }
}(jQuery);