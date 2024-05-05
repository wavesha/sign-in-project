! function(d) {
    function a() {
        var a, e;
        window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD ? console.log("used back button") : (o = d("[data-auto-modal]").eq(0), (t = o.find(".modal").eq(0)).attr("data-modal-backdrop", o.data("auto-modal-backdrop")), t.attr("data-modal-focus", o.data("auto-modal-focus")), t.attr("data-modal-closable", o.data("auto-modal-closable")), t.attr("data-modal-opacity", o.data("auto-modal-opacity")), o.data("auto-modal-closable") || (t.attr("data-keyboard", "false"), t.attr("data-backdrop", "static")), o.length && ((l = o.data("auto-modal-cookie")) && d.cookie(l) ? t.trigger("hide.bs.modal") : (n = o.data("auto-modal"), i = o.data("auto-modal-name"), c = o.data("auto-modal-expires"), (a = o.data("auto-modal-delay")) && (m = 1e3 * parseInt(a)), "instant" === n ? u() : "delayed" === n ? setTimeout(function() {
            u()
        }, m) : "exit_back" === n ? s.bind("scroll", e = function() {
            function a() {
                t === document.location.href && "block" != d(".modal-backdrop").css("display") && u(), s.unbind("popstate", a)
            }
            var o = (new Date).getTime(),
                t = document.location.href;
            history.pushState({}, "", "#" + o), s.bind("popstate", a), s.unbind("scroll", e)
        }) : "exit" !== n && "exit_aggressive" !== n || setTimeout(function() {
            r.bind("mousemove", p)
        }, 1e3))))
    }
    var o, t, n, i, l, c, s = d(window),
        r = d("body"),
        m = 1e3,
        u = function() {
            d.log_event && d.log_event("auto_modal_show", {
                name: i,
                non_interaction: 1
            }), t.length && t.modal("show"), o.trigger("modal.am.show"), l && (c ? d.cookie(l, 1, {
                expires: c,
                path: "/"
            }) : d.cookie(l, 1, {
                path: "/"
            }))
        },
        p = function(a) {
            window.__skip_exit_modal || !("exit" === n && a.clientY < 8 || "exit_aggressive" === n && (a.clientY < 8 || a.clientX < 8 || s.width() - a.clientX < 8 || s.height() - a.clientY < 8)) || (a = d(a.target)).is(".noPop") || a.closest(".noPop").length || "block" != d(".modal-backdrop").css("display") && (u(), r.unbind("mousemove", p))
        };
    r.length ? a() : d(function() {
        r = d("body"), a()
    }), window.AUTO_MODAL = {
        fireAutoModal: a
    }
}(window.jQuery);