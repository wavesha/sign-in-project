/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.15.0
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Popper = t()
}(this, function() {
    "use strict";
    for (var e = "undefined" != typeof window && "undefined" != typeof document, t = ["Edge", "Trident", "Firefox"], n = 0, o = 0; o < t.length; o += 1)
        if (e && 0 <= navigator.userAgent.indexOf(t[o])) {
            n = 1;
            break
        }
    var S = e && window.Promise ? function(e) {
        var t = !1;
        return function() {
            t || (t = !0, window.Promise.resolve().then(function() {
                t = !1, e()
            }))
        }
    } : function(e) {
        var t = !1;
        return function() {
            t || (t = !0, setTimeout(function() {
                t = !1, e()
            }, n))
        }
    };

    function s(e) {
        return e && "[object Function]" === {}.toString.call(e)
    }

    function d(e, t) {
        return 1 !== e.nodeType ? [] : (e = e.ownerDocument.defaultView.getComputedStyle(e, null), t ? e[t] : e)
    }

    function f(e) {
        return "HTML" === e.nodeName ? e : e.parentNode || e.host
    }

    function l(e) {
        if (!e) return document.body;
        switch (e.nodeName) {
            case "HTML":
            case "BODY":
                return e.ownerDocument.body;
            case "#document":
                return e.body
        }
        var t = d(e),
            n = t.overflow,
            o = t.overflowX,
            t = t.overflowY;
        return /(auto|scroll|overlay)/.test(n + t + o) ? e : l(f(e))
    }
    var r = e && !(!window.MSInputMethodContext || !document.documentMode),
        W = e && /MSIE 10/.test(navigator.userAgent);

    function c(e) {
        return 11 === e ? r : 10 !== e && r || W
    }

    function u(e) {
        if (!e) return document.documentElement;
        for (var t = c(10) ? document.body : null, n = e.offsetParent || null; n === t && e.nextElementSibling;) n = (e = e.nextElementSibling).offsetParent;
        var o = n && n.nodeName;
        return o && "BODY" !== o && "HTML" !== o ? -1 !== ["TH", "TD", "TABLE"].indexOf(n.nodeName) && "static" === d(n, "position") ? u(n) : n : (e ? e.ownerDocument : document).documentElement
    }

    function i(e) {
        return null !== e.parentNode ? i(e.parentNode) : e
    }

    function p(e, t) {
        var n, o, r;
        return e && e.nodeType && t && t.nodeType ? (o = (r = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) ? e : t, r = r ? t : e, (n = document.createRange()).setStart(o, 0), n.setEnd(r, 0), e !== (n = n.commonAncestorContainer) && t !== n || o.contains(r) ? "BODY" === (r = (o = n).nodeName) || "HTML" !== r && u(o.firstElementChild) !== o ? u(n) : n : (r = i(e)).host ? p(r.host, t) : p(e, i(t).host)) : document.documentElement
    }

    function h(e, t) {
        var t = "top" === (1 < arguments.length && void 0 !== t ? t : "top") ? "scrollTop" : "scrollLeft",
            n = e.nodeName;
        return ("BODY" === n || "HTML" === n ? (n = e.ownerDocument.documentElement, e.ownerDocument.scrollingElement || n) : e)[t]
    }

    function a(e, t) {
        var t = "x" === t ? "Left" : "Top",
            n = "Left" == t ? "Right" : "Bottom";
        return parseFloat(e["border" + t + "Width"], 10) + parseFloat(e["border" + n + "Width"], 10)
    }

    function m(e, t, n, o) {
        return Math.max(t["offset" + e], t["scroll" + e], n["client" + e], n["offset" + e], n["scroll" + e], c(10) ? parseInt(n["offset" + e]) + parseInt(o["margin" + ("Height" === e ? "Top" : "Left")]) + parseInt(o["margin" + ("Height" === e ? "Bottom" : "Right")]) : 0)
    }

    function g(e) {
        var t = e.body,
            e = e.documentElement,
            n = c(10) && getComputedStyle(e);
        return {
            height: m("Height", t, e, n),
            width: m("Width", t, e, n)
        }
    }
    var b = function(e, t, n) {
        return t && v(e.prototype, t), n && v(e, n), e
    };

    function v(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }

    function w(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }
    var y = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n, o = arguments[t];
            for (n in o) Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n])
        }
        return e
    };

    function x(e) {
        return y({}, e, {
            right: e.left + e.width,
            bottom: e.top + e.height
        })
    }

    function E(e) {
        var t = {};
        try {
            c(10) ? (t = e.getBoundingClientRect(), n = h(e, "top"), o = h(e, "left"), t.top += n, t.left += o, t.bottom += n, t.right += o) : t = e.getBoundingClientRect()
        } catch (e) {}
        var n = {
                left: t.left,
                top: t.top,
                width: t.right - t.left,
                height: t.bottom - t.top
            },
            o = "HTML" === e.nodeName ? g(e.ownerDocument) : {},
            t = o.width || e.clientWidth || n.right - n.left,
            o = o.height || e.clientHeight || n.bottom - n.top,
            t = e.offsetWidth - t,
            o = e.offsetHeight - o;
        return (t || o) && (t -= a(e = d(e), "x"), o -= a(e, "y"), n.width -= t, n.height -= o), x(n)
    }

    function O(e, t, n) {
        var n = 2 < arguments.length && void 0 !== n && n,
            o = c(10),
            r = "HTML" === t.nodeName,
            i = E(e),
            s = E(t),
            e = l(e),
            a = d(t),
            f = parseFloat(a.borderTopWidth, 10),
            p = parseFloat(a.borderLeftWidth, 10),
            s = (n && r && (s.top = Math.max(s.top, 0), s.left = Math.max(s.left, 0)), x({
                top: i.top - s.top - f,
                left: i.left - s.left - p,
                width: i.width,
                height: i.height
            }));
        return s.marginTop = 0, s.marginLeft = 0, !o && r && (i = parseFloat(a.marginTop, 10), r = parseFloat(a.marginLeft, 10), s.top -= f - i, s.bottom -= f - i, s.left -= p - r, s.right -= p - r, s.marginTop = i, s.marginLeft = r), s = (o && !n ? t.contains(e) : t === e && "BODY" !== e.nodeName) ? function(e, t, n) {
            var n = 2 < arguments.length && void 0 !== n && n,
                o = h(t, "top"),
                t = h(t, "left"),
                n = n ? -1 : 1;
            return e.top += o * n, e.bottom += o * n, e.left += t * n, e.right += t * n, e
        }(s, t) : s
    }

    function L(e) {
        if (!e || !e.parentElement || c()) return document.documentElement;
        for (var t = e.parentElement; t && "none" === d(t, "transform");) t = t.parentElement;
        return t || document.documentElement
    }

    function T(e, t, n, o, r) {
        var i, r = 4 < arguments.length && void 0 !== r && r,
            s = {
                top: 0,
                left: 0
            },
            a = r ? L(e) : p(e, t),
            a = ("viewport" === o ? s = function(e, t) {
                var t = 1 < arguments.length && void 0 !== t && t,
                    n = e.ownerDocument.documentElement,
                    e = O(e, n),
                    o = Math.max(n.clientWidth, window.innerWidth || 0),
                    r = Math.max(n.clientHeight, window.innerHeight || 0),
                    i = t ? 0 : h(n),
                    t = t ? 0 : h(n, "left");
                return x({
                    top: i - e.top + e.marginTop,
                    left: t - e.left + e.marginLeft,
                    width: o,
                    height: r
                })
            }(a, r) : (i = void 0, "scrollParent" === o ? "BODY" === (i = l(f(t))).nodeName && (i = e.ownerDocument.documentElement) : i = "window" === o ? e.ownerDocument.documentElement : o, t = O(i, a, r), "HTML" !== i.nodeName || function e(t) {
                var n = t.nodeName;
                return "BODY" !== n && "HTML" !== n && ("fixed" === d(t, "position") || !!(n = f(t)) && e(n))
            }(a) ? s = t : (r = (o = g(e.ownerDocument)).height, i = o.width, s.top += t.top - t.marginTop, s.bottom = r + t.top, s.left += t.left - t.marginLeft, s.right = i + t.left)), "number" == typeof(n = n || 0));
        return s.left += a ? n : n.left || 0, s.top += a ? n : n.top || 0, s.right -= a ? n : n.right || 0, s.bottom -= a ? n : n.bottom || 0, s
    }

    function D(e, t, n, o, r, i) {
        var s, i = 5 < arguments.length && void 0 !== i ? i : 0;
        return -1 === e.indexOf("auto") ? e : (o = T(n, o, i, r), s = {
            top: {
                width: o.width,
                height: t.top - o.top
            },
            right: {
                width: o.right - t.right,
                height: o.height
            },
            bottom: {
                width: o.width,
                height: o.bottom - t.bottom
            },
            left: {
                width: t.left - o.left,
                height: o.height
            }
        }, (0 < (r = (i = Object.keys(s).map(function(e) {
            return y({
                key: e
            }, s[e], {
                area: (e = s[e]).width * e.height
            })
        }).sort(function(e, t) {
            return t.area - e.area
        })).filter(function(e) {
            var t = e.width,
                e = e.height;
            return t >= n.clientWidth && e >= n.clientHeight
        })).length ? r : i)[0].key + ((t = e.split("-")[1]) ? "-" + t : ""))
    }

    function M(e, t, n, o) {
        o = 3 < arguments.length && void 0 !== o ? o : null;
        return O(n, o ? L(t) : p(t, n), o)
    }

    function N(e) {
        var t = e.ownerDocument.defaultView.getComputedStyle(e),
            n = parseFloat(t.marginTop || 0) + parseFloat(t.marginBottom || 0),
            t = parseFloat(t.marginLeft || 0) + parseFloat(t.marginRight || 0);
        return {
            width: e.offsetWidth + t,
            height: e.offsetHeight + n
        }
    }

    function F(e) {
        var t = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom"
        };
        return e.replace(/left|right|bottom|top/g, function(e) {
            return t[e]
        })
    }

    function j(e, t, n) {
        n = n.split("-")[0];
        var e = N(e),
            o = {
                width: e.width,
                height: e.height
            },
            r = -1 !== ["right", "left"].indexOf(n),
            i = r ? "top" : "left",
            s = r ? "left" : "top",
            a = r ? "height" : "width",
            r = r ? "width" : "height";
        return o[i] = t[i] + t[a] / 2 - e[a] / 2, o[s] = n === s ? t[s] - e[r] : t[F(s)], o
    }

    function H(e, t) {
        return Array.prototype.find ? e.find(t) : e.filter(t)[0]
    }

    function I(e, n, t) {
        var o, r;
        return (void 0 === t ? e : e.slice(0, (e = e, o = "name", r = t, Array.prototype.findIndex ? e.findIndex(function(e) {
            return e[o] === r
        }) : (t = H(e, function(e) {
            return e[o] === r
        }), e.indexOf(t))))).forEach(function(e) {
            e.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
            var t = e.function || e.fn;
            e.enabled && s(t) && (n.offsets.popper = x(n.offsets.popper), n.offsets.reference = x(n.offsets.reference), n = t(n, e))
        }), n
    }

    function R(e, n) {
        return e.some(function(e) {
            var t = e.name;
            return e.enabled && t === n
        })
    }

    function k(e) {
        for (var t = [!1, "ms", "Webkit", "Moz", "O"], n = e.charAt(0).toUpperCase() + e.slice(1), o = 0; o < t.length; o++) {
            var r = t[o],
                r = r ? "" + r + n : e;
            if (void 0 !== document.body.style[r]) return r
        }
        return null
    }

    function U(e) {
        e = e.ownerDocument;
        return e ? e.defaultView : window
    }

    function Y(e, t, n, o) {
        n.updateBound = o, U(e).addEventListener("resize", n.updateBound, {
            passive: !0
        });
        o = l(e);
        return function e(t, n, o, r) {
            var i = "BODY" === t.nodeName,
                t = i ? t.ownerDocument.defaultView : t;
            t.addEventListener(n, o, {
                passive: !0
            }), i || e(l(t.parentNode), n, o, r), r.push(t)
        }(o, "scroll", n.updateBound, n.scrollParents), n.scrollElement = o, n.eventsEnabled = !0, n
    }

    function V() {
        var e, t;
        this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = (e = this.reference, t = this.state, U(e).removeEventListener("resize", t.updateBound), t.scrollParents.forEach(function(e) {
            e.removeEventListener("scroll", t.updateBound)
        }), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = !1, t))
    }

    function C(e) {
        return "" !== e && !isNaN(parseFloat(e)) && isFinite(e)
    }

    function B(n, o) {
        Object.keys(o).forEach(function(e) {
            var t = ""; - 1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(e) && C(o[e]) && (t = "px"), n.style[e] = o[e] + t
        })
    }

    function q(e, t) {
        function n(e) {
            return e
        }
        var o = e.offsets,
            r = o.popper,
            o = o.reference,
            i = Math.round,
            s = Math.floor,
            o = i(o.width),
            a = i(r.width),
            f = -1 !== ["left", "right"].indexOf(e.placement),
            e = -1 !== e.placement.indexOf("-"),
            f = t ? f || e || o % 2 == a % 2 ? i : s : n,
            s = t ? i : n;
        return {
            left: f(o % 2 == 1 && a % 2 == 1 && !e && t ? r.left - 1 : r.left),
            top: s(r.top),
            bottom: s(r.bottom),
            right: f(r.right)
        }
    }
    var z = e && /Firefox/i.test(navigator.userAgent);

    function G(e, t, n) {
        var o, r = H(e, function(e) {
                return e.name === t
            }),
            e = !!r && e.some(function(e) {
                return e.name === n && e.enabled && e.order < r.order
            });
        return e || (o = "`" + t + "`", console.warn("`" + n + "`" + " modifier is required by " + o + " modifier in order to work, be sure to include it before " + o + "!")), e
    }
    var _ = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"],
        A = _.slice(3);

    function X(e, t) {
        t = 1 < arguments.length && void 0 !== t && t, e = A.indexOf(e), e = A.slice(e + 1).concat(A.slice(0, e));
        return t ? e.reverse() : e
    }
    var J = "flip",
        K = "clockwise",
        Q = "counterclockwise";

    function Z(e, a, f, t) {
        var r = [0, 0],
            o = -1 !== ["right", "left"].indexOf(t),
            t = e.split(/(\+|\-)/).map(function(e) {
                return e.trim()
            }),
            e = t.indexOf(H(t, function(e) {
                return -1 !== e.search(/,|\s/)
            })),
            n = (t[e] && -1 === t[e].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead."), /\s*,\s*|\s+/);
        return (-1 !== e ? [t.slice(0, e).concat([t[e].split(n)[0]]), [t[e].split(n)[1]].concat(t.slice(e + 1))] : [t]).map(function(e, t) {
            var s = (1 === t ? !o : o) ? "height" : "width",
                n = !1;
            return e.reduce(function(e, t) {
                return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t) ? (e[e.length - 1] = t, n = !0, e) : n ? (e[e.length - 1] += t, n = !1, e) : e.concat(t)
            }, []).map(function(e) {
                return t = s, n = a, o = f, r = +(i = (e = e).match(/((?:\-|\+)?\d*\.?\d*)(.*)/))[1], i = i[2], r ? 0 === i.indexOf("%") ? x("%p" === i ? n : o)[t] / 100 * r : "vh" === i || "vw" === i ? ("vh" === i ? Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * r : r : e;
                var t, n, o, r, i
            })
        }).forEach(function(n, o) {
            n.forEach(function(e, t) {
                C(e) && (r[o] += e * ("-" === n[t - 1] ? -1 : 1))
            })
        }), r
    }
    var $ = {
            placement: "bottom",
            positionFixed: !1,
            eventsEnabled: !0,
            removeOnDestroy: !1,
            onCreate: function() {},
            onUpdate: function() {},
            modifiers: {
                shift: {
                    order: 100,
                    enabled: !0,
                    fn: function(e) {
                        var t, n, o, r = e.placement,
                            i = r.split("-")[0];
                        return (r = r.split("-")[1]) && (t = (n = e.offsets).reference, n = n.popper, o = (i = -1 !== ["bottom", "top"].indexOf(i)) ? "width" : "height", i = {
                            start: w({}, i = i ? "left" : "top", t[i]),
                            end: w({}, i, t[i] + t[o] - n[o])
                        }, e.offsets.popper = y({}, n, i[r])), e
                    }
                },
                offset: {
                    order: 200,
                    enabled: !0,
                    fn: function(e, t) {
                        var t = t.offset,
                            n = e.placement,
                            o = (r = e.offsets).popper,
                            r = r.reference,
                            n = n.split("-")[0],
                            i = void 0,
                            i = C(+t) ? [+t, 0] : Z(t, o, r, n);
                        return "left" === n ? (o.top += i[0], o.left -= i[1]) : "right" === n ? (o.top += i[0], o.left += i[1]) : "top" === n ? (o.left += i[0], o.top -= i[1]) : "bottom" === n && (o.left += i[0], o.top += i[1]), e.popper = o, e
                    },
                    offset: 0
                },
                preventOverflow: {
                    order: 300,
                    enabled: !0,
                    fn: function(e, o) {
                        var t = o.boundariesElement || u(e.instance.popper),
                            n = (e.instance.reference === t && (t = u(t)), k("transform")),
                            r = e.instance.popper.style,
                            i = r.top,
                            s = r.left,
                            a = r[n],
                            f = (r.top = "", r.left = "", r[n] = "", T(e.instance.popper, e.instance.reference, o.padding, t, e.positionFixed)),
                            t = (r.top = i, r.left = s, r[n] = a, o.boundaries = f, o.priority),
                            p = e.offsets.popper,
                            l = {
                                primary: function(e) {
                                    var t = p[e];
                                    return p[e] < f[e] && !o.escapeWithReference && (t = Math.max(p[e], f[e])), w({}, e, t)
                                },
                                secondary: function(e) {
                                    var t = "right" === e ? "left" : "top",
                                        n = p[t];
                                    return p[e] > f[e] && !o.escapeWithReference && (n = Math.min(p[t], f[e] - ("right" === e ? p.width : p.height))), w({}, t, n)
                                }
                            };
                        return t.forEach(function(e) {
                            var t = -1 !== ["left", "top"].indexOf(e) ? "primary" : "secondary";
                            p = y({}, p, l[t](e))
                        }), e.offsets.popper = p, e
                    },
                    priority: ["left", "right", "top", "bottom"],
                    padding: 5,
                    boundariesElement: "scrollParent"
                },
                keepTogether: {
                    order: 400,
                    enabled: !0,
                    fn: function(e) {
                        var t = (n = e.offsets).popper,
                            n = n.reference,
                            o = e.placement.split("-")[0],
                            r = Math.floor,
                            i = (o = -1 !== ["top", "bottom"].indexOf(o)) ? "right" : "bottom",
                            s = o ? "left" : "top",
                            o = o ? "width" : "height";
                        return t[i] < r(n[s]) && (e.offsets.popper[s] = r(n[s]) - t[o]), t[s] > r(n[i]) && (e.offsets.popper[s] = r(n[i])), e
                    }
                },
                arrow: {
                    order: 500,
                    enabled: !0,
                    fn: function(e, t) {
                        if (G(e.instance.modifiers, "arrow", "keepTogether")) {
                            t = t.element;
                            if ("string" == typeof t) {
                                if (!(t = e.instance.popper.querySelector(t))) return e
                            } else if (!e.instance.popper.contains(t)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), e;
                            var n = e.placement.split("-")[0],
                                o = e.offsets,
                                r = o.popper,
                                o = o.reference,
                                n = -1 !== ["left", "right"].indexOf(n),
                                i = n ? "height" : "width",
                                s = n ? "Top" : "Left",
                                a = s.toLowerCase(),
                                f = n ? "left" : "top",
                                n = n ? "bottom" : "right",
                                p = N(t)[i],
                                n = (o[n] - p < r[a] && (e.offsets.popper[a] -= r[a] - (o[n] - p)), o[a] + p > r[n] && (e.offsets.popper[a] += o[a] + p - r[n]), e.offsets.popper = x(e.offsets.popper), o[a] + o[i] / 2 - p / 2),
                                o = d(e.instance.popper),
                                l = parseFloat(o["margin" + s], 10),
                                o = parseFloat(o["border" + s + "Width"], 10),
                                s = n - e.offsets.popper[a] - l - o,
                                s = Math.max(Math.min(r[i] - p, s), 0);
                            e.arrowElement = t, e.offsets.arrow = (w(n = {}, a, Math.round(s)), w(n, f, ""), n)
                        }
                        return e
                    },
                    element: "[x-arrow]"
                },
                flip: {
                    order: 600,
                    enabled: !0,
                    fn: function(p, l) {
                        if (!(R(p.instance.modifiers, "inner") || p.flipped && p.placement === p.originalPlacement)) {
                            var d = T(p.instance.popper, p.instance.reference, l.padding, l.boundariesElement, p.positionFixed),
                                c = p.placement.split("-")[0],
                                u = F(c),
                                h = p.placement.split("-")[1] || "",
                                m = [];
                            switch (l.behavior) {
                                case J:
                                    m = [c, u];
                                    break;
                                case K:
                                    m = X(c);
                                    break;
                                case Q:
                                    m = X(c, !0);
                                    break;
                                default:
                                    m = l.behavior
                            }
                            m.forEach(function(e, t) {
                                if (c !== e || m.length === t + 1) return p;
                                c = p.placement.split("-")[0], u = F(c);
                                var e = p.offsets.popper,
                                    n = p.offsets.reference,
                                    o = Math.floor,
                                    n = "left" === c && o(e.right) > o(n.left) || "right" === c && o(e.left) < o(n.right) || "top" === c && o(e.bottom) > o(n.top) || "bottom" === c && o(e.top) < o(n.bottom),
                                    r = o(e.left) < o(d.left),
                                    i = o(e.right) > o(d.right),
                                    s = o(e.top) < o(d.top),
                                    e = o(e.bottom) > o(d.bottom),
                                    o = "left" === c && r || "right" === c && i || "top" === c && s || "bottom" === c && e,
                                    a = -1 !== ["top", "bottom"].indexOf(c),
                                    f = !!l.flipVariations && (a && "start" === h && r || a && "end" === h && i || !a && "start" === h && s || !a && "end" === h && e),
                                    i = !!l.flipVariationsByContent && (a && "start" === h && i || a && "end" === h && r || !a && "start" === h && e || !a && "end" === h && s),
                                    r = f || i;
                                (n || o || r) && (p.flipped = !0, (n || o) && (c = m[t + 1]), r && (h = "end" === (e = h) ? "start" : "start" === e ? "end" : e), p.placement = c + (h ? "-" + h : ""), p.offsets.popper = y({}, p.offsets.popper, j(p.instance.popper, p.offsets.reference, p.placement)), p = I(p.instance.modifiers, p, "flip"))
                            })
                        }
                        return p
                    },
                    behavior: "flip",
                    padding: 5,
                    boundariesElement: "viewport",
                    flipVariations: !1,
                    flipVariationsByContent: !1
                },
                inner: {
                    order: 700,
                    enabled: !1,
                    fn: function(e) {
                        var t = e.placement,
                            n = t.split("-")[0],
                            o = (r = e.offsets).popper,
                            r = r.reference,
                            i = -1 !== ["left", "right"].indexOf(n),
                            s = -1 === ["top", "left"].indexOf(n);
                        return o[i ? "left" : "top"] = r[n] - (s ? o[i ? "width" : "height"] : 0), e.placement = F(t), e.offsets.popper = x(o), e
                    }
                },
                hide: {
                    order: 800,
                    enabled: !0,
                    fn: function(e) {
                        if (G(e.instance.modifiers, "hide", "preventOverflow")) {
                            var t = e.offsets.reference,
                                n = H(e.instance.modifiers, function(e) {
                                    return "preventOverflow" === e.name
                                }).boundaries;
                            if (t.bottom < n.top || t.left > n.right || t.top > n.bottom || t.right < n.left) {
                                if (!0 === e.hide) return e;
                                e.hide = !0, e.attributes["x-out-of-boundaries"] = ""
                            } else {
                                if (!1 === e.hide) return e;
                                e.hide = !1, e.attributes["x-out-of-boundaries"] = !1
                            }
                        }
                        return e
                    }
                },
                computeStyle: {
                    order: 850,
                    enabled: !0,
                    fn: function(e, t) {
                        var n = t.x,
                            o = t.y,
                            r = e.offsets.popper,
                            i = (void 0 !== (i = H(e.instance.modifiers, function(e) {
                                return "applyStyle" === e.name
                            }).gpuAcceleration) && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!"), void 0 !== i ? i : t.gpuAcceleration),
                            s = E(t = u(e.instance.popper)),
                            r = {
                                position: r.position
                            },
                            a = q(e, window.devicePixelRatio < 2 || !z),
                            n = "bottom" === n ? "top" : "bottom",
                            o = "right" === o ? "left" : "right",
                            f = k("transform"),
                            p = void 0,
                            l = void 0,
                            l = "bottom" == n ? "HTML" === t.nodeName ? -t.clientHeight + a.bottom : -s.height + a.bottom : a.top,
                            p = "right" == o ? "HTML" === t.nodeName ? -t.clientWidth + a.right : -s.width + a.right : a.left,
                            s = (i && f ? (r[f] = "translate3d(" + p + "px, " + l + "px, 0)", r[n] = 0, r[o] = 0, r.willChange = "transform") : (t = "right" == o ? -1 : 1, r[n] = l * ("bottom" == n ? -1 : 1), r[o] = p * t, r.willChange = n + ", " + o), {
                                "x-placement": e.placement
                            });
                        return e.attributes = y({}, s, e.attributes), e.styles = y({}, r, e.styles), e.arrowStyles = y({}, e.offsets.arrow, e.arrowStyles), e
                    },
                    gpuAcceleration: !0,
                    x: "bottom",
                    y: "right"
                },
                applyStyle: {
                    order: 900,
                    enabled: !0,
                    fn: function(e) {
                        var t, n;
                        return B(e.instance.popper, e.styles), t = e.instance.popper, n = e.attributes, Object.keys(n).forEach(function(e) {
                            !1 !== n[e] ? t.setAttribute(e, n[e]) : t.removeAttribute(e)
                        }), e.arrowElement && Object.keys(e.arrowStyles).length && B(e.arrowElement, e.arrowStyles), e
                    },
                    onLoad: function(e, t, n, o, r) {
                        return r = M(r, t, e, n.positionFixed), r = D(n.placement, r, t, e, n.modifiers.flip.boundariesElement, n.modifiers.flip.padding), t.setAttribute("x-placement", r), B(t, {
                            position: n.positionFixed ? "fixed" : "absolute"
                        }), n
                    },
                    gpuAcceleration: void 0
                }
            }
        },
        b = (b(P, [{
            key: "update",
            value: function() {
                return function() {
                    var e;
                    this.state.isDestroyed || ((e = {
                        instance: this,
                        styles: {},
                        arrowStyles: {},
                        attributes: {},
                        flipped: !1,
                        offsets: {}
                    }).offsets.reference = M(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = D(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = j(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e = I(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0, this.options.onCreate(e)))
                }.call(this)
            }
        }, {
            key: "destroy",
            value: function() {
                return function() {
                    return this.state.isDestroyed = !0, R(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[k("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this
                }.call(this)
            }
        }, {
            key: "enableEventListeners",
            value: function() {
                return function() {
                    this.state.eventsEnabled || (this.state = Y(this.reference, this.options, this.state, this.scheduleUpdate))
                }.call(this)
            }
        }, {
            key: "disableEventListeners",
            value: function() {
                return V.call(this)
            }
        }]), P);

    function P(e, t) {
        var n = this,
            o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {},
            r = this,
            i = P;
        if (!(r instanceof i)) throw new TypeError("Cannot call a class as a function");
        this.scheduleUpdate = function() {
            return requestAnimationFrame(n.update)
        }, this.update = S(this.update.bind(this)), this.options = y({}, P.Defaults, o), this.state = {
            isDestroyed: !1,
            isCreated: !1,
            scrollParents: []
        }, this.reference = e && e.jquery ? e[0] : e, this.popper = t && t.jquery ? t[0] : t, this.options.modifiers = {}, Object.keys(y({}, P.Defaults.modifiers, o.modifiers)).forEach(function(e) {
            n.options.modifiers[e] = y({}, P.Defaults.modifiers[e] || {}, o.modifiers ? o.modifiers[e] : {})
        }), this.modifiers = Object.keys(this.options.modifiers).map(function(e) {
            return y({
                name: e
            }, n.options.modifiers[e])
        }).sort(function(e, t) {
            return e.order - t.order
        }), this.modifiers.forEach(function(e) {
            e.enabled && s(e.onLoad) && e.onLoad(n.reference, n.popper, n.options, e, n.state)
        }), this.update();
        r = this.options.eventsEnabled;
        r && this.enableEventListeners(), this.state.eventsEnabled = r
    }
    return b.Utils = ("undefined" != typeof window ? window : global).PopperUtils, b.placements = _, b.Defaults = $, b
});