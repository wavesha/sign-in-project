! function(g) {
    "use strict";

    function o(t, e) {
        var o, i, a = this,
            s = (this.$el = t, this.tooltip = !1, t.data(b, this), {});
        for (o in w) w.hasOwnProperty(o) && (i = o.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), void 0 !== (i = t.data(i))) && (s[o] = i);
        var l = g.extend({}, w, s, e);
        if ("tooltip" === (e = (this.options = l).callout || t.data("callout"))) {
            (d = l.tooltipTarget ? g(l.tooltipTarget).first() : g('<span class="zrCallout-tooltip"></span>').text(t.attr("title") || t.attr("data-title"))).css("visibility", "hidden");
            var n = "zrCallout-" + ++m;
            d.attr({
                id: n,
                role: "tooltip"
            }), l.tooltipIsLabel ? t.attr("aria-labelledby", n) : t.attr("aria-describedby", n), t.attr("title", "").attr("data-title", ""), l.addClose = !1, this.tooltip = !0, d.appendTo(document.body), new MutationObserver(function() {
                t.attr("title").length || t.attr("data-title").length ? (d.text(t.attr("title") || t.attr("data-title")), d.append(d.data(b + "-arrow")), t.attr("title", "").attr("data-title", "")) : a.toggle()
            }).observe(t.get(0), {
                attributes: !0,
                attributeFilter: ["title", "data-title"]
            })
        } else {
            for (var r, d = g(e).attr("tabIndex", -1).on("keyup", function(t) {
                    27 === t.keyCode && a.hide()
                }), c = (d = l.hoverable ? g(e).attr("data-hoverable", "true") : d).data(b + "-callouts") || [], h = 0, p = c.length; h < p; h++)(r = c[h]).hide(), r.popper.destroy(), r.$el.data(b, null), delete c[h];
            (c = []).push(this), d.data(b + "-callouts", c);
            n = d.data(b + "-close") || g('<button class="close" data-close="callout">' + l.closeText + "</button>");
            d.data(b + "-close", n), d.append(n), l.addClose || n.addClass("visually-hidden"), l.backdrop && (d.attr({
                role: "dialogue"
            }).appendTo(document.body).css({
                zIndex: 1010
            }), this.$backdrop = g("<div/>").addClass(b + "-backdrop").css({
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1009
            }).hide().appendTo(document.body).on("click", function() {
                a.hide()
            }), g("<span/>").text("Focus dialogue...").addClass(b + "-bounce").appendTo(d).attr({
                tabindex: 0
            }).css({
                height: "1px",
                width: "1px",
                opacity: 0,
                position: "absolute"
            }).on("focus", function() {
                d.focus()
            }))
        }
        this.$callout = d;
        var u, f = v || 15,
            e = {
                placement: l.placement,
                positionFixed: !0,
                eventsEnabled: !0,
                modifiers: {
                    preventOverflow: {
                        enabled: !0,
                        boundariesElement: "window",
                        padding: f,
                        fn: function(t, e) {
                            var o = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                            return (t = Popper.Defaults.modifiers.preventOverflow.fn(t, e)).offsets.popper.left + t.offsets.popper.width > o + f && (t.offsets.popper.left = o - t.offsets.popper.width - f), t
                        }
                    },
                    keepTogether: {
                        enabled: !0
                    }
                }
            },
            n = (l.addArrow && (n = d.data(b + "-arrow") || g('<span class="arrow"></span>'), d.data(b + "-arrow", n), d.append(n), e.modifiers.arrow = {
                element: n[0]
            }), new Popper(t[0], d[0], e));
        this.popper = n, l.show && this.show(), t.on("click", function() {
            setTimeout(function() {
                a.popper.update()
            }, 0)
        }), this.tooltip || (d.on("click", '[data-close="callout"]', function(t) {
            t.preventDefault(), a.hide(!0)
        }), l.trigger && t.on(l.trigger, function() {
            a.showing ? l.toggle ? a.hide() : (d.removeClass("toggle-try"), clearTimeout(u), setTimeout(function() {
                d.addClass("toggle-try"), u = setTimeout(function() {
                    d.removeClass("toggle-try")
                }, 1e3)
            }, 0)) : a.show()
        }), l.closeOnClick && d.on("click", function(t) {
            g(t.target).is("a, button") || a.hide()
        }))
    }

    function i(t, e) {
        return t.data(b) || new o(t, e)
    }
    var a, w = {
            addClose: !0,
            closeText: "Close",
            closeOnClick: !1,
            addArrow: !0,
            placement: "bottom",
            show: !1,
            trigger: "click",
            toggle: !0,
            animation: !1,
            backdrop: !1,
            tooltipTarget: null,
            hoverable: !1,
            tooltipIsLabel: !1,
            callout: null
        },
        b = "callout-object",
        m = Date.now();
    o.prototype.show = function() {
        var t, e = this.$callout,
            o = this,
            i = e.data(b + "-callouts");
        for (t in i) i.hasOwnProperty(t) && o !== i[t] && i[t].hide();
        this.showing = !0, this.$el.addClass("showing"), this.tooltip ? (a && o !== a && a.hide(), a = this, e.addClass("showing"), setTimeout(function() {
            o.popper.update(), e.css("visibility", "")
        }, 0)) : (this.$backdrop && (this.$backdrop.show(), g(document).off("focusin").on("focusin", function(t) {
            document !== t.target && o.$callout[0] !== t.target && o.$el[0] !== t.target && 0 === o.$callout.has(t.target).length && (o.$el.focus(), o.$callout.focus())
        })), e.show(), this.popper.update(), this.options.hoverable || e.focus(), this.options.animation && (e.addClass("toggle-showing-start"), setTimeout(function() {
            e.addClass("toggle-showing").removeClass("toggle-showing-start"), setTimeout(function() {
                e.removeClass("toggle-showing")
            }, 1e3)
        }, 0))), this.$el.trigger("show.zr.callout")
    }, o.prototype.hide = function(t, e) {
        this.showing && (this.showing = !1, this.$el.removeClass("showing"), this.tooltip ? (this.$callout.removeClass("showing"), a = null) : (this.$callout.hide(), this.$backdrop && (g(document).off("focusin"), this.$backdrop.hide(), e || this.$el.focus())), this.$el.trigger("hide.zr.callout", {
            closeButton: t
        }))
    }, o.prototype.toggle = function() {
        this.showing ? this.hide(void 0, !0) : this.show()
    };
    g.fn.zrCallout = function(t, e) {
        return "string" == typeof t ? "show" === t ? this.each(function() {
            i(g(this), {
                show: !0
            }).show()
        }) : "hide" === t ? this.each(function() {
            i(g(this)).hide(void 0, !e)
        }) : "toggle" === t && this.each(function() {
            i(g(this)).toggle()
        }) : this.each(function() {
            i(g(this), t)
        }), this
    };
    var v = function() {
        var t = document.createElement("div"),
            e = (t.style.visibility = "hidden", t.style.width = "100px", t.style.msOverflowStyle = "scrollbar", document.body.appendChild(t), t.offsetWidth);
        t.style.overflow = "scroll";
        (o = document.createElement("div")).style.width = "100%", t.appendChild(o);
        var o = o.offsetWidth;
        return t.parentNode.removeChild(t), e - o
    }()
}(window.Zepto || window.jQuery || window.$);