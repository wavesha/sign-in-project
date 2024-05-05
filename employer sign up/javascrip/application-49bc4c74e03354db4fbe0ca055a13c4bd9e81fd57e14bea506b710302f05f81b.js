function limitSelections(e, t) {
    if (t > 0) return e.find("option:selected").length >= t ? e.find("option:not(:selected)").each((function() {
        var e = $(this).closest(".multiselect-native-select").find("input[value='" + $(this).val() + "']");
        e.attr("disabled", !0), e.closest("li").addClass("disabled")
    })) : e.find("option").each((function() {
        var e = $(this).closest(".multiselect-native-select").find("input[value='" + $(this).val() + "']");
        e.removeAttr("disabled"), e.closest("li").removeClass("disabled")
    })), !1
}

function dig() {
    if (arguments.length < 2) return null;
    var args = Array.from(arguments),
        hash = args.shift();
    if (null == hash) return null;
    var value = hash[args.shift()];
    return 0 == args.length || null == value ? value : eval("dig(value, '" + args.join("', '") + "')")
}

function process_ajax_modal_sign_up(e, t, i, n) {
    e.bind("ajax:success", (function(e, t) {
        redirect_path = "Employer" == n ? "/employers/" + t.guid + "/dashboard" : "/profiles/" + t.guid + "/edit", window.location.replace(document.location.origin + redirect_path)
    })).bind("ajax:error", (function(e, t) {
        $("form#signup_user").find("button[type=submit]").prop("disabled", !1);
        t = $.parseJSON(t.responseText);
        var n = "";
        $.each(t.errors, (function(e, t) {
            n = n + "<span class='error-line'>" + capitalize(e) + " " + t + "</span><br>"
        })), i.html("<div class='alert alert-danger'>" + n + "</div>")
    }))
}

function process_ajax_modal_login(e, t, i) {
    e.bind("ajax:success", (function() {
        t.modal("toggle"), location.reload()
    })).bind("ajax:error", (function(e, t) {
        $("form#login_user").find("button[type=submit]").prop("disabled", !1), i.html("<div class='alert alert-danger'>" + t.responseText + "</div>")
    }))
}

function setBrandIcon(e) {
    var t = {
            visa: "pf-visa",
            mastercard: "pf-mastercard",
            amex: "pf-american-express",
            discover: "pf-discover",
            diners: "pf-diners",
            jcb: "pf-jcb",
            unknown: "pf-credit-card",
            "master-card": "pf-mastercard",
            "american-express": "pf-american-express",
            "diners-club": "pf-diners"
        },
        i = document.getElementById("brand-icon"),
        n = "pf-credit-card";
    e in t && (n = t[e]);
    for (var o = i.classList.length - 1; o >= 0; o--) i.classList.remove(i.classList[o]);
    i.classList.add("pf"), i.classList.add(n)
}

function setElementStyle(e, t) {
    for (var i in t) e.style[i] = t[i]
}

function handleStripeFormChangeCardNumber(e) {
    e.brand && setBrandIcon(e.brand);
    var t = document.getElementById("card-errors");
    e.error ? (t.textContent = e.error.message, t.style.display = "block") : (t.textContent = "", t.style.display = "none")
}

function handleStripeFormSubmit(e) {
    if (e.preventDefault(), stripeFormSubmitted) return !1;
    markFormSubmitted(), verifyAuthToken()
}

function markFormSubmitted() {
    var e = $(jQueryFormButtonId);
    stripeFormSubmitted = !0, originalPaymentButtonText = e.html(), e.prop("disabled", !0).html("Processing..."), $("#send-invoice-link").hide()
}

function unmarkFormSubmitted() {
    stripeFormSubmitted = !1, $(jQueryFormButtonId).prop("disabled", !1).html(originalPaymentButtonText), $("#send-invoice-link").show()
}

function verifyAuthToken() {
    $.ajax({
        type: "POST",
        url: "/sessions/validate_token",
        data: {
            token: $('meta[name="csrf-token"]').attr("content"),
            request_action: stripeForm.method.toUpperCase() + " " + stripeForm.action
        },
        success: function() {
            var e = document.getElementById("pi_token");
            e ? chargeForStripeSale(e) : createStripeToken()
        },
        error: function(e) {
            498 == e.status ? displaySessionTimeoutError() : handleStripeError(dig(window.I18n, "shared", "error_messages", "errors"))
        }
    })
}

function stripePaymentMethodData(e) {
    var t = {
        payment_method_data: {
            billing_details: {
                address: {
                    postal_code: postalCodeElement.value
                }
            }
        }
    };
    return e && (t.payment_method_data.card = e), t
}

function handleStripeError(e) {
    var t = document.getElementById("card-errors");
    t.textContent = e, t.style.display = "block", unmarkFormSubmitted()
}

function displaySessionTimeoutError() {
    $(jQueryFormButtonId).hide(), handleStripeError(dig(window.I18n, "shared", "error_messages", "expired_session", "modal", "title") + ". " + dig(window.I18n, "payment", "errors", "expired_session", "modal", "text")), "undefined" != typeof sessionTimeoutCallback && sessionTimeoutCallback()
}

function chargeForStripeSale(e) {
    stripe.handleCardPayment(e.value, cardNumberElement, stripePaymentMethodData(null)).then((function(e) {
        e.error ? handleStripeError(e.error.message) : stripeForm.submit()
    }))
}

function createStripeToken() {
    stripe.createToken(cardNumberElement).then((function(e) {
        e.error ? handleStripeError(e.error.message) : createStripeSubscription(e.token.id)
    }))
}

function createStripeSubscription(e) {
    var t = document.getElementById("si_token");
    stripe.handleCardSetup(t.value, cardNumberElement, stripePaymentMethodData(e)).then((function(e) {
        e.error ? handleStripeError(e.error.message) : stripeForm.submit()
    }))
}

function mobileWidth() {
    return !window.matchMedia("(min-width: 768px)").matches
}

function toggleMobileSearchBar() {
    window.mobileSearch.visible ? hideMobileSearchBar() : showMobileSearchBar()
}

function showMobileSearchBar() {
    window.mobileSearch.visible || ($('[data-js="searchPanelToggleWithHide"]').hide(), $('[data-js="searchPanel"]').slideToggle(), window.mobileSearch.visible = !0, $("#q").focus())
}

function hideMobileSearchBar() {
    window.mobileSearch.visible && ($('[data-js="searchPanelToggleWithHide"]').show(), $('[data-js="searchPanel"]').slideToggle(), window.mobileSearch.visible = !1)
}

function mobileSearchResize() {
    var e = mobileWidth();
    e !== window.mobileSearch.fullSize && (mobileWidth() ? ($('[data-js="searchPanel"]').hide(), $('[data-js="searchPanelToggleWithHide"]').show()) : ($('[data-js="searchPanel"]').show(), $('[data-js="searchPanelToggleWithHide"]').hide()), window.mobileSearch.visible = !1, window.mobileSearch.fullSize = e)
}

function getParameterByName(e) {
    var t = new URLSearchParams(document.location.search).get(e);
    return null === t ? "" : decodeURIComponent(t)
}

function capitalize(e) {
    return $.camelCase("-" + e)
}

function typeOf(e) {
    return {}.toString.call(e).split(" ")[1].slice(0, -1).toLowerCase()
}

function hideNonCompliantBoost(e) {
    var t = e.address_components[e.address_components.length - 1].short_name;
    $('[data-js="upsell-type-job_boost"]') && ("US" != t ? $('[data-js="upsell-type-job_boost"]').hide() : $('[data-js="upsell-type-job_boost"]').show())
}

function parseBooleanStyle(e) {
    switch (e) {
        case !0:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            e = !0;
            break;
        default:
            e = !1
    }
    return e
}

function registerAsset(e, t, i) {
    void 0 === trustArc.registry[e] && (trustArc.registry[e] = {
        callback: i,
        level: t,
        loaded: !1,
        postActions: []
    }, trustArc.disabled && loadAsset(e))
}

function registerPostAction(e, t) {
    void 0 !== trustArc.registry[e] && (isAssetLoaded(e) ? t() : trustArc.registry[e].postActions.push(t))
}

function initialAssetLoad() {
    trustArc.using_cma ? isTrustArcCMALoaded() ? loadAtCMALevel() : (trustArc.loaded || setAndLoadAtLevel(trustArcLevels.REQUIRED), setTimeout(initialAssetLoad, 500)) : setAndLoadAtLevel(trustArcLevels.ADVERTISING)
}

function setAndLoadAtLevel(e) {
    trustArc.level = e, trustArc.loaded = !0, loadAssets()
}

function loadAssets() {
    $.each(trustArc.registry, (function(e, t) {
        t.level <= trustArc.level && !isAssetLoaded(e) && (loadAsset(e), $.each(t.postActions, (function(e, t) {
            t()
        })))
    }))
}

function isAssetLoaded(e) {
    return void 0 !== trustArc.registry[e] && trustArc.registry[e].loaded
}

function loadAsset(e) {
    void 0 !== trustArc.registry[e] && (trustArc.registry[e].callback(), trustArc.registry[e].loaded = !0)
}

function isTrustArcCMALoaded() {
    return "undefined" != typeof truste && void 0 !== truste.cma
}

function loadAtCMALevel() {
    if (isTrustArcCMALoaded()) {
        var e = trustArcLevels.REQUIRED,
            t = truste.cma.callApi("getConsentDecision", window.location.hostname);
        void 0 !== t.consentDecision && (e = "implied" === t.source ? Math.max(e, trustArc.implicit) : Math.max(e, t.consentDecision)), setAndLoadAtLevel(e)
    }
}

function runActionIfAllowed(e, t) {
    void 0 !== trustArc.registry[e] && isAssetLoaded(e) && t()
}

function copyToClipboard(e) {
    var t = e.attr("id"),
        i = document.getElementById(t),
        n = document.createRange();
    n.selectNode(i);
    var o = window.getSelection();
    o.removeAllRanges(), o.addRange(n), document.execCommand("copy"), o.removeAllRanges()
}! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, (function(e, t) {
    function i(e) {
        var t = !!e && "length" in e && e.length,
            i = he.type(e);
        return "function" !== i && !he.isWindow(e) && ("array" === i || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function n(e, t, i) {
        if (he.isFunction(t)) return he.grep(e, (function(e, n) {
            return !!t.call(e, n, e) !== i
        }));
        if (t.nodeType) return he.grep(e, (function(e) {
            return e === t !== i
        }));
        if ("string" == typeof t) {
            if (ke.test(t)) return he.filter(t, e, i);
            t = he.filter(t, e)
        }
        return he.grep(e, (function(e) {
            return he.inArray(e, t) > -1 !== i
        }))
    }

    function o(e, t) {
        do {
            e = e[t]
        } while (e && 1 !== e.nodeType);
        return e
    }

    function s(e) {
        var t = {};
        return he.each(e.match(je) || [], (function(e, i) {
            t[i] = !0
        })), t
    }

    function r() {
        ne.addEventListener ? (ne.removeEventListener("DOMContentLoaded", a), e.removeEventListener("load", a)) : (ne.detachEvent("onreadystatechange", a), e.detachEvent("onload", a))
    }

    function a() {
        (ne.addEventListener || "load" === e.event.type || "complete" === ne.readyState) && (r(), he.ready())
    }

    function l(e, t, i) {
        if (void 0 === i && 1 === e.nodeType) {
            var n = "data-" + t.replace(Oe, "-$1").toLowerCase();
            if ("string" == typeof(i = e.getAttribute(n))) {
                try {
                    i = "true" === i || "false" !== i && ("null" === i ? null : +i + "" === i ? +i : Le.test(i) ? he.parseJSON(i) : i)
                } catch (e) {}
                he.data(e, t, i)
            } else i = void 0
        }
        return i
    }

    function d(e) {
        var t;
        for (t in e)
            if (("data" !== t || !he.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function c(e, t, i, n) {
        if (Ie(e)) {
            var o, s, r = he.expando,
                a = e.nodeType,
                l = a ? he.cache : e,
                d = a ? e[r] : e[r] && r;
            if (d && l[d] && (n || l[d].data) || void 0 !== i || "string" != typeof t) return d || (d = a ? e[r] = ie.pop() || he.guid++ : r), l[d] || (l[d] = a ? {} : {
                toJSON: he.noop
            }), "object" != typeof t && "function" != typeof t || (n ? l[d] = he.extend(l[d], t) : l[d].data = he.extend(l[d].data, t)), s = l[d], n || (s.data || (s.data = {}), s = s.data), void 0 !== i && (s[he.camelCase(t)] = i), "string" == typeof t ? null == (o = s[t]) && (o = s[he.camelCase(t)]) : o = s, o
        }
    }

    function u(e, t, i) {
        if (Ie(e)) {
            var n, o, s = e.nodeType,
                r = s ? he.cache : e,
                a = s ? e[he.expando] : he.expando;
            if (r[a]) {
                if (t && (n = i ? r[a] : r[a].data)) {
                    o = (t = he.isArray(t) ? t.concat(he.map(t, he.camelCase)) : t in n || (t = he.camelCase(t)) in n ? [t] : t.split(" ")).length;
                    for (; o--;) delete n[t[o]];
                    if (i ? !d(n) : !he.isEmptyObject(n)) return
                }(i || (delete r[a].data, d(r[a]))) && (s ? he.cleanData([e], !0) : ue.deleteExpando || r != r.window ? delete r[a] : r[a] = void 0)
            }
        }
    }

    function p(e, t, i, n) {
        var o, s = 1,
            r = 20,
            a = n ? function() {
                return n.cur()
            } : function() {
                return he.css(e, t, "")
            },
            l = a(),
            d = i && i[3] || (he.cssNumber[t] ? "" : "px"),
            c = (he.cssNumber[t] || "px" !== d && +l) && Re.exec(he.css(e, t));
        if (c && c[3] !== d) {
            d = d || c[3], i = i || [], c = +l || 1;
            do {
                c /= s = s || ".5", he.style(e, t, c + d)
            } while (s !== (s = a() / l) && 1 !== s && --r)
        }
        return i && (c = +c || +l || 0, o = i[1] ? c + (i[1] + 1) * i[2] : +i[2], n && (n.unit = d, n.start = c, n.end = o)), o
    }

    function h(e) {
        var t = Ge.split("|"),
            i = e.createDocumentFragment();
        if (i.createElement)
            for (; t.length;) i.createElement(t.pop());
        return i
    }

    function f(e, t) {
        var i, n, o = 0,
            s = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : void 0;
        if (!s)
            for (s = [], i = e.childNodes || e; null != (n = i[o]); o++) !t || he.nodeName(n, t) ? s.push(n) : he.merge(s, f(n, t));
        return void 0 === t || t && he.nodeName(e, t) ? he.merge([e], s) : s
    }

    function m(e, t) {
        for (var i, n = 0; null != (i = e[n]); n++) he._data(i, "globalEval", !t || he._data(t[n], "globalEval"))
    }

    function v(e) {
        We.test(e.type) && (e.defaultChecked = e.checked)
    }

    function g(e, t, i, n, o) {
        for (var s, r, a, l, d, c, u, p = e.length, g = h(t), y = [], b = 0; b < p; b++)
            if ((r = e[b]) || 0 === r)
                if ("object" === he.type(r)) he.merge(y, r.nodeType ? [r] : r);
                else if (Xe.test(r)) {
            for (l = l || g.appendChild(t.createElement("div")), d = (Be.exec(r) || ["", ""])[1].toLowerCase(), u = Qe[d] || Qe._default, l.innerHTML = u[1] + he.htmlPrefilter(r) + u[2], s = u[0]; s--;) l = l.lastChild;
            if (!ue.leadingWhitespace && Ve.test(r) && y.push(t.createTextNode(Ve.exec(r)[0])), !ue.tbody)
                for (s = (r = "table" !== d || Ke.test(r) ? "<table>" !== u[1] || Ke.test(r) ? 0 : l : l.firstChild) && r.childNodes.length; s--;) he.nodeName(c = r.childNodes[s], "tbody") && !c.childNodes.length && r.removeChild(c);
            for (he.merge(y, l.childNodes), l.textContent = ""; l.firstChild;) l.removeChild(l.firstChild);
            l = g.lastChild
        } else y.push(t.createTextNode(r));
        for (l && g.removeChild(l), ue.appendChecked || he.grep(f(y, "input"), v), b = 0; r = y[b++];)
            if (n && he.inArray(r, n) > -1) o && o.push(r);
            else if (a = he.contains(r.ownerDocument, r), l = f(g.appendChild(r), "script"), a && m(l), i)
            for (s = 0; r = l[s++];) Ue.test(r.type || "") && i.push(r);
        return l = null, g
    }

    function y() {
        return !0
    }

    function b() {
        return !1
    }

    function w() {
        try {
            return ne.activeElement
        } catch (e) {}
    }

    function x(e, t, i, n, o, s) {
        var r, a;
        if ("object" == typeof t) {
            for (a in "string" != typeof i && (n = n || i, i = void 0), t) x(e, a, i, n, t[a], s);
            return e
        }
        if (null == n && null == o ? (o = i, n = i = void 0) : null == o && ("string" == typeof i ? (o = n, n = void 0) : (o = n, n = i, i = void 0)), !1 === o) o = b;
        else if (!o) return e;
        return 1 === s && (r = o, o = function(e) {
            return he().off(e), r.apply(this, arguments)
        }, o.guid = r.guid || (r.guid = he.guid++)), e.each((function() {
            he.event.add(this, t, o, n, i)
        }))
    }

    function C(e, t) {
        return he.nodeName(e, "table") && he.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function k(e) {
        return e.type = (null !== he.find.attr(e, "type")) + "/" + e.type, e
    }

    function T(e) {
        var t = at.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function $(e, t) {
        if (1 === t.nodeType && he.hasData(e)) {
            var i, n, o, s = he._data(e),
                r = he._data(t, s),
                a = s.events;
            if (a)
                for (i in delete r.handle, r.events = {}, a)
                    for (n = 0, o = a[i].length; n < o; n++) he.event.add(t, i, a[i][n]);
            r.data && (r.data = he.extend({}, r.data))
        }
    }

    function S(e, t) {
        var i, n, o;
        if (1 === t.nodeType) {
            if (i = t.nodeName.toLowerCase(), !ue.noCloneEvent && t[he.expando]) {
                for (n in (o = he._data(t)).events) he.removeEvent(t, n, o.handle);
                t.removeAttribute(he.expando)
            }
            "script" === i && t.text !== e.text ? (k(t).text = e.text, T(t)) : "object" === i ? (t.parentNode && (t.outerHTML = e.outerHTML), ue.html5Clone && e.innerHTML && !he.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === i && We.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === i ? t.defaultSelected = t.selected = e.defaultSelected : "input" !== i && "textarea" !== i || (t.defaultValue = e.defaultValue)
        }
    }

    function _(e, t, i, n) {
        t = se.apply([], t);
        var o, s, r, a, l, d, c = 0,
            u = e.length,
            p = u - 1,
            h = t[0],
            m = he.isFunction(h);
        if (m || u > 1 && "string" == typeof h && !ue.checkClone && rt.test(h)) return e.each((function(o) {
            var s = e.eq(o);
            m && (t[0] = h.call(this, o, s.html())), _(s, t, i, n)
        }));
        if (u && (o = (d = g(t, e[0].ownerDocument, !1, e, n)).firstChild, 1 === d.childNodes.length && (d = o), o || n)) {
            for (r = (a = he.map(f(d, "script"), k)).length; c < u; c++) s = d, c !== p && (s = he.clone(s, !0, !0), r && he.merge(a, f(s, "script"))), i.call(e[c], s, c);
            if (r)
                for (l = a[a.length - 1].ownerDocument, he.map(a, T), c = 0; c < r; c++) s = a[c], Ue.test(s.type || "") && !he._data(s, "globalEval") && he.contains(l, s) && (s.src ? he._evalUrl && he._evalUrl(s.src) : he.globalEval((s.text || s.textContent || s.innerHTML || "").replace(lt, "")));
            d = o = null
        }
        return e
    }

    function E(e, t, i) {
        for (var n, o = t ? he.filter(t, e) : e, s = 0; null != (n = o[s]); s++) i || 1 !== n.nodeType || he.cleanData(f(n)), n.parentNode && (i && he.contains(n.ownerDocument, n) && m(f(n, "script")), n.parentNode.removeChild(n));
        return e
    }

    function A(e, t) {
        var i = he(t.createElement(e)).appendTo(t.body),
            n = he.css(i[0], "display");
        return i.detach(), n
    }

    function j(e) {
        var t = ne,
            i = ut[e];
        return i || ("none" !== (i = A(e, t)) && i || ((t = ((ct = (ct || he("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentWindow || ct[0].contentDocument).document).write(), t.close(), i = A(e, t), ct.detach()), ut[e] = i), i
    }

    function D(e, t) {
        return {
            get: function() {
                if (!e()) return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }

    function I(e) {
        if (e in St) return e;
        for (var t = e.charAt(0).toUpperCase() + e.slice(1), i = $t.length; i--;)
            if ((e = $t[i] + t) in St) return e
    }

    function L(e, t) {
        for (var i, n, o, s = [], r = 0, a = e.length; r < a; r++)(n = e[r]).style && (s[r] = he._data(n, "olddisplay"), i = n.style.display, t ? (s[r] || "none" !== i || (n.style.display = ""), "" === n.style.display && qe(n) && (s[r] = he._data(n, "olddisplay", j(n.nodeName)))) : (o = qe(n), (i && "none" !== i || !o) && he._data(n, "olddisplay", o ? i : he.css(n, "display"))));
        for (r = 0; r < a; r++)(n = e[r]).style && (t && "none" !== n.style.display && "" !== n.style.display || (n.style.display = t ? s[r] || "" : "none"));
        return e
    }

    function O(e, t, i) {
        var n = Ct.exec(t);
        return n ? Math.max(0, n[1] - (i || 0)) + (n[2] || "px") : t
    }

    function N(e, t, i, n, o) {
        for (var s = i === (n ? "border" : "content") ? 4 : "width" === t ? 1 : 0, r = 0; s < 4; s += 2) "margin" === i && (r += he.css(e, i + Me[s], !0, o)), n ? ("content" === i && (r -= he.css(e, "padding" + Me[s], !0, o)), "margin" !== i && (r -= he.css(e, "border" + Me[s] + "Width", !0, o))) : (r += he.css(e, "padding" + Me[s], !0, o), "padding" !== i && (r += he.css(e, "border" + Me[s] + "Width", !0, o)));
        return r
    }

    function P(e, t, i) {
        var n = !0,
            o = "width" === t ? e.offsetWidth : e.offsetHeight,
            s = vt(e),
            r = ue.boxSizing && "border-box" === he.css(e, "boxSizing", !1, s);
        if (o <= 0 || null == o) {
            if (((o = gt(e, t, s)) < 0 || null == o) && (o = e.style[t]), ht.test(o)) return o;
            n = r && (ue.boxSizingReliable() || o === e.style[t]), o = parseFloat(o) || 0
        }
        return o + N(e, t, i || (r ? "border" : "content"), n, s) + "px"
    }

    function F(e, t, i, n, o) {
        return new F.prototype.init(e, t, i, n, o)
    }

    function H() {
        return e.setTimeout((function() {
            _t = void 0
        })), _t = he.now()
    }

    function R(e, t) {
        var i, n = {
                height: e
            },
            o = 0;
        for (t = t ? 1 : 0; o < 4; o += 2 - t) n["margin" + (i = Me[o])] = n["padding" + i] = e;
        return t && (n.opacity = n.width = e), n
    }

    function M(e, t, i) {
        for (var n, o = (W.tweeners[t] || []).concat(W.tweeners["*"]), s = 0, r = o.length; s < r; s++)
            if (n = o[s].call(i, t, e)) return n
    }

    function q(e, t, i) {
        var n, o, s, r, a, l, d, c = this,
            u = {},
            p = e.style,
            h = e.nodeType && qe(e),
            f = he._data(e, "fxshow");
        for (n in i.queue || (null == (a = he._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function() {
                a.unqueued || l()
            }), a.unqueued++, c.always((function() {
                c.always((function() {
                    a.unqueued--, he.queue(e, "fx").length || a.empty.fire()
                }))
            }))), 1 === e.nodeType && ("height" in t || "width" in t) && (i.overflow = [p.overflow, p.overflowX, p.overflowY], "inline" === ("none" === (d = he.css(e, "display")) ? he._data(e, "olddisplay") || j(e.nodeName) : d) && "none" === he.css(e, "float") && (ue.inlineBlockNeedsLayout && "inline" !== j(e.nodeName) ? p.zoom = 1 : p.display = "inline-block")), i.overflow && (p.overflow = "hidden", ue.shrinkWrapBlocks() || c.always((function() {
                p.overflow = i.overflow[0], p.overflowX = i.overflow[1], p.overflowY = i.overflow[2]
            }))), t)
            if (o = t[n], At.exec(o)) {
                if (delete t[n], s = s || "toggle" === o, o === (h ? "hide" : "show")) {
                    if ("show" !== o || !f || void 0 === f[n]) continue;
                    h = !0
                }
                u[n] = f && f[n] || he.style(e, n)
            } else d = void 0;
        if (he.isEmptyObject(u)) "inline" === ("none" === d ? j(e.nodeName) : d) && (p.display = d);
        else
            for (n in f ? "hidden" in f && (h = f.hidden) : f = he._data(e, "fxshow", {}), s && (f.hidden = !h), h ? he(e).show() : c.done((function() {
                    he(e).hide()
                })), c.done((function() {
                    var t;
                    for (t in he._removeData(e, "fxshow"), u) he.style(e, t, u[t])
                })), u) r = M(h ? f[n] : 0, n, c), n in f || (f[n] = r.start, h && (r.end = r.start, r.start = "width" === n || "height" === n ? 1 : 0))
    }

    function z(e, t) {
        var i, n, o, s, r;
        for (i in e)
            if (o = t[n = he.camelCase(i)], s = e[i], he.isArray(s) && (o = s[1], s = e[i] = s[0]), i !== n && (e[n] = s, delete e[i]), (r = he.cssHooks[n]) && "expand" in r)
                for (i in s = r.expand(s), delete e[n], s) i in e || (e[i] = s[i], t[i] = o);
            else t[n] = o
    }

    function W(e, t, i) {
        var n, o, s = 0,
            r = W.prefilters.length,
            a = he.Deferred().always((function() {
                delete l.elem
            })),
            l = function() {
                if (o) return !1;
                for (var t = _t || H(), i = Math.max(0, d.startTime + d.duration - t), n = 1 - (i / d.duration || 0), s = 0, r = d.tweens.length; s < r; s++) d.tweens[s].run(n);
                return a.notifyWith(e, [d, n, i]), n < 1 && r ? i : (a.resolveWith(e, [d]), !1)
            },
            d = a.promise({
                elem: e,
                props: he.extend({}, t),
                opts: he.extend(!0, {
                    specialEasing: {},
                    easing: he.easing._default
                }, i),
                originalProperties: t,
                originalOptions: i,
                startTime: _t || H(),
                duration: i.duration,
                tweens: [],
                createTween: function(t, i) {
                    var n = he.Tween(e, d.opts, t, i, d.opts.specialEasing[t] || d.opts.easing);
                    return d.tweens.push(n), n
                },
                stop: function(t) {
                    var i = 0,
                        n = t ? d.tweens.length : 0;
                    if (o) return this;
                    for (o = !0; i < n; i++) d.tweens[i].run(1);
                    return t ? (a.notifyWith(e, [d, 1, 0]), a.resolveWith(e, [d, t])) : a.rejectWith(e, [d, t]), this
                }
            }),
            c = d.props;
        for (z(c, d.opts.specialEasing); s < r; s++)
            if (n = W.prefilters[s].call(d, e, c, d.opts)) return he.isFunction(n.stop) && (he._queueHooks(d.elem, d.opts.queue).stop = he.proxy(n.stop, n)), n;
        return he.map(c, M, d), he.isFunction(d.opts.start) && d.opts.start.call(e, d), he.fx.timer(he.extend(l, {
            elem: e,
            anim: d,
            queue: d.opts.queue
        })), d.progress(d.opts.progress).done(d.opts.done, d.opts.complete).fail(d.opts.fail).always(d.opts.always)
    }

    function B(e) {
        return he.attr(e, "class") || ""
    }

    function U(e) {
        return function(t, i) {
            "string" != typeof t && (i = t, t = "*");
            var n, o = 0,
                s = t.toLowerCase().match(je) || [];
            if (he.isFunction(i))
                for (; n = s[o++];) "+" === n.charAt(0) ? (n = n.slice(1) || "*", (e[n] = e[n] || []).unshift(i)) : (e[n] = e[n] || []).push(i)
        }
    }

    function V(e, t, i, n) {
        function o(a) {
            var l;
            return s[a] = !0, he.each(e[a] || [], (function(e, a) {
                var d = a(t, i, n);
                return "string" != typeof d || r || s[d] ? r ? !(l = d) : void 0 : (t.dataTypes.unshift(d), o(d), !1)
            })), l
        }
        var s = {},
            r = e === ei;
        return o(t.dataTypes[0]) || !s["*"] && o("*")
    }

    function G(e, t) {
        var i, n, o = he.ajaxSettings.flatOptions || {};
        for (n in t) void 0 !== t[n] && ((o[n] ? e : i || (i = {}))[n] = t[n]);
        return i && he.extend(!0, e, i), e
    }

    function Q(e, t, i) {
        for (var n, o, s, r, a = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), void 0 === o && (o = e.mimeType || t.getResponseHeader("Content-Type"));
        if (o)
            for (r in a)
                if (a[r] && a[r].test(o)) {
                    l.unshift(r);
                    break
                }
        if (l[0] in i) s = l[0];
        else {
            for (r in i) {
                if (!l[0] || e.converters[r + " " + l[0]]) {
                    s = r;
                    break
                }
                n || (n = r)
            }
            s = s || n
        }
        if (s) return s !== l[0] && l.unshift(s), i[s]
    }

    function X(e, t, i, n) {
        var o, s, r, a, l, d = {},
            c = e.dataTypes.slice();
        if (c[1])
            for (r in e.converters) d[r.toLowerCase()] = e.converters[r];
        for (s = c.shift(); s;)
            if (e.responseFields[s] && (i[e.responseFields[s]] = t), !l && n && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = s, s = c.shift())
                if ("*" === s) s = l;
                else if ("*" !== l && l !== s) {
            if (!(r = d[l + " " + s] || d["* " + s]))
                for (o in d)
                    if ((a = o.split(" "))[1] === s && (r = d[l + " " + a[0]] || d["* " + a[0]])) {
                        !0 === r ? r = d[o] : !0 !== d[o] && (s = a[0], c.unshift(a[1]));
                        break
                    }
            if (!0 !== r)
                if (r && e.throws) t = r(t);
                else try {
                    t = r(t)
                } catch (e) {
                    return {
                        state: "parsererror",
                        error: r ? e : "No conversion from " + l + " to " + s
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }

    function K(e) {
        return e.style && e.style.display || he.css(e, "display")
    }

    function Y(e) {
        if (!he.contains(e.ownerDocument || ne, e)) return !0;
        for (; e && 1 === e.nodeType;) {
            if ("none" === K(e) || "hidden" === e.type) return !0;
            e = e.parentNode
        }
        return !1
    }

    function J(e, t, i, n) {
        var o;
        if (he.isArray(t)) he.each(t, (function(t, o) {
            i || si.test(e) ? n(e, o) : J(e + "[" + ("object" == typeof o && null != o ? t : "") + "]", o, i, n)
        }));
        else if (i || "object" !== he.type(t)) n(e, t);
        else
            for (o in t) J(e + "[" + o + "]", t[o], i, n)
    }

    function Z() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    }

    function ee() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
    }

    function te(e) {
        return he.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
    }
    var ie = [],
        ne = e.document,
        oe = ie.slice,
        se = ie.concat,
        re = ie.push,
        ae = ie.indexOf,
        le = {},
        de = le.toString,
        ce = le.hasOwnProperty,
        ue = {},
        pe = "1.12.4",
        he = function(e, t) {
            return new he.fn.init(e, t)
        },
        fe = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        me = /^-ms-/,
        ve = /-([\da-z])/gi,
        ge = function(e, t) {
            return t.toUpperCase()
        };
    he.fn = he.prototype = {
        jquery: pe,
        constructor: he,
        selector: "",
        length: 0,
        toArray: function() {
            return oe.call(this)
        },
        get: function(e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : oe.call(this)
        },
        pushStack: function(e) {
            var t = he.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e) {
            return he.each(this, e)
        },
        map: function(e) {
            return this.pushStack(he.map(this, (function(t, i) {
                return e.call(t, i, t)
            })))
        },
        slice: function() {
            return this.pushStack(oe.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                i = +e + (e < 0 ? t : 0);
            return this.pushStack(i >= 0 && i < t ? [this[i]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: re,
        sort: ie.sort,
        splice: ie.splice
    }, he.extend = he.fn.extend = function() {
        var e, t, i, n, o, s, r = arguments[0] || {},
            a = 1,
            l = arguments.length,
            d = !1;
        for ("boolean" == typeof r && (d = r, r = arguments[a] || {}, a++), "object" == typeof r || he.isFunction(r) || (r = {}), a === l && (r = this, a--); a < l; a++)
            if (null != (o = arguments[a]))
                for (n in o) e = r[n], r !== (i = o[n]) && (d && i && (he.isPlainObject(i) || (t = he.isArray(i))) ? (t ? (t = !1, s = e && he.isArray(e) ? e : []) : s = e && he.isPlainObject(e) ? e : {}, r[n] = he.extend(d, s, i)) : void 0 !== i && (r[n] = i));
        return r
    }, he.extend({
        expando: "jQuery" + (pe + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === he.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === he.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            var t = e && e.toString();
            return !he.isArray(e) && t - parseFloat(t) + 1 >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== he.type(e) || e.nodeType || he.isWindow(e)) return !1;
            try {
                if (e.constructor && !ce.call(e, "constructor") && !ce.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (e) {
                return !1
            }
            if (!ue.ownFirst)
                for (t in e) return ce.call(e, t);
            for (t in e);
            return void 0 === t || ce.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? le[de.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && he.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(me, "ms-").replace(ve, ge)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t) {
            var n, o = 0;
            if (i(e))
                for (n = e.length; o < n && !1 !== t.call(e[o], o, e[o]); o++);
            else
                for (o in e)
                    if (!1 === t.call(e[o], o, e[o])) break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(fe, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (i(Object(e)) ? he.merge(n, "string" == typeof e ? [e] : e) : re.call(n, e)), n
        },
        inArray: function(e, t, i) {
            var n;
            if (t) {
                if (ae) return ae.call(t, e, i);
                for (n = t.length, i = i ? i < 0 ? Math.max(0, n + i) : i : 0; i < n; i++)
                    if (i in t && t[i] === e) return i
            }
            return -1
        },
        merge: function(e, t) {
            for (var i = +t.length, n = 0, o = e.length; n < i;) e[o++] = t[n++];
            if (i != i)
                for (; void 0 !== t[n];) e[o++] = t[n++];
            return e.length = o, e
        },
        grep: function(e, t, i) {
            for (var n = [], o = 0, s = e.length, r = !i; o < s; o++) !t(e[o], o) !== r && n.push(e[o]);
            return n
        },
        map: function(e, t, n) {
            var o, s, r = 0,
                a = [];
            if (i(e))
                for (o = e.length; r < o; r++) null != (s = t(e[r], r, n)) && a.push(s);
            else
                for (r in e) null != (s = t(e[r], r, n)) && a.push(s);
            return se.apply([], a)
        },
        guid: 1,
        proxy: function(e, t) {
            var i, n, o;
            if ("string" == typeof t && (o = e[t], t = e, e = o), he.isFunction(e)) return i = oe.call(arguments, 2), n = function() {
                return e.apply(t || this, i.concat(oe.call(arguments)))
            }, n.guid = e.guid = e.guid || he.guid++, n
        },
        now: function() {
            return +new Date
        },
        support: ue
    }), "function" == typeof Symbol && (he.fn[Symbol.iterator] = ie[Symbol.iterator]), he.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), (function(e, t) {
        le["[object " + t + "]"] = t.toLowerCase()
    }));
    var ye = function(e) {
        function t(e, t, i, n) {
            var o, s, r, a, l, d, u, h, f = t && t.ownerDocument,
                m = t ? t.nodeType : 9;
            if (i = i || [], "string" != typeof e || !e || 1 !== m && 9 !== m && 11 !== m) return i;
            if (!n && ((t ? t.ownerDocument || t : M) !== I && D(t), t = t || I, O)) {
                if (11 !== m && (d = ge.exec(e)))
                    if (o = d[1]) {
                        if (9 === m) {
                            if (!(r = t.getElementById(o))) return i;
                            if (r.id === o) return i.push(r), i
                        } else if (f && (r = f.getElementById(o)) && H(t, r) && r.id === o) return i.push(r), i
                    } else {
                        if (d[2]) return J.apply(i, t.getElementsByTagName(e)), i;
                        if ((o = d[3]) && x.getElementsByClassName && t.getElementsByClassName) return J.apply(i, t.getElementsByClassName(o)), i
                    }
                if (x.qsa && !U[e + " "] && (!N || !N.test(e))) {
                    if (1 !== m) f = t, h = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((a = t.getAttribute("id")) ? a = a.replace(be, "\\$&") : t.setAttribute("id", a = R), s = (u = $(e)).length, l = pe.test(a) ? "#" + a : "[id='" + a + "']"; s--;) u[s] = l + " " + p(u[s]);
                        h = u.join(","), f = ye.test(e) && c(t.parentNode) || t
                    }
                    if (h) try {
                        return J.apply(i, f.querySelectorAll(h)), i
                    } catch (e) {} finally {
                        a === R && t.removeAttribute("id")
                    }
                }
            }
            return _(e.replace(ae, "$1"), t, i, n)
        }

        function i() {
            function e(i, n) {
                return t.push(i + " ") > C.cacheLength && delete e[t.shift()], e[i + " "] = n
            }
            var t = [];
            return e
        }

        function n(e) {
            return e[R] = !0, e
        }

        function o(e) {
            var t = I.createElement("div");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function s(e, t) {
            for (var i = e.split("|"), n = i.length; n--;) C.attrHandle[i[n]] = t
        }

        function r(e, t) {
            var i = t && e,
                n = i && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || G) - (~e.sourceIndex || G);
            if (n) return n;
            if (i)
                for (; i = i.nextSibling;)
                    if (i === t) return -1;
            return e ? 1 : -1
        }

        function a(e) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }

        function l(e) {
            return function(t) {
                var i = t.nodeName.toLowerCase();
                return ("input" === i || "button" === i) && t.type === e
            }
        }

        function d(e) {
            return n((function(t) {
                return t = +t, n((function(i, n) {
                    for (var o, s = e([], i.length, t), r = s.length; r--;) i[o = s[r]] && (i[o] = !(n[o] = i[o]))
                }))
            }))
        }

        function c(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }

        function u() {}

        function p(e) {
            for (var t = 0, i = e.length, n = ""; t < i; t++) n += e[t].value;
            return n
        }

        function h(e, t, i) {
            var n = t.dir,
                o = i && "parentNode" === n,
                s = z++;
            return t.first ? function(t, i, s) {
                for (; t = t[n];)
                    if (1 === t.nodeType || o) return e(t, i, s)
            } : function(t, i, r) {
                var a, l, d, c = [q, s];
                if (r) {
                    for (; t = t[n];)
                        if ((1 === t.nodeType || o) && e(t, i, r)) return !0
                } else
                    for (; t = t[n];)
                        if (1 === t.nodeType || o) {
                            if ((a = (l = (d = t[R] || (t[R] = {}))[t.uniqueID] || (d[t.uniqueID] = {}))[n]) && a[0] === q && a[1] === s) return c[2] = a[2];
                            if (l[n] = c, c[2] = e(t, i, r)) return !0
                        }
            }
        }

        function f(e) {
            return e.length > 1 ? function(t, i, n) {
                for (var o = e.length; o--;)
                    if (!e[o](t, i, n)) return !1;
                return !0
            } : e[0]
        }

        function m(e, i, n) {
            for (var o = 0, s = i.length; o < s; o++) t(e, i[o], n);
            return n
        }

        function v(e, t, i, n, o) {
            for (var s, r = [], a = 0, l = e.length, d = null != t; a < l; a++)(s = e[a]) && (i && !i(s, n, o) || (r.push(s), d && t.push(a)));
            return r
        }

        function g(e, t, i, o, s, r) {
            return o && !o[R] && (o = g(o)), s && !s[R] && (s = g(s, r)), n((function(n, r, a, l) {
                var d, c, u, p = [],
                    h = [],
                    f = r.length,
                    g = n || m(t || "*", a.nodeType ? [a] : a, []),
                    y = !e || !n && t ? g : v(g, p, e, a, l),
                    b = i ? s || (n ? e : f || o) ? [] : r : y;
                if (i && i(y, b, a, l), o)
                    for (d = v(b, h), o(d, [], a, l), c = d.length; c--;)(u = d[c]) && (b[h[c]] = !(y[h[c]] = u));
                if (n) {
                    if (s || e) {
                        if (s) {
                            for (d = [], c = b.length; c--;)(u = b[c]) && d.push(y[c] = u);
                            s(null, b = [], d, l)
                        }
                        for (c = b.length; c--;)(u = b[c]) && (d = s ? ee(n, u) : p[c]) > -1 && (n[d] = !(r[d] = u))
                    }
                } else b = v(b === r ? b.splice(f, b.length) : b), s ? s(null, r, b, l) : J.apply(r, b)
            }))
        }

        function y(e) {
            for (var t, i, n, o = e.length, s = C.relative[e[0].type], r = s || C.relative[" "], a = s ? 1 : 0, l = h((function(e) {
                    return e === t
                }), r, !0), d = h((function(e) {
                    return ee(t, e) > -1
                }), r, !0), c = [function(e, i, n) {
                    var o = !s && (n || i !== E) || ((t = i).nodeType ? l(e, i, n) : d(e, i, n));
                    return t = null, o
                }]; a < o; a++)
                if (i = C.relative[e[a].type]) c = [h(f(c), i)];
                else {
                    if ((i = C.filter[e[a].type].apply(null, e[a].matches))[R]) {
                        for (n = ++a; n < o && !C.relative[e[n].type]; n++);
                        return g(a > 1 && f(c), a > 1 && p(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(ae, "$1"), i, a < n && y(e.slice(a, n)), n < o && y(e = e.slice(n)), n < o && p(e))
                    }
                    c.push(i)
                }
            return f(c)
        }

        function b(e, i) {
            var o = i.length > 0,
                s = e.length > 0,
                r = function(n, r, a, l, d) {
                    var c, u, p, h = 0,
                        f = "0",
                        m = n && [],
                        g = [],
                        y = E,
                        b = n || s && C.find.TAG("*", d),
                        w = q += null == y ? 1 : Math.random() || .1,
                        x = b.length;
                    for (d && (E = r === I || r || d); f !== x && null != (c = b[f]); f++) {
                        if (s && c) {
                            for (u = 0, r || c.ownerDocument === I || (D(c), a = !O); p = e[u++];)
                                if (p(c, r || I, a)) {
                                    l.push(c);
                                    break
                                }
                            d && (q = w)
                        }
                        o && ((c = !p && c) && h--, n && m.push(c))
                    }
                    if (h += f, o && f !== h) {
                        for (u = 0; p = i[u++];) p(m, g, r, a);
                        if (n) {
                            if (h > 0)
                                for (; f--;) m[f] || g[f] || (g[f] = K.call(l));
                            g = v(g)
                        }
                        J.apply(l, g), d && !n && g.length > 0 && h + i.length > 1 && t.uniqueSort(l)
                    }
                    return d && (q = w, E = y), m
                };
            return o ? n(r) : r
        }
        var w, x, C, k, T, $, S, _, E, A, j, D, I, L, O, N, P, F, H, R = "sizzle" + 1 * new Date,
            M = e.document,
            q = 0,
            z = 0,
            W = i(),
            B = i(),
            U = i(),
            V = function(e, t) {
                return e === t && (j = !0), 0
            },
            G = 1 << 31,
            Q = {}.hasOwnProperty,
            X = [],
            K = X.pop,
            Y = X.push,
            J = X.push,
            Z = X.slice,
            ee = function(e, t) {
                for (var i = 0, n = e.length; i < n; i++)
                    if (e[i] === t) return i;
                return -1
            },
            te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            ie = "[\\x20\\t\\r\\n\\f]",
            ne = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            oe = "\\[" + ie + "*(" + ne + ")(?:" + ie + "*([*^$|!~]?=)" + ie + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ne + "))|)" + ie + "*\\]",
            se = ":(" + ne + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)",
            re = new RegExp(ie + "+", "g"),
            ae = new RegExp("^" + ie + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ie + "+$", "g"),
            le = new RegExp("^" + ie + "*," + ie + "*"),
            de = new RegExp("^" + ie + "*([>+~]|" + ie + ")" + ie + "*"),
            ce = new RegExp("=" + ie + "*([^\\]'\"]*?)" + ie + "*\\]", "g"),
            ue = new RegExp(se),
            pe = new RegExp("^" + ne + "$"),
            he = {
                ID: new RegExp("^#(" + ne + ")"),
                CLASS: new RegExp("^\\.(" + ne + ")"),
                TAG: new RegExp("^(" + ne + "|[*])"),
                ATTR: new RegExp("^" + oe),
                PSEUDO: new RegExp("^" + se),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ie + "*(even|odd|(([+-]|)(\\d*)n|)" + ie + "*(?:([+-]|)" + ie + "*(\\d+)|))" + ie + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + te + ")$", "i"),
                needsContext: new RegExp("^" + ie + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ie + "*((?:-\\d)?\\d*)" + ie + "*\\)|)(?=[^-]|$)", "i")
            },
            fe = /^(?:input|select|textarea|button)$/i,
            me = /^h\d$/i,
            ve = /^[^{]+\{\s*\[native \w/,
            ge = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ye = /[+~]/,
            be = /'|\\/g,
            we = new RegExp("\\\\([\\da-f]{1,6}" + ie + "?|(" + ie + ")|.)", "ig"),
            xe = function(e, t, i) {
                var n = "0x" + t - 65536;
                return n != n || i ? t : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320)
            },
            Ce = function() {
                D()
            };
        try {
            J.apply(X = Z.call(M.childNodes), M.childNodes), X[M.childNodes.length].nodeType
        } catch (e) {
            J = {
                apply: X.length ? function(e, t) {
                    Y.apply(e, Z.call(t))
                } : function(e, t) {
                    for (var i = e.length, n = 0; e[i++] = t[n++];);
                    e.length = i - 1
                }
            }
        }
        for (w in x = t.support = {}, T = t.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName
            },
            D = t.setDocument = function(e) {
                var t, i, n = e ? e.ownerDocument || e : M;
                return n !== I && 9 === n.nodeType && n.documentElement ? (L = (I = n).documentElement, O = !T(I), (i = I.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", Ce, !1) : i.attachEvent && i.attachEvent("onunload", Ce)), x.attributes = o((function(e) {
                    return e.className = "i", !e.getAttribute("className")
                })), x.getElementsByTagName = o((function(e) {
                    return e.appendChild(I.createComment("")), !e.getElementsByTagName("*").length
                })), x.getElementsByClassName = ve.test(I.getElementsByClassName), x.getById = o((function(e) {
                    return L.appendChild(e).id = R, !I.getElementsByName || !I.getElementsByName(R).length
                })), x.getById ? (C.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && O) {
                        var i = t.getElementById(e);
                        return i ? [i] : []
                    }
                }, C.filter.ID = function(e) {
                    var t = e.replace(we, xe);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete C.find.ID, C.filter.ID = function(e) {
                    var t = e.replace(we, xe);
                    return function(e) {
                        var i = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                        return i && i.value === t
                    }
                }), C.find.TAG = x.getElementsByTagName ? function(e, t) {
                    return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : x.qsa ? t.querySelectorAll(e) : void 0
                } : function(e, t) {
                    var i, n = [],
                        o = 0,
                        s = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; i = s[o++];) 1 === i.nodeType && n.push(i);
                        return n
                    }
                    return s
                }, C.find.CLASS = x.getElementsByClassName && function(e, t) {
                    if (void 0 !== t.getElementsByClassName && O) return t.getElementsByClassName(e)
                }, P = [], N = [], (x.qsa = ve.test(I.querySelectorAll)) && (o((function(e) {
                    L.appendChild(e).innerHTML = "<a id='" + R + "'></a><select id='" + R + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && N.push("[*^$]=" + ie + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || N.push("\\[" + ie + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + R + "-]").length || N.push("~="), e.querySelectorAll(":checked").length || N.push(":checked"), e.querySelectorAll("a#" + R + "+*").length || N.push(".#.+[+~]")
                })), o((function(e) {
                    var t = I.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && N.push("name" + ie + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || N.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), N.push(",.*:")
                }))), (x.matchesSelector = ve.test(F = L.matches || L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && o((function(e) {
                    x.disconnectedMatch = F.call(e, "div"), F.call(e, "[s!='']:x"), P.push("!=", se)
                })), N = N.length && new RegExp(N.join("|")), P = P.length && new RegExp(P.join("|")), t = ve.test(L.compareDocumentPosition), H = t || ve.test(L.contains) ? function(e, t) {
                    var i = 9 === e.nodeType ? e.documentElement : e,
                        n = t && t.parentNode;
                    return e === n || !(!n || 1 !== n.nodeType || !(i.contains ? i.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)))
                } : function(e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, V = t ? function(e, t) {
                    if (e === t) return j = !0, 0;
                    var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return i || (1 & (i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !x.sortDetached && t.compareDocumentPosition(e) === i ? e === I || e.ownerDocument === M && H(M, e) ? -1 : t === I || t.ownerDocument === M && H(M, t) ? 1 : A ? ee(A, e) - ee(A, t) : 0 : 4 & i ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return j = !0, 0;
                    var i, n = 0,
                        o = e.parentNode,
                        s = t.parentNode,
                        a = [e],
                        l = [t];
                    if (!o || !s) return e === I ? -1 : t === I ? 1 : o ? -1 : s ? 1 : A ? ee(A, e) - ee(A, t) : 0;
                    if (o === s) return r(e, t);
                    for (i = e; i = i.parentNode;) a.unshift(i);
                    for (i = t; i = i.parentNode;) l.unshift(i);
                    for (; a[n] === l[n];) n++;
                    return n ? r(a[n], l[n]) : a[n] === M ? -1 : l[n] === M ? 1 : 0
                }, I) : I
            }, t.matches = function(e, i) {
                return t(e, null, null, i)
            }, t.matchesSelector = function(e, i) {
                if ((e.ownerDocument || e) !== I && D(e), i = i.replace(ce, "='$1']"), x.matchesSelector && O && !U[i + " "] && (!P || !P.test(i)) && (!N || !N.test(i))) try {
                    var n = F.call(e, i);
                    if (n || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
                } catch (e) {}
                return t(i, I, null, [e]).length > 0
            }, t.contains = function(e, t) {
                return (e.ownerDocument || e) !== I && D(e), H(e, t)
            }, t.attr = function(e, t) {
                (e.ownerDocument || e) !== I && D(e);
                var i = C.attrHandle[t.toLowerCase()],
                    n = i && Q.call(C.attrHandle, t.toLowerCase()) ? i(e, t, !O) : void 0;
                return void 0 !== n ? n : x.attributes || !O ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
            }, t.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, t.uniqueSort = function(e) {
                var t, i = [],
                    n = 0,
                    o = 0;
                if (j = !x.detectDuplicates, A = !x.sortStable && e.slice(0), e.sort(V), j) {
                    for (; t = e[o++];) t === e[o] && (n = i.push(o));
                    for (; n--;) e.splice(i[n], 1)
                }
                return A = null, e
            }, k = t.getText = function(e) {
                var t, i = "",
                    n = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) i += k(e)
                    } else if (3 === o || 4 === o) return e.nodeValue
                } else
                    for (; t = e[n++];) i += k(t);
                return i
            }, C = t.selectors = {
                cacheLength: 50,
                createPseudo: n,
                match: he,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(we, xe), e[3] = (e[3] || e[4] || e[5] || "").replace(we, xe), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, i = !e[6] && e[2];
                        return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : i && ue.test(i) && (t = $(i, !0)) && (t = i.indexOf(")", i.length - t) - i.length) && (e[0] = e[0].slice(0, t), e[2] = i.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(we, xe).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = W[e + " "];
                        return t || (t = new RegExp("(^|" + ie + ")" + e + "(" + ie + "|$)")) && W(e, (function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                        }))
                    },
                    ATTR: function(e, i, n) {
                        return function(o) {
                            var s = t.attr(o, e);
                            return null == s ? "!=" === i : !i || (s += "", "=" === i ? s === n : "!=" === i ? s !== n : "^=" === i ? n && 0 === s.indexOf(n) : "*=" === i ? n && s.indexOf(n) > -1 : "$=" === i ? n && s.slice(-n.length) === n : "~=" === i ? (" " + s.replace(re, " ") + " ").indexOf(n) > -1 : "|=" === i && (s === n || s.slice(0, n.length + 1) === n + "-"))
                        }
                    },
                    CHILD: function(e, t, i, n, o) {
                        var s = "nth" !== e.slice(0, 3),
                            r = "last" !== e.slice(-4),
                            a = "of-type" === t;
                        return 1 === n && 0 === o ? function(e) {
                            return !!e.parentNode
                        } : function(t, i, l) {
                            var d, c, u, p, h, f, m = s !== r ? "nextSibling" : "previousSibling",
                                v = t.parentNode,
                                g = a && t.nodeName.toLowerCase(),
                                y = !l && !a,
                                b = !1;
                            if (v) {
                                if (s) {
                                    for (; m;) {
                                        for (p = t; p = p[m];)
                                            if (a ? p.nodeName.toLowerCase() === g : 1 === p.nodeType) return !1;
                                        f = m = "only" === e && !f && "nextSibling"
                                    }
                                    return !0
                                }
                                if (f = [r ? v.firstChild : v.lastChild], r && y) {
                                    for (b = (h = (d = (c = (u = (p = v)[R] || (p[R] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] || [])[0] === q && d[1]) && d[2], p = h && v.childNodes[h]; p = ++h && p && p[m] || (b = h = 0) || f.pop();)
                                        if (1 === p.nodeType && ++b && p === t) {
                                            c[e] = [q, h, b];
                                            break
                                        }
                                } else if (y && (b = h = (d = (c = (u = (p = t)[R] || (p[R] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] || [])[0] === q && d[1]), !1 === b)
                                    for (;
                                        (p = ++h && p && p[m] || (b = h = 0) || f.pop()) && ((a ? p.nodeName.toLowerCase() !== g : 1 !== p.nodeType) || !++b || (y && ((c = (u = p[R] || (p[R] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] = [q, b]), p !== t)););
                                return (b -= o) === n || b % n == 0 && b / n >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, i) {
                        var o, s = C.pseudos[e] || C.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return s[R] ? s(i) : s.length > 1 ? (o = [e, e, "", i], C.setFilters.hasOwnProperty(e.toLowerCase()) ? n((function(e, t) {
                            for (var n, o = s(e, i), r = o.length; r--;) e[n = ee(e, o[r])] = !(t[n] = o[r])
                        })) : function(e) {
                            return s(e, 0, o)
                        }) : s
                    }
                },
                pseudos: {
                    not: n((function(e) {
                        var t = [],
                            i = [],
                            o = S(e.replace(ae, "$1"));
                        return o[R] ? n((function(e, t, i, n) {
                            for (var s, r = o(e, null, n, []), a = e.length; a--;)(s = r[a]) && (e[a] = !(t[a] = s))
                        })) : function(e, n, s) {
                            return t[0] = e, o(t, null, s, i), t[0] = null, !i.pop()
                        }
                    })),
                    has: n((function(e) {
                        return function(i) {
                            return t(e, i).length > 0
                        }
                    })),
                    contains: n((function(e) {
                        return e = e.replace(we, xe),
                            function(t) {
                                return (t.textContent || t.innerText || k(t)).indexOf(e) > -1
                            }
                    })),
                    lang: n((function(e) {
                        return pe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(we, xe).toLowerCase(),
                            function(t) {
                                var i;
                                do {
                                    if (i = O ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (i = i.toLowerCase()) === e || 0 === i.indexOf(e + "-")
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    })),
                    target: function(t) {
                        var i = e.location && e.location.hash;
                        return i && i.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === L
                    },
                    focus: function(e) {
                        return e === I.activeElement && (!I.hasFocus || I.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return !1 === e.disabled
                    },
                    disabled: function(e) {
                        return !0 === e.disabled
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !C.pseudos.empty(e)
                    },
                    header: function(e) {
                        return me.test(e.nodeName)
                    },
                    input: function(e) {
                        return fe.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: d((function() {
                        return [0]
                    })),
                    last: d((function(e, t) {
                        return [t - 1]
                    })),
                    eq: d((function(e, t, i) {
                        return [i < 0 ? i + t : i]
                    })),
                    even: d((function(e, t) {
                        for (var i = 0; i < t; i += 2) e.push(i);
                        return e
                    })),
                    odd: d((function(e, t) {
                        for (var i = 1; i < t; i += 2) e.push(i);
                        return e
                    })),
                    lt: d((function(e, t, i) {
                        for (var n = i < 0 ? i + t : i; --n >= 0;) e.push(n);
                        return e
                    })),
                    gt: d((function(e, t, i) {
                        for (var n = i < 0 ? i + t : i; ++n < t;) e.push(n);
                        return e
                    }))
                }
            }, C.pseudos.nth = C.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) C.pseudos[w] = a(w);
        for (w in {
                submit: !0,
                reset: !0
            }) C.pseudos[w] = l(w);
        return u.prototype = C.filters = C.pseudos, C.setFilters = new u, $ = t.tokenize = function(e, i) {
            var n, o, s, r, a, l, d, c = B[e + " "];
            if (c) return i ? 0 : c.slice(0);
            for (a = e, l = [], d = C.preFilter; a;) {
                for (r in n && !(o = le.exec(a)) || (o && (a = a.slice(o[0].length) || a), l.push(s = [])), n = !1, (o = de.exec(a)) && (n = o.shift(), s.push({
                        value: n,
                        type: o[0].replace(ae, " ")
                    }), a = a.slice(n.length)), C.filter) !(o = he[r].exec(a)) || d[r] && !(o = d[r](o)) || (n = o.shift(), s.push({
                    value: n,
                    type: r,
                    matches: o
                }), a = a.slice(n.length));
                if (!n) break
            }
            return i ? a.length : a ? t.error(e) : B(e, l).slice(0)
        }, S = t.compile = function(e, t) {
            var i, n = [],
                o = [],
                s = U[e + " "];
            if (!s) {
                for (t || (t = $(e)), i = t.length; i--;)(s = y(t[i]))[R] ? n.push(s) : o.push(s);
                (s = U(e, b(o, n))).selector = e
            }
            return s
        }, _ = t.select = function(e, t, i, n) {
            var o, s, r, a, l, d = "function" == typeof e && e,
                u = !n && $(e = d.selector || e);
            if (i = i || [], 1 === u.length) {
                if ((s = u[0] = u[0].slice(0)).length > 2 && "ID" === (r = s[0]).type && x.getById && 9 === t.nodeType && O && C.relative[s[1].type]) {
                    if (!(t = (C.find.ID(r.matches[0].replace(we, xe), t) || [])[0])) return i;
                    d && (t = t.parentNode), e = e.slice(s.shift().value.length)
                }
                for (o = he.needsContext.test(e) ? 0 : s.length; o-- && (r = s[o], !C.relative[a = r.type]);)
                    if ((l = C.find[a]) && (n = l(r.matches[0].replace(we, xe), ye.test(s[0].type) && c(t.parentNode) || t))) {
                        if (s.splice(o, 1), !(e = n.length && p(s))) return J.apply(i, n), i;
                        break
                    }
            }
            return (d || S(e, u))(n, t, !O, i, !t || ye.test(e) && c(t.parentNode) || t), i
        }, x.sortStable = R.split("").sort(V).join("") === R, x.detectDuplicates = !!j, D(), x.sortDetached = o((function(e) {
            return 1 & e.compareDocumentPosition(I.createElement("div"))
        })), o((function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        })) || s("type|href|height|width", (function(e, t, i) {
            if (!i) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        })), x.attributes && o((function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        })) || s("value", (function(e, t, i) {
            if (!i && "input" === e.nodeName.toLowerCase()) return e.defaultValue
        })), o((function(e) {
            return null == e.getAttribute("disabled")
        })) || s(te, (function(e, t, i) {
            var n;
            if (!i) return !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
        })), t
    }(e);
    he.find = ye, he.expr = ye.selectors, he.expr[":"] = he.expr.pseudos, he.uniqueSort = he.unique = ye.uniqueSort, he.text = ye.getText, he.isXMLDoc = ye.isXML, he.contains = ye.contains;
    var be = function(e, t, i) {
            for (var n = [], o = void 0 !== i;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (o && he(e).is(i)) break;
                    n.push(e)
                }
            return n
        },
        we = function(e, t) {
            for (var i = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && i.push(e);
            return i
        },
        xe = he.expr.match.needsContext,
        Ce = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
        ke = /^.[^:#\[\.,]*$/;
    he.filter = function(e, t, i) {
        var n = t[0];
        return i && (e = ":not(" + e + ")"), 1 === t.length && 1 === n.nodeType ? he.find.matchesSelector(n, e) ? [n] : [] : he.find.matches(e, he.grep(t, (function(e) {
            return 1 === e.nodeType
        })))
    }, he.fn.extend({
        find: function(e) {
            var t, i = [],
                n = this,
                o = n.length;
            if ("string" != typeof e) return this.pushStack(he(e).filter((function() {
                for (t = 0; t < o; t++)
                    if (he.contains(n[t], this)) return !0
            })));
            for (t = 0; t < o; t++) he.find(e, n[t], i);
            return (i = this.pushStack(o > 1 ? he.unique(i) : i)).selector = this.selector ? this.selector + " " + e : e, i
        },
        filter: function(e) {
            return this.pushStack(n(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(n(this, e || [], !0))
        },
        is: function(e) {
            return !!n(this, "string" == typeof e && xe.test(e) ? he(e) : e || [], !1).length
        }
    });
    var Te, $e = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (he.fn.init = function(e, t, i) {
        var n, o;
        if (!e) return this;
        if (i = i || Te, "string" == typeof e) {
            if (!(n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : $e.exec(e)) || !n[1] && t) return !t || t.jquery ? (t || i).find(e) : this.constructor(t).find(e);
            if (n[1]) {
                if (t = t instanceof he ? t[0] : t, he.merge(this, he.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : ne, !0)), Ce.test(n[1]) && he.isPlainObject(t))
                    for (n in t) he.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                return this
            }
            if ((o = ne.getElementById(n[2])) && o.parentNode) {
                if (o.id !== n[2]) return Te.find(e);
                this.length = 1, this[0] = o
            }
            return this.context = ne, this.selector = e, this
        }
        return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : he.isFunction(e) ? void 0 !== i.ready ? i.ready(e) : e(he) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), he.makeArray(e, this))
    }).prototype = he.fn, Te = he(ne);
    var Se = /^(?:parents|prev(?:Until|All))/,
        _e = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    he.fn.extend({
        has: function(e) {
            var t, i = he(e, this),
                n = i.length;
            return this.filter((function() {
                for (t = 0; t < n; t++)
                    if (he.contains(this, i[t])) return !0
            }))
        },
        closest: function(e, t) {
            for (var i, n = 0, o = this.length, s = [], r = xe.test(e) || "string" != typeof e ? he(e, t || this.context) : 0; n < o; n++)
                for (i = this[n]; i && i !== t; i = i.parentNode)
                    if (i.nodeType < 11 && (r ? r.index(i) > -1 : 1 === i.nodeType && he.find.matchesSelector(i, e))) {
                        s.push(i);
                        break
                    }
            return this.pushStack(s.length > 1 ? he.uniqueSort(s) : s)
        },
        index: function(e) {
            return e ? "string" == typeof e ? he.inArray(this[0], he(e)) : he.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(he.uniqueSort(he.merge(this.get(), he(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), he.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return be(e, "parentNode")
        },
        parentsUntil: function(e, t, i) {
            return be(e, "parentNode", i)
        },
        next: function(e) {
            return o(e, "nextSibling")
        },
        prev: function(e) {
            return o(e, "previousSibling")
        },
        nextAll: function(e) {
            return be(e, "nextSibling")
        },
        prevAll: function(e) {
            return be(e, "previousSibling")
        },
        nextUntil: function(e, t, i) {
            return be(e, "nextSibling", i)
        },
        prevUntil: function(e, t, i) {
            return be(e, "previousSibling", i)
        },
        siblings: function(e) {
            return we((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return we(e.firstChild)
        },
        contents: function(e) {
            return he.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : he.merge([], e.childNodes)
        }
    }, (function(e, t) {
        he.fn[e] = function(i, n) {
            var o = he.map(this, t, i);
            return "Until" !== e.slice(-5) && (n = i), n && "string" == typeof n && (o = he.filter(n, o)), this.length > 1 && (_e[e] || (o = he.uniqueSort(o)), Se.test(e) && (o = o.reverse())), this.pushStack(o)
        }
    }));
    var Ee, Ae, je = /\S+/g;
    for (Ae in he.Callbacks = function(e) {
            e = "string" == typeof e ? s(e) : he.extend({}, e);
            var t, i, n, o, r = [],
                a = [],
                l = -1,
                d = function() {
                    for (o = e.once, n = t = !0; a.length; l = -1)
                        for (i = a.shift(); ++l < r.length;) !1 === r[l].apply(i[0], i[1]) && e.stopOnFalse && (l = r.length, i = !1);
                    e.memory || (i = !1), t = !1, o && (r = i ? [] : "")
                },
                c = {
                    add: function() {
                        return r && (i && !t && (l = r.length - 1, a.push(i)), function t(i) {
                            he.each(i, (function(i, n) {
                                he.isFunction(n) ? e.unique && c.has(n) || r.push(n) : n && n.length && "string" !== he.type(n) && t(n)
                            }))
                        }(arguments), i && !t && d()), this
                    },
                    remove: function() {
                        return he.each(arguments, (function(e, t) {
                            for (var i;
                                (i = he.inArray(t, r, i)) > -1;) r.splice(i, 1), i <= l && l--
                        })), this
                    },
                    has: function(e) {
                        return e ? he.inArray(e, r) > -1 : r.length > 0
                    },
                    empty: function() {
                        return r && (r = []), this
                    },
                    disable: function() {
                        return o = a = [], r = i = "", this
                    },
                    disabled: function() {
                        return !r
                    },
                    lock: function() {
                        return o = !0, i || c.disable(), this
                    },
                    locked: function() {
                        return !!o
                    },
                    fireWith: function(e, i) {
                        return o || (i = [e, (i = i || []).slice ? i.slice() : i], a.push(i), t || d()), this
                    },
                    fire: function() {
                        return c.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!n
                    }
                };
            return c
        }, he.extend({
            Deferred: function(e) {
                var t = [
                        ["resolve", "done", he.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", he.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", he.Callbacks("memory")]
                    ],
                    i = "pending",
                    n = {
                        state: function() {
                            return i
                        },
                        always: function() {
                            return o.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var e = arguments;
                            return he.Deferred((function(i) {
                                he.each(t, (function(t, s) {
                                    var r = he.isFunction(e[t]) && e[t];
                                    o[s[1]]((function() {
                                        var e = r && r.apply(this, arguments);
                                        e && he.isFunction(e.promise) ? e.promise().progress(i.notify).done(i.resolve).fail(i.reject) : i[s[0] + "With"](this === n ? i.promise() : this, r ? [e] : arguments)
                                    }))
                                })), e = null
                            })).promise()
                        },
                        promise: function(e) {
                            return null != e ? he.extend(e, n) : n
                        }
                    },
                    o = {};
                return n.pipe = n.then, he.each(t, (function(e, s) {
                    var r = s[2],
                        a = s[3];
                    n[s[1]] = r.add, a && r.add((function() {
                        i = a
                    }), t[1 ^ e][2].disable, t[2][2].lock), o[s[0]] = function() {
                        return o[s[0] + "With"](this === o ? n : this, arguments), this
                    }, o[s[0] + "With"] = r.fireWith
                })), n.promise(o), e && e.call(o, o), o
            },
            when: function(e) {
                var t, i, n, o = 0,
                    s = oe.call(arguments),
                    r = s.length,
                    a = 1 !== r || e && he.isFunction(e.promise) ? r : 0,
                    l = 1 === a ? e : he.Deferred(),
                    d = function(e, i, n) {
                        return function(o) {
                            i[e] = this, n[e] = arguments.length > 1 ? oe.call(arguments) : o, n === t ? l.notifyWith(i, n) : --a || l.resolveWith(i, n)
                        }
                    };
                if (r > 1)
                    for (t = new Array(r), i = new Array(r), n = new Array(r); o < r; o++) s[o] && he.isFunction(s[o].promise) ? s[o].promise().progress(d(o, i, t)).done(d(o, n, s)).fail(l.reject) : --a;
                return a || l.resolveWith(n, s), l.promise()
            }
        }), he.fn.ready = function(e) {
            return he.ready.promise().done(e), this
        }, he.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? he.readyWait++ : he.ready(!0)
            },
            ready: function(e) {
                (!0 === e ? --he.readyWait : he.isReady) || (he.isReady = !0, !0 !== e && --he.readyWait > 0 || (Ee.resolveWith(ne, [he]), he.fn.triggerHandler && (he(ne).triggerHandler("ready"), he(ne).off("ready"))))
            }
        }), he.ready.promise = function(t) {
            if (!Ee)
                if (Ee = he.Deferred(), "complete" === ne.readyState || "loading" !== ne.readyState && !ne.documentElement.doScroll) e.setTimeout(he.ready);
                else if (ne.addEventListener) ne.addEventListener("DOMContentLoaded", a), e.addEventListener("load", a);
            else {
                ne.attachEvent("onreadystatechange", a), e.attachEvent("onload", a);
                var i = !1;
                try {
                    i = null == e.frameElement && ne.documentElement
                } catch (e) {}
                i && i.doScroll && function t() {
                    if (!he.isReady) {
                        try {
                            i.doScroll("left")
                        } catch (i) {
                            return e.setTimeout(t, 50)
                        }
                        r(), he.ready()
                    }
                }()
            }
            return Ee.promise(t)
        }, he.ready.promise(), he(ue)) break;
    ue.ownFirst = "0" === Ae, ue.inlineBlockNeedsLayout = !1, he((function() {
            var e, t, i, n;
            (i = ne.getElementsByTagName("body")[0]) && i.style && (t = ne.createElement("div"), (n = ne.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", i.appendChild(n).appendChild(t), void 0 !== t.style.zoom && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", ue.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (i.style.zoom = 1)), i.removeChild(n))
        })),
        function() {
            var e = ne.createElement("div");
            ue.deleteExpando = !0;
            try {
                delete e.test
            } catch (e) {
                ue.deleteExpando = !1
            }
            e = null
        }();
    var De, Ie = function(e) {
            var t = he.noData[(e.nodeName + " ").toLowerCase()],
                i = +e.nodeType || 1;
            return (1 === i || 9 === i) && (!t || !0 !== t && e.getAttribute("classid") === t)
        },
        Le = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Oe = /([A-Z])/g;
    he.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return !!(e = e.nodeType ? he.cache[e[he.expando]] : e[he.expando]) && !d(e)
        },
        data: function(e, t, i) {
            return c(e, t, i)
        },
        removeData: function(e, t) {
            return u(e, t)
        },
        _data: function(e, t, i) {
            return c(e, t, i, !0)
        },
        _removeData: function(e, t) {
            return u(e, t, !0)
        }
    }), he.fn.extend({
        data: function(e, t) {
            var i, n, o, s = this[0],
                r = s && s.attributes;
            if (void 0 === e) {
                if (this.length && (o = he.data(s), 1 === s.nodeType && !he._data(s, "parsedAttrs"))) {
                    for (i = r.length; i--;) r[i] && 0 === (n = r[i].name).indexOf("data-") && l(s, n = he.camelCase(n.slice(5)), o[n]);
                    he._data(s, "parsedAttrs", !0)
                }
                return o
            }
            return "object" == typeof e ? this.each((function() {
                he.data(this, e)
            })) : arguments.length > 1 ? this.each((function() {
                he.data(this, e, t)
            })) : s ? l(s, e, he.data(s, e)) : void 0
        },
        removeData: function(e) {
            return this.each((function() {
                he.removeData(this, e)
            }))
        }
    }), he.extend({
        queue: function(e, t, i) {
            var n;
            if (e) return t = (t || "fx") + "queue", n = he._data(e, t), i && (!n || he.isArray(i) ? n = he._data(e, t, he.makeArray(i)) : n.push(i)), n || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var i = he.queue(e, t),
                n = i.length,
                o = i.shift(),
                s = he._queueHooks(e, t),
                r = function() {
                    he.dequeue(e, t)
                };
            "inprogress" === o && (o = i.shift(), n--), o && ("fx" === t && i.unshift("inprogress"), delete s.stop, o.call(e, r, s)), !n && s && s.empty.fire()
        },
        _queueHooks: function(e, t) {
            var i = t + "queueHooks";
            return he._data(e, i) || he._data(e, i, {
                empty: he.Callbacks("once memory").add((function() {
                    he._removeData(e, t + "queue"), he._removeData(e, i)
                }))
            })
        }
    }), he.fn.extend({
        queue: function(e, t) {
            var i = 2;
            return "string" != typeof e && (t = e, e = "fx", i--), arguments.length < i ? he.queue(this[0], e) : void 0 === t ? this : this.each((function() {
                var i = he.queue(this, e, t);
                he._queueHooks(this, e), "fx" === e && "inprogress" !== i[0] && he.dequeue(this, e)
            }))
        },
        dequeue: function(e) {
            return this.each((function() {
                he.dequeue(this, e)
            }))
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var i, n = 1,
                o = he.Deferred(),
                s = this,
                r = this.length,
                a = function() {
                    --n || o.resolveWith(s, [s])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; r--;)(i = he._data(s[r], e + "queueHooks")) && i.empty && (n++, i.empty.add(a));
            return a(), o.promise(t)
        }
    }), ue.shrinkWrapBlocks = function() {
        return null != De ? De : (De = !1, (t = ne.getElementsByTagName("body")[0]) && t.style ? (e = ne.createElement("div"), (i = ne.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", t.appendChild(i).appendChild(e), void 0 !== e.style.zoom && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", e.appendChild(ne.createElement("div")).style.width = "5px", De = 3 !== e.offsetWidth), t.removeChild(i), De) : void 0);
        var e, t, i
    };
    var Ne, Pe, Fe, He = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Re = new RegExp("^(?:([+-])=|)(" + He + ")([a-z%]*)$", "i"),
        Me = ["Top", "Right", "Bottom", "Left"],
        qe = function(e, t) {
            return e = t || e, "none" === he.css(e, "display") || !he.contains(e.ownerDocument, e)
        },
        ze = function(e, t, i, n, o, s, r) {
            var a = 0,
                l = e.length,
                d = null == i;
            if ("object" === he.type(i))
                for (a in o = !0, i) ze(e, t, a, i[a], !0, s, r);
            else if (void 0 !== n && (o = !0, he.isFunction(n) || (r = !0), d && (r ? (t.call(e, n), t = null) : (d = t, t = function(e, t, i) {
                    return d.call(he(e), i)
                })), t))
                for (; a < l; a++) t(e[a], i, r ? n : n.call(e[a], a, t(e[a], i)));
            return o ? e : d ? t.call(e) : l ? t(e[0], i) : s
        },
        We = /^(?:checkbox|radio)$/i,
        Be = /<([\w:-]+)/,
        Ue = /^$|\/(?:java|ecma)script/i,
        Ve = /^\s+/,
        Ge = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    Ne = ne.createElement("div"), Pe = ne.createDocumentFragment(), Fe = ne.createElement("input"), Ne.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", ue.leadingWhitespace = 3 === Ne.firstChild.nodeType, ue.tbody = !Ne.getElementsByTagName("tbody").length, ue.htmlSerialize = !!Ne.getElementsByTagName("link").length, ue.html5Clone = "<:nav></:nav>" !== ne.createElement("nav").cloneNode(!0).outerHTML, Fe.type = "checkbox", Fe.checked = !0, Pe.appendChild(Fe), ue.appendChecked = Fe.checked, Ne.innerHTML = "<textarea>x</textarea>", ue.noCloneChecked = !!Ne.cloneNode(!0).lastChild.defaultValue, Pe.appendChild(Ne), (Fe = ne.createElement("input")).setAttribute("type", "radio"), Fe.setAttribute("checked", "checked"), Fe.setAttribute("name", "t"), Ne.appendChild(Fe), ue.checkClone = Ne.cloneNode(!0).cloneNode(!0).lastChild.checked, ue.noCloneEvent = !!Ne.addEventListener, Ne[he.expando] = 1, ue.attributes = !Ne.getAttribute(he.expando);
    var Qe = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: ue.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Qe.optgroup = Qe.option, Qe.tbody = Qe.tfoot = Qe.colgroup = Qe.caption = Qe.thead, Qe.th = Qe.td;
    var Xe = /<|&#?\w+;/,
        Ke = /<tbody/i;
    ! function() {
        var t, i, n = ne.createElement("div");
        for (t in {
                submit: !0,
                change: !0,
                focusin: !0
            }) i = "on" + t, (ue[t] = i in e) || (n.setAttribute(i, "t"), ue[t] = !1 === n.attributes[i].expando);
        n = null
    }();
    var Ye = /^(?:input|select|textarea)$/i,
        Je = /^key/,
        Ze = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        et = /^(?:focusinfocus|focusoutblur)$/,
        tt = /^([^.]*)(?:\.(.+)|)/;
    he.event = {
        global: {},
        add: function(e, t, i, n, o) {
            var s, r, a, l, d, c, u, p, h, f, m, v = he._data(e);
            if (v) {
                for (i.handler && (i = (l = i).handler, o = l.selector), i.guid || (i.guid = he.guid++), (r = v.events) || (r = v.events = {}), (c = v.handle) || (c = v.handle = function(e) {
                        return void 0 === he || e && he.event.triggered === e.type ? void 0 : he.event.dispatch.apply(c.elem, arguments)
                    }, c.elem = e), a = (t = (t || "").match(je) || [""]).length; a--;) h = m = (s = tt.exec(t[a]) || [])[1], f = (s[2] || "").split(".").sort(), h && (d = he.event.special[h] || {}, h = (o ? d.delegateType : d.bindType) || h, d = he.event.special[h] || {}, u = he.extend({
                    type: h,
                    origType: m,
                    data: n,
                    handler: i,
                    guid: i.guid,
                    selector: o,
                    needsContext: o && he.expr.match.needsContext.test(o),
                    namespace: f.join(".")
                }, l), (p = r[h]) || ((p = r[h] = []).delegateCount = 0, d.setup && !1 !== d.setup.call(e, n, f, c) || (e.addEventListener ? e.addEventListener(h, c, !1) : e.attachEvent && e.attachEvent("on" + h, c))), d.add && (d.add.call(e, u), u.handler.guid || (u.handler.guid = i.guid)), o ? p.splice(p.delegateCount++, 0, u) : p.push(u), he.event.global[h] = !0);
                e = null
            }
        },
        remove: function(e, t, i, n, o) {
            var s, r, a, l, d, c, u, p, h, f, m, v = he.hasData(e) && he._data(e);
            if (v && (c = v.events)) {
                for (d = (t = (t || "").match(je) || [""]).length; d--;)
                    if (h = m = (a = tt.exec(t[d]) || [])[1], f = (a[2] || "").split(".").sort(), h) {
                        for (u = he.event.special[h] || {}, p = c[h = (n ? u.delegateType : u.bindType) || h] || [], a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = s = p.length; s--;) r = p[s], !o && m !== r.origType || i && i.guid !== r.guid || a && !a.test(r.namespace) || n && n !== r.selector && ("**" !== n || !r.selector) || (p.splice(s, 1), r.selector && p.delegateCount--, u.remove && u.remove.call(e, r));
                        l && !p.length && (u.teardown && !1 !== u.teardown.call(e, f, v.handle) || he.removeEvent(e, h, v.handle), delete c[h])
                    } else
                        for (h in c) he.event.remove(e, h + t[d], i, n, !0);
                he.isEmptyObject(c) && (delete v.handle, he._removeData(e, "events"))
            }
        },
        trigger: function(t, i, n, o) {
            var s, r, a, l, d, c, u, p = [n || ne],
                h = ce.call(t, "type") ? t.type : t,
                f = ce.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = c = n = n || ne, 3 !== n.nodeType && 8 !== n.nodeType && !et.test(h + he.event.triggered) && (h.indexOf(".") > -1 && (f = h.split("."), h = f.shift(), f.sort()), r = h.indexOf(":") < 0 && "on" + h, (t = t[he.expando] ? t : new he.Event(h, "object" == typeof t && t)).isTrigger = o ? 2 : 3, t.namespace = f.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = n), i = null == i ? [t] : he.makeArray(i, [t]), d = he.event.special[h] || {}, o || !d.trigger || !1 !== d.trigger.apply(n, i))) {
                if (!o && !d.noBubble && !he.isWindow(n)) {
                    for (l = d.delegateType || h, et.test(l + h) || (a = a.parentNode); a; a = a.parentNode) p.push(a), c = a;
                    c === (n.ownerDocument || ne) && p.push(c.defaultView || c.parentWindow || e)
                }
                for (u = 0;
                    (a = p[u++]) && !t.isPropagationStopped();) t.type = u > 1 ? l : d.bindType || h, (s = (he._data(a, "events") || {})[t.type] && he._data(a, "handle")) && s.apply(a, i), (s = r && a[r]) && s.apply && Ie(a) && (t.result = s.apply(a, i), !1 === t.result && t.preventDefault());
                if (t.type = h, !o && !t.isDefaultPrevented() && (!d._default || !1 === d._default.apply(p.pop(), i)) && Ie(n) && r && n[h] && !he.isWindow(n)) {
                    (c = n[r]) && (n[r] = null), he.event.triggered = h;
                    try {
                        n[h]()
                    } catch (e) {}
                    he.event.triggered = void 0, c && (n[r] = c)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = he.event.fix(e);
            var t, i, n, o, s, r = [],
                a = oe.call(arguments),
                l = (he._data(this, "events") || {})[e.type] || [],
                d = he.event.special[e.type] || {};
            if (a[0] = e, e.delegateTarget = this, !d.preDispatch || !1 !== d.preDispatch.call(this, e)) {
                for (r = he.event.handlers.call(this, e, l), t = 0;
                    (o = r[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = o.elem, i = 0;
                        (s = o.handlers[i++]) && !e.isImmediatePropagationStopped();) e.rnamespace && !e.rnamespace.test(s.namespace) || (e.handleObj = s, e.data = s.data, void 0 !== (n = ((he.event.special[s.origType] || {}).handle || s.handler).apply(o.elem, a)) && !1 === (e.result = n) && (e.preventDefault(), e.stopPropagation()));
                return d.postDispatch && d.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var i, n, o, s, r = [],
                a = t.delegateCount,
                l = e.target;
            if (a && l.nodeType && ("click" !== e.type || isNaN(e.button) || e.button < 1))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== e.type)) {
                        for (n = [], i = 0; i < a; i++) void 0 === n[o = (s = t[i]).selector + " "] && (n[o] = s.needsContext ? he(o, this).index(l) > -1 : he.find(o, this, null, [l]).length), n[o] && n.push(s);
                        n.length && r.push({
                            elem: l,
                            handlers: n
                        })
                    }
            return a < t.length && r.push({
                elem: this,
                handlers: t.slice(a)
            }), r
        },
        fix: function(e) {
            if (e[he.expando]) return e;
            var t, i, n, o = e.type,
                s = e,
                r = this.fixHooks[o];
            for (r || (this.fixHooks[o] = r = Ze.test(o) ? this.mouseHooks : Je.test(o) ? this.keyHooks : {}), n = r.props ? this.props.concat(r.props) : this.props, e = new he.Event(s), t = n.length; t--;) e[i = n[t]] = s[i];
            return e.target || (e.target = s.srcElement || ne), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, r.filter ? r.filter(e, s) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var i, n, o, s = t.button,
                    r = t.fromElement;
                return null == e.pageX && null != t.clientX && (o = (n = e.target.ownerDocument || ne).documentElement, i = n.body, e.pageX = t.clientX + (o && o.scrollLeft || i && i.scrollLeft || 0) - (o && o.clientLeft || i && i.clientLeft || 0), e.pageY = t.clientY + (o && o.scrollTop || i && i.scrollTop || 0) - (o && o.clientTop || i && i.clientTop || 0)), !e.relatedTarget && r && (e.relatedTarget = r === e.target ? t.toElement : r), e.which || void 0 === s || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== w() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === w() && this.blur) return this.blur(), !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if (he.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(), !1
                },
                _default: function(e) {
                    return he.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, i) {
            var n = he.extend(new he.Event, i, {
                type: e,
                isSimulated: !0
            });
            he.event.trigger(n, null, t), n.isDefaultPrevented() && i.preventDefault()
        }
    }, he.removeEvent = ne.removeEventListener ? function(e, t, i) {
        e.removeEventListener && e.removeEventListener(t, i)
    } : function(e, t, i) {
        var n = "on" + t;
        e.detachEvent && (void 0 === e[n] && (e[n] = null), e.detachEvent(n, i))
    }, he.Event = function(e, t) {
        if (!(this instanceof he.Event)) return new he.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? y : b) : this.type = e, t && he.extend(this, t), this.timeStamp = e && e.timeStamp || he.now(), this[he.expando] = !0
    }, he.Event.prototype = {
        constructor: he.Event,
        isDefaultPrevented: b,
        isPropagationStopped: b,
        isImmediatePropagationStopped: b,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = y, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = y, e && !this.isSimulated && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = y,
                e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, he.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, (function(e, t) {
        he.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var i, n = this,
                    o = e.relatedTarget,
                    s = e.handleObj;
                return o && (o === n || he.contains(n, o)) || (e.type = s.origType, i = s.handler.apply(this, arguments), e.type = t), i
            }
        }
    })), ue.submit || (he.event.special.submit = {
        setup: function() {
            if (he.nodeName(this, "form")) return !1;
            he.event.add(this, "click._submit keypress._submit", (function(e) {
                var t = e.target,
                    i = he.nodeName(t, "input") || he.nodeName(t, "button") ? he.prop(t, "form") : void 0;
                i && !he._data(i, "submit") && (he.event.add(i, "submit._submit", (function(e) {
                    e._submitBubble = !0
                })), he._data(i, "submit", !0))
            }))
        },
        postDispatch: function(e) {
            e._submitBubble && (delete e._submitBubble, this.parentNode && !e.isTrigger && he.event.simulate("submit", this.parentNode, e))
        },
        teardown: function() {
            if (he.nodeName(this, "form")) return !1;
            he.event.remove(this, "._submit")
        }
    }), ue.change || (he.event.special.change = {
        setup: function() {
            if (Ye.test(this.nodeName)) return "checkbox" !== this.type && "radio" !== this.type || (he.event.add(this, "propertychange._change", (function(e) {
                "checked" === e.originalEvent.propertyName && (this._justChanged = !0)
            })), he.event.add(this, "click._change", (function(e) {
                this._justChanged && !e.isTrigger && (this._justChanged = !1), he.event.simulate("change", this, e)
            }))), !1;
            he.event.add(this, "beforeactivate._change", (function(e) {
                var t = e.target;
                Ye.test(t.nodeName) && !he._data(t, "change") && (he.event.add(t, "change._change", (function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || he.event.simulate("change", this.parentNode, e)
                })), he._data(t, "change", !0))
            }))
        },
        handle: function(e) {
            var t = e.target;
            if (this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type) return e.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
            return he.event.remove(this, "._change"), !Ye.test(this.nodeName)
        }
    }), ue.focusin || he.each({
        focus: "focusin",
        blur: "focusout"
    }, (function(e, t) {
        var i = function(e) {
            he.event.simulate(t, e.target, he.event.fix(e))
        };
        he.event.special[t] = {
            setup: function() {
                var n = this.ownerDocument || this,
                    o = he._data(n, t);
                o || n.addEventListener(e, i, !0), he._data(n, t, (o || 0) + 1)
            },
            teardown: function() {
                var n = this.ownerDocument || this,
                    o = he._data(n, t) - 1;
                o ? he._data(n, t, o) : (n.removeEventListener(e, i, !0), he._removeData(n, t))
            }
        }
    })), he.fn.extend({
        on: function(e, t, i, n) {
            return x(this, e, t, i, n)
        },
        one: function(e, t, i, n) {
            return x(this, e, t, i, n, 1)
        },
        off: function(e, t, i) {
            var n, o;
            if (e && e.preventDefault && e.handleObj) return n = e.handleObj, he(e.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler), this;
            if ("object" == typeof e) {
                for (o in e) this.off(o, t, e[o]);
                return this
            }
            return !1 !== t && "function" != typeof t || (i = t, t = void 0), !1 === i && (i = b), this.each((function() {
                he.event.remove(this, e, i, t)
            }))
        },
        trigger: function(e, t) {
            return this.each((function() {
                he.event.trigger(e, t, this)
            }))
        },
        triggerHandler: function(e, t) {
            var i = this[0];
            if (i) return he.event.trigger(e, t, i, !0)
        }
    });
    var it = / jQuery\d+="(?:null|\d+)"/g,
        nt = new RegExp("<(?:" + Ge + ")[\\s/>]", "i"),
        ot = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
        st = /<script|<style|<link/i,
        rt = /checked\s*(?:[^=]|=\s*.checked.)/i,
        at = /^true\/(.*)/,
        lt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        dt = h(ne).appendChild(ne.createElement("div"));
    he.extend({
        htmlPrefilter: function(e) {
            return e.replace(ot, "<$1></$2>")
        },
        clone: function(e, t, i) {
            var n, o, s, r, a, l = he.contains(e.ownerDocument, e);
            if (ue.html5Clone || he.isXMLDoc(e) || !nt.test("<" + e.nodeName + ">") ? s = e.cloneNode(!0) : (dt.innerHTML = e.outerHTML, dt.removeChild(s = dt.firstChild)), !(ue.noCloneEvent && ue.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || he.isXMLDoc(e)))
                for (n = f(s), a = f(e), r = 0; null != (o = a[r]); ++r) n[r] && S(o, n[r]);
            if (t)
                if (i)
                    for (a = a || f(e), n = n || f(s), r = 0; null != (o = a[r]); r++) $(o, n[r]);
                else $(e, s);
            return (n = f(s, "script")).length > 0 && m(n, !l && f(e, "script")), n = a = o = null, s
        },
        cleanData: function(e, t) {
            for (var i, n, o, s, r = 0, a = he.expando, l = he.cache, d = ue.attributes, c = he.event.special; null != (i = e[r]); r++)
                if ((t || Ie(i)) && (s = (o = i[a]) && l[o])) {
                    if (s.events)
                        for (n in s.events) c[n] ? he.event.remove(i, n) : he.removeEvent(i, n, s.handle);
                    l[o] && (delete l[o], d || void 0 === i.removeAttribute ? i[a] = void 0 : i.removeAttribute(a), ie.push(o))
                }
        }
    }), he.fn.extend({
        domManip: _,
        detach: function(e) {
            return E(this, e, !0)
        },
        remove: function(e) {
            return E(this, e)
        },
        text: function(e) {
            return ze(this, (function(e) {
                return void 0 === e ? he.text(this) : this.empty().append((this[0] && this[0].ownerDocument || ne).createTextNode(e))
            }), null, e, arguments.length)
        },
        append: function() {
            return _(this, arguments, (function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || C(this, e).appendChild(e)
            }))
        },
        prepend: function() {
            return _(this, arguments, (function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = C(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            }))
        },
        before: function() {
            return _(this, arguments, (function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            }))
        },
        after: function() {
            return _(this, arguments, (function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            }))
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && he.cleanData(f(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && he.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map((function() {
                return he.clone(this, e, t)
            }))
        },
        html: function(e) {
            return ze(this, (function(e) {
                var t = this[0] || {},
                    i = 0,
                    n = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(it, "") : void 0;
                if ("string" == typeof e && !st.test(e) && (ue.htmlSerialize || !nt.test(e)) && (ue.leadingWhitespace || !Ve.test(e)) && !Qe[(Be.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = he.htmlPrefilter(e);
                    try {
                        for (; i < n; i++) 1 === (t = this[i] || {}).nodeType && (he.cleanData(f(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }), null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return _(this, arguments, (function(t) {
                var i = this.parentNode;
                he.inArray(this, e) < 0 && (he.cleanData(f(this)), i && i.replaceChild(t, this))
            }), e)
        }
    }), he.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, (function(e, t) {
        he.fn[e] = function(e) {
            for (var i, n = 0, o = [], s = he(e), r = s.length - 1; n <= r; n++) i = n === r ? this : this.clone(!0), he(s[n])[t](i), re.apply(o, i.get());
            return this.pushStack(o)
        }
    }));
    var ct, ut = {
            HTML: "block",
            BODY: "block"
        },
        pt = /^margin/,
        ht = new RegExp("^(" + He + ")(?!px)[a-z%]+$", "i"),
        ft = function(e, t, i, n) {
            var o, s, r = {};
            for (s in t) r[s] = e.style[s], e.style[s] = t[s];
            for (s in o = i.apply(e, n || []), t) e.style[s] = r[s];
            return o
        },
        mt = ne.documentElement;
    ! function() {
        function t() {
            var t, c, u = ne.documentElement;
            u.appendChild(l), d.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", i = o = a = !1, n = r = !0, e.getComputedStyle && (c = e.getComputedStyle(d), i = "1%" !== (c || {}).top, a = "2px" === (c || {}).marginLeft, o = "4px" === (c || {
                width: "4px"
            }).width, d.style.marginRight = "50%", n = "4px" === (c || {
                marginRight: "4px"
            }).marginRight, (t = d.appendChild(ne.createElement("div"))).style.cssText = d.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", d.style.width = "1px", r = !parseFloat((e.getComputedStyle(t) || {}).marginRight), d.removeChild(t)), d.style.display = "none", (s = 0 === d.getClientRects().length) && (d.style.display = "", d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", d.childNodes[0].style.borderCollapse = "separate", (t = d.getElementsByTagName("td"))[0].style.cssText = "margin:0;border:0;padding:0;display:none", (s = 0 === t[0].offsetHeight) && (t[0].style.display = "", t[1].style.display = "none", s = 0 === t[0].offsetHeight)), u.removeChild(l)
        }
        var i, n, o, s, r, a, l = ne.createElement("div"),
            d = ne.createElement("div");
        d.style && (d.style.cssText = "float:left;opacity:.5", ue.opacity = "0.5" === d.style.opacity, ue.cssFloat = !!d.style.cssFloat, d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", ue.clearCloneStyle = "content-box" === d.style.backgroundClip, (l = ne.createElement("div")).style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", d.innerHTML = "", l.appendChild(d), ue.boxSizing = "" === d.style.boxSizing || "" === d.style.MozBoxSizing || "" === d.style.WebkitBoxSizing, he.extend(ue, {
            reliableHiddenOffsets: function() {
                return null == i && t(), s
            },
            boxSizingReliable: function() {
                return null == i && t(), o
            },
            pixelMarginRight: function() {
                return null == i && t(), n
            },
            pixelPosition: function() {
                return null == i && t(), i
            },
            reliableMarginRight: function() {
                return null == i && t(), r
            },
            reliableMarginLeft: function() {
                return null == i && t(), a
            }
        }))
    }();
    var vt, gt, yt = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (vt = function(t) {
        var i = t.ownerDocument.defaultView;
        return i && i.opener || (i = e), i.getComputedStyle(t)
    }, gt = function(e, t, i) {
        var n, o, s, r, a = e.style;
        return "" !== (r = (i = i || vt(e)) ? i.getPropertyValue(t) || i[t] : void 0) && void 0 !== r || he.contains(e.ownerDocument, e) || (r = he.style(e, t)), i && !ue.pixelMarginRight() && ht.test(r) && pt.test(t) && (n = a.width, o = a.minWidth, s = a.maxWidth, a.minWidth = a.maxWidth = a.width = r, r = i.width, a.width = n, a.minWidth = o, a.maxWidth = s), void 0 === r ? r : r + ""
    }) : mt.currentStyle && (vt = function(e) {
        return e.currentStyle
    }, gt = function(e, t, i) {
        var n, o, s, r, a = e.style;
        return null == (r = (i = i || vt(e)) ? i[t] : void 0) && a && a[t] && (r = a[t]), ht.test(r) && !yt.test(t) && (n = a.left, (s = (o = e.runtimeStyle) && o.left) && (o.left = e.currentStyle.left), a.left = "fontSize" === t ? "1em" : r, r = a.pixelLeft + "px", a.left = n, s && (o.left = s)), void 0 === r ? r : r + "" || "auto"
    });
    var bt = /alpha\([^)]*\)/i,
        wt = /opacity\s*=\s*([^)]*)/i,
        xt = /^(none|table(?!-c[ea]).+)/,
        Ct = new RegExp("^(" + He + ")(.*)$", "i"),
        kt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Tt = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        $t = ["Webkit", "O", "Moz", "ms"],
        St = ne.createElement("div").style;
    he.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var i = gt(e, "opacity");
                        return "" === i ? "1" : i
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: ue.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, i, n) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, s, r, a = he.camelCase(t),
                    l = e.style;
                if (t = he.cssProps[a] || (he.cssProps[a] = I(a) || a), r = he.cssHooks[t] || he.cssHooks[a], void 0 === i) return r && "get" in r && void 0 !== (o = r.get(e, !1, n)) ? o : l[t];
                if (!("string" === (s = typeof i) && (o = Re.exec(i)) && o[1] && (i = p(e, t, o), s = "number"), null == i || i != i || ("number" === s && (i += o && o[3] || (he.cssNumber[a] ? "" : "px")), ue.clearCloneStyle || "" !== i || 0 !== t.indexOf("background") || (l[t] = "inherit"), r && "set" in r && void 0 === (i = r.set(e, i, n))))) try {
                    l[t] = i
                } catch (e) {}
            }
        },
        css: function(e, t, i, n) {
            var o, s, r, a = he.camelCase(t);
            return t = he.cssProps[a] || (he.cssProps[a] = I(a) || a), (r = he.cssHooks[t] || he.cssHooks[a]) && "get" in r && (s = r.get(e, !0, i)), void 0 === s && (s = gt(e, t, n)), "normal" === s && t in Tt && (s = Tt[t]), "" === i || i ? (o = parseFloat(s), !0 === i || isFinite(o) ? o || 0 : s) : s
        }
    }), he.each(["height", "width"], (function(e, t) {
        he.cssHooks[t] = {
            get: function(e, i, n) {
                if (i) return xt.test(he.css(e, "display")) && 0 === e.offsetWidth ? ft(e, kt, (function() {
                    return P(e, t, n)
                })) : P(e, t, n)
            },
            set: function(e, i, n) {
                var o = n && vt(e);
                return O(e, i, n ? N(e, t, n, ue.boxSizing && "border-box" === he.css(e, "boxSizing", !1, o), o) : 0)
            }
        }
    })), ue.opacity || (he.cssHooks.opacity = {
        get: function(e, t) {
            return wt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var i = e.style,
                n = e.currentStyle,
                o = he.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                s = n && n.filter || i.filter || "";
            i.zoom = 1, (t >= 1 || "" === t) && "" === he.trim(s.replace(bt, "")) && i.removeAttribute && (i.removeAttribute("filter"), "" === t || n && !n.filter) || (i.filter = bt.test(s) ? s.replace(bt, o) : s + " " + o)
        }
    }), he.cssHooks.marginRight = D(ue.reliableMarginRight, (function(e, t) {
        if (t) return ft(e, {
            display: "inline-block"
        }, gt, [e, "marginRight"])
    })), he.cssHooks.marginLeft = D(ue.reliableMarginLeft, (function(e, t) {
        if (t) return (parseFloat(gt(e, "marginLeft")) || (he.contains(e.ownerDocument, e) ? e.getBoundingClientRect().left - ft(e, {
            marginLeft: 0
        }, (function() {
            return e.getBoundingClientRect().left
        })) : 0)) + "px"
    })), he.each({
        margin: "",
        padding: "",
        border: "Width"
    }, (function(e, t) {
        he.cssHooks[e + t] = {
            expand: function(i) {
                for (var n = 0, o = {}, s = "string" == typeof i ? i.split(" ") : [i]; n < 4; n++) o[e + Me[n] + t] = s[n] || s[n - 2] || s[0];
                return o
            }
        }, pt.test(e) || (he.cssHooks[e + t].set = O)
    })), he.fn.extend({
        css: function(e, t) {
            return ze(this, (function(e, t, i) {
                var n, o, s = {},
                    r = 0;
                if (he.isArray(t)) {
                    for (n = vt(e), o = t.length; r < o; r++) s[t[r]] = he.css(e, t[r], !1, n);
                    return s
                }
                return void 0 !== i ? he.style(e, t, i) : he.css(e, t)
            }), e, t, arguments.length > 1)
        },
        show: function() {
            return L(this, !0)
        },
        hide: function() {
            return L(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each((function() {
                qe(this) ? he(this).show() : he(this).hide()
            }))
        }
    }), he.Tween = F, F.prototype = {
        constructor: F,
        init: function(e, t, i, n, o, s) {
            this.elem = e, this.prop = i, this.easing = o || he.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = n, this.unit = s || (he.cssNumber[i] ? "" : "px")
        },
        cur: function() {
            var e = F.propHooks[this.prop];
            return e && e.get ? e.get(this) : F.propHooks._default.get(this)
        },
        run: function(e) {
            var t, i = F.propHooks[this.prop];
            return this.options.duration ? this.pos = t = he.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), i && i.set ? i.set(this) : F.propHooks._default.set(this), this
        }
    }, F.prototype.init.prototype = F.prototype, F.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = he.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                he.fx.step[e.prop] ? he.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[he.cssProps[e.prop]] && !he.cssHooks[e.prop] ? e.elem[e.prop] = e.now : he.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, F.propHooks.scrollTop = F.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, he.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, he.fx = F.prototype.init, he.fx.step = {};
    var _t, Et, At = /^(?:toggle|show|hide)$/,
        jt = /queueHooks$/;
    he.Animation = he.extend(W, {
            tweeners: {
                "*": [function(e, t) {
                    var i = this.createTween(e, t);
                    return p(i.elem, e, Re.exec(t), i), i
                }]
            },
            tweener: function(e, t) {
                he.isFunction(e) ? (t = e, e = ["*"]) : e = e.match(je);
                for (var i, n = 0, o = e.length; n < o; n++) i = e[n], W.tweeners[i] = W.tweeners[i] || [], W.tweeners[i].unshift(t)
            },
            prefilters: [q],
            prefilter: function(e, t) {
                t ? W.prefilters.unshift(e) : W.prefilters.push(e)
            }
        }), he.speed = function(e, t, i) {
            var n = e && "object" == typeof e ? he.extend({}, e) : {
                complete: i || !i && t || he.isFunction(e) && e,
                duration: e,
                easing: i && t || t && !he.isFunction(t) && t
            };
            return n.duration = he.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in he.fx.speeds ? he.fx.speeds[n.duration] : he.fx.speeds._default, null != n.queue && !0 !== n.queue || (n.queue = "fx"), n.old = n.complete, n.complete = function() {
                he.isFunction(n.old) && n.old.call(this), n.queue && he.dequeue(this, n.queue)
            }, n
        }, he.fn.extend({
            fadeTo: function(e, t, i, n) {
                return this.filter(qe).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, i, n)
            },
            animate: function(e, t, i, n) {
                var o = he.isEmptyObject(e),
                    s = he.speed(t, i, n),
                    r = function() {
                        var t = W(this, he.extend({}, e), s);
                        (o || he._data(this, "finish")) && t.stop(!0)
                    };
                return r.finish = r, o || !1 === s.queue ? this.each(r) : this.queue(s.queue, r)
            },
            stop: function(e, t, i) {
                var n = function(e) {
                    var t = e.stop;
                    delete e.stop, t(i)
                };
                return "string" != typeof e && (i = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each((function() {
                    var t = !0,
                        o = null != e && e + "queueHooks",
                        s = he.timers,
                        r = he._data(this);
                    if (o) r[o] && r[o].stop && n(r[o]);
                    else
                        for (o in r) r[o] && r[o].stop && jt.test(o) && n(r[o]);
                    for (o = s.length; o--;) s[o].elem !== this || null != e && s[o].queue !== e || (s[o].anim.stop(i), t = !1, s.splice(o, 1));
                    !t && i || he.dequeue(this, e)
                }))
            },
            finish: function(e) {
                return !1 !== e && (e = e || "fx"), this.each((function() {
                    var t, i = he._data(this),
                        n = i[e + "queue"],
                        o = i[e + "queueHooks"],
                        s = he.timers,
                        r = n ? n.length : 0;
                    for (i.finish = !0, he.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = s.length; t--;) s[t].elem === this && s[t].queue === e && (s[t].anim.stop(!0), s.splice(t, 1));
                    for (t = 0; t < r; t++) n[t] && n[t].finish && n[t].finish.call(this);
                    delete i.finish
                }))
            }
        }), he.each(["toggle", "show", "hide"], (function(e, t) {
            var i = he.fn[t];
            he.fn[t] = function(e, n, o) {
                return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(R(t, !0), e, n, o)
            }
        })), he.each({
            slideDown: R("show"),
            slideUp: R("hide"),
            slideToggle: R("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, (function(e, t) {
            he.fn[e] = function(e, i, n) {
                return this.animate(t, e, i, n)
            }
        })), he.timers = [], he.fx.tick = function() {
            var e, t = he.timers,
                i = 0;
            for (_t = he.now(); i < t.length; i++)(e = t[i])() || t[i] !== e || t.splice(i--, 1);
            t.length || he.fx.stop(), _t = void 0
        }, he.fx.timer = function(e) {
            he.timers.push(e), e() ? he.fx.start() : he.timers.pop()
        }, he.fx.interval = 13, he.fx.start = function() {
            Et || (Et = e.setInterval(he.fx.tick, he.fx.interval))
        }, he.fx.stop = function() {
            e.clearInterval(Et), Et = null
        }, he.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, he.fn.delay = function(t, i) {
            return t = he.fx && he.fx.speeds[t] || t, i = i || "fx", this.queue(i, (function(i, n) {
                var o = e.setTimeout(i, t);
                n.stop = function() {
                    e.clearTimeout(o)
                }
            }))
        },
        function() {
            var e, t = ne.createElement("input"),
                i = ne.createElement("div"),
                n = ne.createElement("select"),
                o = n.appendChild(ne.createElement("option"));
            (i = ne.createElement("div")).setAttribute("className", "t"), i.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = i.getElementsByTagName("a")[0], t.setAttribute("type", "checkbox"), i.appendChild(t), (e = i.getElementsByTagName("a")[0]).style.cssText = "top:1px", ue.getSetAttribute = "t" !== i.className, ue.style = /top/.test(e.getAttribute("style")), ue.hrefNormalized = "/a" === e.getAttribute("href"), ue.checkOn = !!t.value, ue.optSelected = o.selected, ue.enctype = !!ne.createElement("form").enctype, n.disabled = !0, ue.optDisabled = !o.disabled, (t = ne.createElement("input")).setAttribute("value", ""), ue.input = "" === t.getAttribute("value"), t.value = "t", t.setAttribute("type", "radio"), ue.radioValue = "t" === t.value
        }();
    var Dt = /\r/g,
        It = /[\x20\t\r\n\f]+/g;
    he.fn.extend({
        val: function(e) {
            var t, i, n, o = this[0];
            return arguments.length ? (n = he.isFunction(e), this.each((function(i) {
                var o;
                1 === this.nodeType && (null == (o = n ? e.call(this, i, he(this).val()) : e) ? o = "" : "number" == typeof o ? o += "" : he.isArray(o) && (o = he.map(o, (function(e) {
                    return null == e ? "" : e + ""
                }))), (t = he.valHooks[this.type] || he.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
            }))) : o ? (t = he.valHooks[o.type] || he.valHooks[o.nodeName.toLowerCase()]) && "get" in t && void 0 !== (i = t.get(o, "value")) ? i : "string" == typeof(i = o.value) ? i.replace(Dt, "") : null == i ? "" : i : void 0
        }
    }), he.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = he.find.attr(e, "value");
                    return null != t ? t : he.trim(he.text(e)).replace(It, " ")
                }
            },
            select: {
                get: function(e) {
                    for (var t, i, n = e.options, o = e.selectedIndex, s = "select-one" === e.type || o < 0, r = s ? null : [], a = s ? o + 1 : n.length, l = o < 0 ? a : s ? o : 0; l < a; l++)
                        if (((i = n[l]).selected || l === o) && (ue.optDisabled ? !i.disabled : null === i.getAttribute("disabled")) && (!i.parentNode.disabled || !he.nodeName(i.parentNode, "optgroup"))) {
                            if (t = he(i).val(), s) return t;
                            r.push(t)
                        }
                    return r
                },
                set: function(e, t) {
                    for (var i, n, o = e.options, s = he.makeArray(t), r = o.length; r--;)
                        if (n = o[r], he.inArray(he.valHooks.option.get(n), s) > -1) try {
                            n.selected = i = !0
                        } catch (e) {
                            n.scrollHeight
                        } else n.selected = !1;
                    return i || (e.selectedIndex = -1), o
                }
            }
        }
    }), he.each(["radio", "checkbox"], (function() {
        he.valHooks[this] = {
            set: function(e, t) {
                if (he.isArray(t)) return e.checked = he.inArray(he(e).val(), t) > -1
            }
        }, ue.checkOn || (he.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }));
    var Lt, Ot, Nt = he.expr.attrHandle,
        Pt = /^(?:checked|selected)$/i,
        Ft = ue.getSetAttribute,
        Ht = ue.input;
    he.fn.extend({
        attr: function(e, t) {
            return ze(this, he.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each((function() {
                he.removeAttr(this, e)
            }))
        }
    }), he.extend({
        attr: function(e, t, i) {
            var n, o, s = e.nodeType;
            if (3 !== s && 8 !== s && 2 !== s) return void 0 === e.getAttribute ? he.prop(e, t, i) : (1 === s && he.isXMLDoc(e) || (t = t.toLowerCase(), o = he.attrHooks[t] || (he.expr.match.bool.test(t) ? Ot : Lt)), void 0 !== i ? null === i ? void he.removeAttr(e, t) : o && "set" in o && void 0 !== (n = o.set(e, i, t)) ? n : (e.setAttribute(t, i + ""), i) : o && "get" in o && null !== (n = o.get(e, t)) ? n : null == (n = he.find.attr(e, t)) ? void 0 : n)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!ue.radioValue && "radio" === t && he.nodeName(e, "input")) {
                        var i = e.value;
                        return e.setAttribute("type", t), i && (e.value = i), t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var i, n, o = 0,
                s = t && t.match(je);
            if (s && 1 === e.nodeType)
                for (; i = s[o++];) n = he.propFix[i] || i, he.expr.match.bool.test(i) ? Ht && Ft || !Pt.test(i) ? e[n] = !1 : e[he.camelCase("default-" + i)] = e[n] = !1 : he.attr(e, i, ""), e.removeAttribute(Ft ? i : n)
        }
    }), Ot = {
        set: function(e, t, i) {
            return !1 === t ? he.removeAttr(e, i) : Ht && Ft || !Pt.test(i) ? e.setAttribute(!Ft && he.propFix[i] || i, i) : e[he.camelCase("default-" + i)] = e[i] = !0, i
        }
    }, he.each(he.expr.match.bool.source.match(/\w+/g), (function(e, t) {
        var i = Nt[t] || he.find.attr;
        Ht && Ft || !Pt.test(t) ? Nt[t] = function(e, t, n) {
            var o, s;
            return n || (s = Nt[t], Nt[t] = o, o = null != i(e, t, n) ? t.toLowerCase() : null, Nt[t] = s), o
        } : Nt[t] = function(e, t, i) {
            if (!i) return e[he.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    })), Ht && Ft || (he.attrHooks.value = {
        set: function(e, t, i) {
            if (!he.nodeName(e, "input")) return Lt && Lt.set(e, t, i);
            e.defaultValue = t
        }
    }), Ft || (Lt = {
        set: function(e, t, i) {
            var n = e.getAttributeNode(i);
            if (n || e.setAttributeNode(n = e.ownerDocument.createAttribute(i)), n.value = t += "", "value" === i || t === e.getAttribute(i)) return t
        }
    }, Nt.id = Nt.name = Nt.coords = function(e, t, i) {
        var n;
        if (!i) return (n = e.getAttributeNode(t)) && "" !== n.value ? n.value : null
    }, he.valHooks.button = {
        get: function(e, t) {
            var i = e.getAttributeNode(t);
            if (i && i.specified) return i.value
        },
        set: Lt.set
    }, he.attrHooks.contenteditable = {
        set: function(e, t, i) {
            Lt.set(e, "" !== t && t, i)
        }
    }, he.each(["width", "height"], (function(e, t) {
        he.attrHooks[t] = {
            set: function(e, i) {
                if ("" === i) return e.setAttribute(t, "auto"), i
            }
        }
    }))), ue.style || (he.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var Rt = /^(?:input|select|textarea|button|object)$/i,
        Mt = /^(?:a|area)$/i;
    he.fn.extend({
        prop: function(e, t) {
            return ze(this, he.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = he.propFix[e] || e, this.each((function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (e) {}
            }))
        }
    }), he.extend({
        prop: function(e, t, i) {
            var n, o, s = e.nodeType;
            if (3 !== s && 8 !== s && 2 !== s) return 1 === s && he.isXMLDoc(e) || (t = he.propFix[t] || t, o = he.propHooks[t]), void 0 !== i ? o && "set" in o && void 0 !== (n = o.set(e, i, t)) ? n : e[t] = i : o && "get" in o && null !== (n = o.get(e, t)) ? n : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = he.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Rt.test(e.nodeName) || Mt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }), ue.hrefNormalized || he.each(["href", "src"], (function(e, t) {
        he.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    })), ue.optSelected || (he.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), he.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], (function() {
        he.propFix[this.toLowerCase()] = this
    })), ue.enctype || (he.propFix.enctype = "encoding");
    var qt = /[\t\r\n\f]/g;
    he.fn.extend({
        addClass: function(e) {
            var t, i, n, o, s, r, a, l = 0;
            if (he.isFunction(e)) return this.each((function(t) {
                he(this).addClass(e.call(this, t, B(this)))
            }));
            if ("string" == typeof e && e)
                for (t = e.match(je) || []; i = this[l++];)
                    if (o = B(i), n = 1 === i.nodeType && (" " + o + " ").replace(qt, " ")) {
                        for (r = 0; s = t[r++];) n.indexOf(" " + s + " ") < 0 && (n += s + " ");
                        o !== (a = he.trim(n)) && he.attr(i, "class", a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, i, n, o, s, r, a, l = 0;
            if (he.isFunction(e)) return this.each((function(t) {
                he(this).removeClass(e.call(this, t, B(this)))
            }));
            if (!arguments.length) return this.attr("class", "");
            if ("string" == typeof e && e)
                for (t = e.match(je) || []; i = this[l++];)
                    if (o = B(i), n = 1 === i.nodeType && (" " + o + " ").replace(qt, " ")) {
                        for (r = 0; s = t[r++];)
                            for (; n.indexOf(" " + s + " ") > -1;) n = n.replace(" " + s + " ", " ");
                        o !== (a = he.trim(n)) && he.attr(i, "class", a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var i = typeof e;
            return "boolean" == typeof t && "string" === i ? t ? this.addClass(e) : this.removeClass(e) : he.isFunction(e) ? this.each((function(i) {
                he(this).toggleClass(e.call(this, i, B(this), t), t)
            })) : this.each((function() {
                var t, n, o, s;
                if ("string" === i)
                    for (n = 0, o = he(this), s = e.match(je) || []; t = s[n++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                else void 0 !== e && "boolean" !== i || ((t = B(this)) && he._data(this, "__className__", t), he.attr(this, "class", t || !1 === e ? "" : he._data(this, "__className__") || ""))
            }))
        },
        hasClass: function(e) {
            var t, i, n = 0;
            for (t = " " + e + " "; i = this[n++];)
                if (1 === i.nodeType && (" " + B(i) + " ").replace(qt, " ").indexOf(t) > -1) return !0;
            return !1
        }
    }), he.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), (function(e, t) {
        he.fn[t] = function(e, i) {
            return arguments.length > 0 ? this.on(t, null, e, i) : this.trigger(t)
        }
    })), he.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    });
    var zt = e.location,
        Wt = he.now(),
        Bt = /\?/,
        Ut = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    he.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var i, n = null,
            o = he.trim(t + "");
        return o && !he.trim(o.replace(Ut, (function(e, t, o, s) {
            return i && t && (n = 0), 0 === n ? e : (i = o || t, n += !s - !o, "")
        }))) ? Function("return " + o)() : he.error("Invalid JSON: " + t)
    }, he.parseXML = function(t) {
        var i;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? i = (new e.DOMParser).parseFromString(t, "text/xml") : ((i = new e.ActiveXObject("Microsoft.XMLDOM")).async = "false", i.loadXML(t))
        } catch (e) {
            i = void 0
        }
        return i && i.documentElement && !i.getElementsByTagName("parsererror").length || he.error("Invalid XML: " + t), i
    };
    var Vt = /#.*$/,
        Gt = /([?&])_=[^&]*/,
        Qt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Xt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Kt = /^(?:GET|HEAD)$/,
        Yt = /^\/\//,
        Jt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Zt = {},
        ei = {},
        ti = "*/".concat("*"),
        ii = zt.href,
        ni = Jt.exec(ii.toLowerCase()) || [];
    he.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ii,
            type: "GET",
            isLocal: Xt.test(ni[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": ti,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": he.parseJSON,
                "text xml": he.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? G(G(e, he.ajaxSettings), t) : G(he.ajaxSettings, e)
        },
        ajaxPrefilter: U(Zt),
        ajaxTransport: U(ei),
        ajax: function(t, i) {
            function n(t, i, n, o) {
                var s, u, y, b, x, k = i;
                2 !== w && (w = 2, l && e.clearTimeout(l), c = void 0, a = o || "", C.readyState = t > 0 ? 4 : 0, s = t >= 200 && t < 300 || 304 === t, n && (b = Q(p, C, n)), b = X(p, b, C, s), s ? (p.ifModified && ((x = C.getResponseHeader("Last-Modified")) && (he.lastModified[r] = x), (x = C.getResponseHeader("etag")) && (he.etag[r] = x)), 204 === t || "HEAD" === p.type ? k = "nocontent" : 304 === t ? k = "notmodified" : (k = b.state, u = b.data, s = !(y = b.error))) : (y = k, !t && k || (k = "error", t < 0 && (t = 0))), C.status = t, C.statusText = (i || k) + "", s ? m.resolveWith(h, [u, k, C]) : m.rejectWith(h, [C, k, y]), C.statusCode(g), g = void 0, d && f.trigger(s ? "ajaxSuccess" : "ajaxError", [C, p, s ? u : y]), v.fireWith(h, [C, k]), d && (f.trigger("ajaxComplete", [C, p]), --he.active || he.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (i = t, t = void 0), i = i || {};
            var o, s, r, a, l, d, c, u, p = he.ajaxSetup({}, i),
                h = p.context || p,
                f = p.context && (h.nodeType || h.jquery) ? he(h) : he.event,
                m = he.Deferred(),
                v = he.Callbacks("once memory"),
                g = p.statusCode || {},
                y = {},
                b = {},
                w = 0,
                x = "canceled",
                C = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === w) {
                            if (!u)
                                for (u = {}; t = Qt.exec(a);) u[t[1].toLowerCase()] = t[2];
                            t = u[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === w ? a : null
                    },
                    setRequestHeader: function(e, t) {
                        var i = e.toLowerCase();
                        return w || (e = b[i] = b[i] || e, y[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return w || (p.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (w < 2)
                                for (t in e) g[t] = [g[t], e[t]];
                            else C.always(e[C.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || x;
                        return c && c.abort(t), n(0, t), this
                    }
                };
            if (m.promise(C).complete = v.add, C.success = C.done, C.error = C.fail, p.url = ((t || p.url || ii) + "").replace(Vt, "").replace(Yt, ni[1] + "//"), p.type = i.method || i.type || p.method || p.type, p.dataTypes = he.trim(p.dataType || "*").toLowerCase().match(je) || [""], null == p.crossDomain && (o = Jt.exec(p.url.toLowerCase()), p.crossDomain = !(!o || o[1] === ni[1] && o[2] === ni[2] && (o[3] || ("http:" === o[1] ? "80" : "443")) === (ni[3] || ("http:" === ni[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = he.param(p.data, p.traditional)), V(Zt, p, i, C), 2 === w) return C;
            for (s in (d = he.event && p.global) && 0 == he.active++ && he.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Kt.test(p.type), r = p.url, p.hasContent || (p.data && (r = p.url += (Bt.test(r) ? "&" : "?") + p.data, delete p.data), !1 === p.cache && (p.url = Gt.test(r) ? r.replace(Gt, "$1_=" + Wt++) : r + (Bt.test(r) ? "&" : "?") + "_=" + Wt++)), p.ifModified && (he.lastModified[r] && C.setRequestHeader("If-Modified-Since", he.lastModified[r]), he.etag[r] && C.setRequestHeader("If-None-Match", he.etag[r])), (p.data && p.hasContent && !1 !== p.contentType || i.contentType) && C.setRequestHeader("Content-Type", p.contentType), C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + ti + "; q=0.01" : "") : p.accepts["*"]), p.headers) C.setRequestHeader(s, p.headers[s]);
            if (p.beforeSend && (!1 === p.beforeSend.call(h, C, p) || 2 === w)) return C.abort();
            for (s in x = "abort", {
                    success: 1,
                    error: 1,
                    complete: 1
                }) C[s](p[s]);
            if (c = V(ei, p, i, C)) {
                if (C.readyState = 1, d && f.trigger("ajaxSend", [C, p]), 2 === w) return C;
                p.async && p.timeout > 0 && (l = e.setTimeout((function() {
                    C.abort("timeout")
                }), p.timeout));
                try {
                    w = 1, c.send(y, n)
                } catch (e) {
                    if (!(w < 2)) throw e;
                    n(-1, e)
                }
            } else n(-1, "No Transport");
            return C
        },
        getJSON: function(e, t, i) {
            return he.get(e, t, i, "json")
        },
        getScript: function(e, t) {
            return he.get(e, void 0, t, "script")
        }
    }), he.each(["get", "post"], (function(e, t) {
        he[t] = function(e, i, n, o) {
            return he.isFunction(i) && (o = o || n, n = i, i = void 0), he.ajax(he.extend({
                url: e,
                type: t,
                dataType: o,
                data: i,
                success: n
            }, he.isPlainObject(e) && e))
        }
    })), he._evalUrl = function(e) {
        return he.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            throws: !0
        })
    }, he.fn.extend({
        wrapAll: function(e) {
            if (he.isFunction(e)) return this.each((function(t) {
                he(this).wrapAll(e.call(this, t))
            }));
            if (this[0]) {
                var t = he(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map((function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                })).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return he.isFunction(e) ? this.each((function(t) {
                he(this).wrapInner(e.call(this, t))
            })) : this.each((function() {
                var t = he(this),
                    i = t.contents();
                i.length ? i.wrapAll(e) : t.append(e)
            }))
        },
        wrap: function(e) {
            var t = he.isFunction(e);
            return this.each((function(i) {
                he(this).wrapAll(t ? e.call(this, i) : e)
            }))
        },
        unwrap: function() {
            return this.parent().each((function() {
                he.nodeName(this, "body") || he(this).replaceWith(this.childNodes)
            })).end()
        }
    }), he.expr.filters.hidden = function(e) {
        return ue.reliableHiddenOffsets() ? e.offsetWidth <= 0 && e.offsetHeight <= 0 && !e.getClientRects().length : Y(e)
    }, he.expr.filters.visible = function(e) {
        return !he.expr.filters.hidden(e)
    };
    var oi = /%20/g,
        si = /\[\]$/,
        ri = /\r?\n/g,
        ai = /^(?:submit|button|image|reset|file)$/i,
        li = /^(?:input|select|textarea|keygen)/i;
    he.param = function(e, t) {
            var i, n = [],
                o = function(e, t) {
                    t = he.isFunction(t) ? t() : null == t ? "" : t, n[n.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
            if (void 0 === t && (t = he.ajaxSettings && he.ajaxSettings.traditional), he.isArray(e) || e.jquery && !he.isPlainObject(e)) he.each(e, (function() {
                o(this.name, this.value)
            }));
            else
                for (i in e) J(i, e[i], t, o);
            return n.join("&").replace(oi, "+")
        }, he.fn.extend({
            serialize: function() {
                return he.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map((function() {
                    var e = he.prop(this, "elements");
                    return e ? he.makeArray(e) : this
                })).filter((function() {
                    var e = this.type;
                    return this.name && !he(this).is(":disabled") && li.test(this.nodeName) && !ai.test(e) && (this.checked || !We.test(e))
                })).map((function(e, t) {
                    var i = he(this).val();
                    return null == i ? null : he.isArray(i) ? he.map(i, (function(e) {
                        return {
                            name: t.name,
                            value: e.replace(ri, "\r\n")
                        }
                    })) : {
                        name: t.name,
                        value: i.replace(ri, "\r\n")
                    }
                })).get()
            }
        }),
        he.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
            return this.isLocal ? ee() : ne.documentMode > 8 ? Z() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Z() || ee()
        } : Z;
    var di = 0,
        ci = {},
        ui = he.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", (function() {
        for (var e in ci) ci[e](void 0, !0)
    })), ue.cors = !!ui && "withCredentials" in ui, (ui = ue.ajax = !!ui) && he.ajaxTransport((function(t) {
        var i;
        if (!t.crossDomain || ue.cors) return {
            send: function(n, o) {
                var s, r = t.xhr(),
                    a = ++di;
                if (r.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                    for (s in t.xhrFields) r[s] = t.xhrFields[s];
                for (s in t.mimeType && r.overrideMimeType && r.overrideMimeType(t.mimeType), t.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest"), n) void 0 !== n[s] && r.setRequestHeader(s, n[s] + "");
                r.send(t.hasContent && t.data || null), i = function(e, n) {
                    var s, l, d;
                    if (i && (n || 4 === r.readyState))
                        if (delete ci[a], i = void 0, r.onreadystatechange = he.noop, n) 4 !== r.readyState && r.abort();
                        else {
                            d = {}, s = r.status, "string" == typeof r.responseText && (d.text = r.responseText);
                            try {
                                l = r.statusText
                            } catch (e) {
                                l = ""
                            }
                            s || !t.isLocal || t.crossDomain ? 1223 === s && (s = 204) : s = d.text ? 200 : 404
                        }
                    d && o(s, l, d, r.getAllResponseHeaders())
                }, t.async ? 4 === r.readyState ? e.setTimeout(i) : r.onreadystatechange = ci[a] = i : i()
            },
            abort: function() {
                i && i(void 0, !0)
            }
        }
    })), he.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return he.globalEval(e), e
            }
        }
    }), he.ajaxPrefilter("script", (function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    })), he.ajaxTransport("script", (function(e) {
        if (e.crossDomain) {
            var t, i = ne.head || he("head")[0] || ne.documentElement;
            return {
                send: function(n, o) {
                    (t = ne.createElement("script")).async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, i) {
                        (i || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, i || o(200, "success"))
                    }, i.insertBefore(t, i.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    }));
    var pi = [],
        hi = /(=)\?(?=&|$)|\?\?/;
    he.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = pi.pop() || he.expando + "_" + Wt++;
            return this[e] = !0, e
        }
    }), he.ajaxPrefilter("json jsonp", (function(t, i, n) {
        var o, s, r, a = !1 !== t.jsonp && (hi.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && hi.test(t.data) && "data");
        if (a || "jsonp" === t.dataTypes[0]) return o = t.jsonpCallback = he.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(hi, "$1" + o) : !1 !== t.jsonp && (t.url += (Bt.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), t.converters["script json"] = function() {
            return r || he.error(o + " was not called"), r[0]
        }, t.dataTypes[0] = "json", s = e[o], e[o] = function() {
            r = arguments
        }, n.always((function() {
            void 0 === s ? he(e).removeProp(o) : e[o] = s, t[o] && (t.jsonpCallback = i.jsonpCallback, pi.push(o)), r && he.isFunction(s) && s(r[0]), r = s = void 0
        })), "script"
    })), he.parseHTML = function(e, t, i) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (i = t, t = !1), t = t || ne;
        var n = Ce.exec(e),
            o = !i && [];
        return n ? [t.createElement(n[1])] : (n = g([e], t, o), o && o.length && he(o).remove(), he.merge([], n.childNodes))
    };
    var fi = he.fn.load;
    he.fn.load = function(e, t, i) {
        if ("string" != typeof e && fi) return fi.apply(this, arguments);
        var n, o, s, r = this,
            a = e.indexOf(" ");
        return a > -1 && (n = he.trim(e.slice(a, e.length)), e = e.slice(0, a)), he.isFunction(t) ? (i = t, t = void 0) : t && "object" == typeof t && (o = "POST"), r.length > 0 && he.ajax({
            url: e,
            type: o || "GET",
            dataType: "html",
            data: t
        }).done((function(e) {
            s = arguments, r.html(n ? he("<div>").append(he.parseHTML(e)).find(n) : e)
        })).always(i && function(e, t) {
            r.each((function() {
                i.apply(this, s || [e.responseText, t, e])
            }))
        }), this
    }, he.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], (function(e, t) {
        he.fn[t] = function(e) {
            return this.on(t, e)
        }
    })), he.expr.filters.animated = function(e) {
        return he.grep(he.timers, (function(t) {
            return e === t.elem
        })).length
    }, he.offset = {
        setOffset: function(e, t, i) {
            var n, o, s, r, a, l, d = he.css(e, "position"),
                c = he(e),
                u = {};
            "static" === d && (e.style.position = "relative"), a = c.offset(), s = he.css(e, "top"), l = he.css(e, "left"), ("absolute" === d || "fixed" === d) && he.inArray("auto", [s, l]) > -1 ? (r = (n = c.position()).top, o = n.left) : (r = parseFloat(s) || 0, o = parseFloat(l) || 0), he.isFunction(t) && (t = t.call(e, i, he.extend({}, a))), null != t.top && (u.top = t.top - a.top + r), null != t.left && (u.left = t.left - a.left + o), "using" in t ? t.using.call(e, u) : c.css(u)
        }
    }, he.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each((function(t) {
                he.offset.setOffset(this, e, t)
            }));
            var t, i, n = {
                    top: 0,
                    left: 0
                },
                o = this[0],
                s = o && o.ownerDocument;
            return s ? (t = s.documentElement, he.contains(t, o) ? (void 0 !== o.getBoundingClientRect && (n = o.getBoundingClientRect()), i = te(s), {
                top: n.top + (i.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: n.left + (i.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : n) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, i = {
                        top: 0,
                        left: 0
                    },
                    n = this[0];
                return "fixed" === he.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), he.nodeName(e[0], "html") || (i = e.offset()), i.top += he.css(e[0], "borderTopWidth", !0), i.left += he.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - i.top - he.css(n, "marginTop", !0),
                    left: t.left - i.left - he.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map((function() {
                for (var e = this.offsetParent; e && !he.nodeName(e, "html") && "static" === he.css(e, "position");) e = e.offsetParent;
                return e || mt
            }))
        }
    }), he.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, (function(e, t) {
        var i = /Y/.test(t);
        he.fn[e] = function(n) {
            return ze(this, (function(e, n, o) {
                var s = te(e);
                if (void 0 === o) return s ? t in s ? s[t] : s.document.documentElement[n] : e[n];
                s ? s.scrollTo(i ? he(s).scrollLeft() : o, i ? o : he(s).scrollTop()) : e[n] = o
            }), e, n, arguments.length, null)
        }
    })), he.each(["top", "left"], (function(e, t) {
        he.cssHooks[t] = D(ue.pixelPosition, (function(e, i) {
            if (i) return i = gt(e, t), ht.test(i) ? he(e).position()[t] + "px" : i
        }))
    })), he.each({
        Height: "height",
        Width: "width"
    }, (function(e, t) {
        he.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, (function(i, n) {
            he.fn[n] = function(n, o) {
                var s = arguments.length && (i || "boolean" != typeof n),
                    r = i || (!0 === n || !0 === o ? "margin" : "border");
                return ze(this, (function(t, i, n) {
                    var o;
                    return he.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === n ? he.css(t, i, r) : he.style(t, i, n, r)
                }), t, s ? n : void 0, s, null)
            }
        }))
    })), he.fn.extend({
        bind: function(e, t, i) {
            return this.on(e, null, t, i)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, i, n) {
            return this.on(t, e, i, n)
        },
        undelegate: function(e, t, i) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", i)
        }
    }), he.fn.size = function() {
        return this.length
    }, he.fn.andSelf = he.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], (function() {
        return he
    }));
    var mi = e.jQuery,
        vi = e.$;
    return he.noConflict = function(t) {
        return e.$ === he && (e.$ = vi), t && e.jQuery === he && (e.jQuery = mi), he
    }, t || (e.jQuery = e.$ = he), he
})),
function(e, t) {
    "use strict";
    var i;
    e.rails !== t && e.error("jquery-ujs has already been loaded!");
    var n = e(document);
    e.rails = i = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
        buttonClickSelector: "button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
        disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]), textarea[name][required]:not([disabled])",
        fileInputSelector: "input[name][type=file]:not([disabled])",
        linkDisableSelector: "a[data-disable-with], a[data-disable]",
        buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
        csrfToken: function() {
            return e("meta[name=csrf-token]").attr("content")
        },
        csrfParam: function() {
            return e("meta[name=csrf-param]").attr("content")
        },
        CSRFProtection: function(e) {
            var t = i.csrfToken();
            t && e.setRequestHeader("X-CSRF-Token", t)
        },
        refreshCSRFTokens: function() {
            e('form input[name="' + i.csrfParam() + '"]').val(i.csrfToken())
        },
        fire: function(t, i, n) {
            var o = e.Event(i);
            return t.trigger(o, n), !1 !== o.result
        },
        confirm: function(e) {
            return confirm(e)
        },
        ajax: function(t) {
            return e.ajax(t)
        },
        href: function(e) {
            return e[0].href
        },
        isRemote: function(e) {
            return e.data("remote") !== t && !1 !== e.data("remote")
        },
        handleRemote: function(n) {
            var o, s, r, a, l, d;
            if (i.fire(n, "ajax:before")) {
                if (a = n.data("with-credentials") || null, l = n.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, n.is("form")) {
                    o = n.data("ujs:submit-button-formmethod") || n.attr("method"), s = n.data("ujs:submit-button-formaction") || n.attr("action"), r = e(n[0]).serializeArray();
                    var c = n.data("ujs:submit-button");
                    c && (r.push(c), n.data("ujs:submit-button", null)), n.data("ujs:submit-button-formmethod", null), n.data("ujs:submit-button-formaction", null)
                } else n.is(i.inputChangeSelector) ? (o = n.data("method"), s = n.data("url"), r = n.serialize(), n.data("params") && (r = r + "&" + n.data("params"))) : n.is(i.buttonClickSelector) ? (o = n.data("method") || "get", s = n.data("url"), r = n.serialize(), n.data("params") && (r = r + "&" + n.data("params"))) : (o = n.data("method"), s = i.href(n), r = n.data("params") || null);
                return d = {
                    type: o || "GET",
                    data: r,
                    dataType: l,
                    beforeSend: function(e, o) {
                        if (o.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + o.accepts.script), !i.fire(n, "ajax:beforeSend", [e, o])) return !1;
                        n.trigger("ajax:send", e)
                    },
                    success: function(e, t, i) {
                        n.trigger("ajax:success", [e, t, i])
                    },
                    complete: function(e, t) {
                        n.trigger("ajax:complete", [e, t])
                    },
                    error: function(e, t, i) {
                        n.trigger("ajax:error", [e, t, i])
                    },
                    crossDomain: i.isCrossDomain(s)
                }, a && (d.xhrFields = {
                    withCredentials: a
                }), s && (d.url = s), i.ajax(d)
            }
            return !1
        },
        isCrossDomain: function(e) {
            var t = document.createElement("a");
            t.href = location.href;
            var i = document.createElement("a");
            try {
                return i.href = e, i.href = i.href, !((!i.protocol || ":" === i.protocol) && !i.host || t.protocol + "//" + t.host == i.protocol + "//" + i.host)
            } catch (e) {
                return !0
            }
        },
        handleMethod: function(n) {
            var o = i.href(n),
                s = n.data("method"),
                r = n.attr("target"),
                a = i.csrfToken(),
                l = i.csrfParam(),
                d = e('<form method="post" action="' + o + '"></form>'),
                c = '<input name="_method" value="' + s + '" type="hidden" />';
            l === t || a === t || i.isCrossDomain(o) || (c += '<input name="' + l + '" value="' + a + '" type="hidden" />'), r && d.attr("target", r), d.hide().append(c).appendTo("body"), d.submit()
        },
        formElements: function(t, i) {
            return t.is("form") ? e(t[0].elements).filter(i) : t.find(i)
        },
        disableFormElements: function(t) {
            i.formElements(t, i.disableSelector).each((function() {
                i.disableFormElement(e(this))
            }))
        },
        disableFormElement: function(e) {
            var i, n;
            i = e.is("button") ? "html" : "val", (n = e.data("disable-with")) !== t && (e.data("ujs:enable-with", e[i]()), e[i](n)), e.prop("disabled", !0), e.data("ujs:disabled", !0)
        },
        enableFormElements: function(t) {
            i.formElements(t, i.enableSelector).each((function() {
                i.enableFormElement(e(this))
            }))
        },
        enableFormElement: function(e) {
            var i = e.is("button") ? "html" : "val";
            e.data("ujs:enable-with") !== t && (e[i](e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.prop("disabled", !1), e.removeData("ujs:disabled")
        },
        allowAction: function(e) {
            var t, n = e.data("confirm"),
                o = !1;
            if (!n) return !0;
            if (i.fire(e, "confirm")) {
                try {
                    o = i.confirm(n)
                } catch (e) {
                    (console.error || console.log).call(console, e.stack || e)
                }
                t = i.fire(e, "confirm:complete", [o])
            }
            return o && t
        },
        blankInputs: function(t, i, n) {
            var o, s, r, a = e(),
                l = i || "input,textarea",
                d = t.find(l),
                c = {};
            return d.each((function() {
                (o = e(this)).is("input[type=radio]") ? (r = o.attr("name"), c[r] || (0 === t.find('input[type=radio]:checked[name="' + r + '"]').length && (s = t.find('input[type=radio][name="' + r + '"]'), a = a.add(s)), c[r] = r)) : (o.is("input[type=checkbox],input[type=radio]") ? o.is(":checked") : !!o.val()) === n && (a = a.add(o))
            })), !!a.length && a
        },
        nonBlankInputs: function(e, t) {
            return i.blankInputs(e, t, !0)
        },
        stopEverything: function(t) {
            return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
        },
        disableElement: function(e) {
            var n = e.data("disable-with");
            n !== t && (e.data("ujs:enable-with", e.html()), e.html(n)), e.bind("click.railsDisable", (function(e) {
                return i.stopEverything(e)
            })), e.data("ujs:disabled", !0)
        },
        enableElement: function(e) {
            e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable"), e.removeData("ujs:disabled")
        }
    }, i.fire(n, "rails:attachBindings") && (e.ajaxPrefilter((function(e, t, n) {
        e.crossDomain || i.CSRFProtection(n)
    })), e(window).on("pageshow.rails", (function() {
        e(e.rails.enableSelector).each((function() {
            var t = e(this);
            t.data("ujs:disabled") && e.rails.enableFormElement(t)
        })), e(e.rails.linkDisableSelector).each((function() {
            var t = e(this);
            t.data("ujs:disabled") && e.rails.enableElement(t)
        }))
    })), n.on("ajax:complete", i.linkDisableSelector, (function() {
        i.enableElement(e(this))
    })), n.on("ajax:complete", i.buttonDisableSelector, (function() {
        i.enableFormElement(e(this))
    })), n.on("click.rails", i.linkClickSelector, (function(t) {
        var n = e(this),
            o = n.data("method"),
            s = n.data("params"),
            r = t.metaKey || t.ctrlKey;
        if (!i.allowAction(n)) return i.stopEverything(t);
        if (!r && n.is(i.linkDisableSelector) && i.disableElement(n), i.isRemote(n)) {
            if (r && (!o || "GET" === o) && !s) return !0;
            var a = i.handleRemote(n);
            return !1 === a ? i.enableElement(n) : a.fail((function() {
                i.enableElement(n)
            })), !1
        }
        return o ? (i.handleMethod(n), !1) : void 0
    })), n.on("click.rails", i.buttonClickSelector, (function(t) {
        var n = e(this);
        if (!i.allowAction(n) || !i.isRemote(n)) return i.stopEverything(t);
        n.is(i.buttonDisableSelector) && i.disableFormElement(n);
        var o = i.handleRemote(n);
        return !1 === o ? i.enableFormElement(n) : o.fail((function() {
            i.enableFormElement(n)
        })), !1
    })), n.on("change.rails", i.inputChangeSelector, (function(t) {
        var n = e(this);
        return i.allowAction(n) && i.isRemote(n) ? (i.handleRemote(n), !1) : i.stopEverything(t)
    })), n.on("submit.rails", i.formSubmitSelector, (function(n) {
        var o, s, r = e(this),
            a = i.isRemote(r);
        if (!i.allowAction(r)) return i.stopEverything(n);
        if (r.attr("novalidate") === t)
            if (r.data("ujs:formnovalidate-button") === t) {
                if ((o = i.blankInputs(r, i.requiredInputSelector, !1)) && i.fire(r, "ajax:aborted:required", [o])) return i.stopEverything(n)
            } else r.data("ujs:formnovalidate-button", t);
        if (a) {
            if (s = i.nonBlankInputs(r, i.fileInputSelector)) {
                setTimeout((function() {
                    i.disableFormElements(r)
                }), 13);
                var l = i.fire(r, "ajax:aborted:file", [s]);
                return l || setTimeout((function() {
                    i.enableFormElements(r)
                }), 13), l
            }
            return i.handleRemote(r), !1
        }
        setTimeout((function() {
            i.disableFormElements(r)
        }), 13)
    })), n.on("click.rails", i.formInputClickSelector, (function(t) {
        var n = e(this);
        if (!i.allowAction(n)) return i.stopEverything(t);
        var o = n.attr("name"),
            s = o ? {
                name: o,
                value: n.val()
            } : null,
            r = n.closest("form");
        0 === r.length && (r = e("#" + n.attr("form"))), r.data("ujs:submit-button", s), r.data("ujs:formnovalidate-button", n.attr("formnovalidate")), r.data("ujs:submit-button-formaction", n.attr("formaction")), r.data("ujs:submit-button-formmethod", n.attr("formmethod"))
    })), n.on("ajax:send.rails", i.formSubmitSelector, (function(t) {
        this === t.target && i.disableFormElements(e(this))
    })), n.on("ajax:complete.rails", i.formSubmitSelector, (function(t) {
        this === t.target && i.enableFormElements(e(this))
    })), e((function() {
        i.refreshCSRFTokens()
    })))
}(jQuery),
function(e) {
    "use strict";
    e.ajaxPrefilter((function(e) {
        if (e.iframe) return e.originalURL = e.url, "iframe"
    })), e.ajaxTransport("iframe", (function(t, i, n) {
        function o() {
            l.each((function(t, i) {
                var n = e(i);
                n.data("clone").replaceWith(n)
            })), s.remove(), r.one("load", (function() {
                r.remove()
            })), r.attr("src", "about:blank")
        }
        var s = null,
            r = null,
            a = "iframe-" + e.now(),
            l = e(t.files).filter(":file:enabled"),
            d = null;
        if (t.dataTypes.shift(), t.data = i.data, l.length) return s = e("<form enctype='multipart/form-data' method='post'></form>").hide().attr({
            action: t.originalURL,
            target: a
        }), "string" == typeof t.data && t.data.length > 0 && e.error("data must not be serialized"), e.each(t.data || {}, (function(t, i) {
            e.isPlainObject(i) && (t = i.name, i = i.value), e("<input type='hidden' />").attr({
                name: t,
                value: i
            }).appendTo(s)
        })), e("<input type='hidden' value='IFrame' name='X-Requested-With' />").appendTo(s), d = t.dataTypes[0] && t.accepts[t.dataTypes[0]] ? t.accepts[t.dataTypes[0]] + ("*" !== t.dataTypes[0] ? ", */*; q=0.01" : "") : t.accepts["*"], e("<input type='hidden' name='X-HTTP-Accept'>").attr("value", d).appendTo(s), l.after((function() {
            var t = e(this),
                i = t.clone().prop("disabled", !0);
            return t.data("clone", i), i
        })).next(), l.appendTo(s), {
            send: function(t, i) {
                (r = e("<iframe src='about:blank' name='" + a + "' id='" + a + "' style='display:none'></iframe>")).one("load", (function() {
                    r.one("load", (function() {
                        var e = this.contentWindow ? this.contentWindow.document : this.contentDocument ? this.contentDocument : this.document,
                            t = e.documentElement ? e.documentElement : e.body,
                            s = t.getElementsByTagName("textarea")[0],
                            r = s && s.getAttribute("data-type") || null,
                            a = s && s.getAttribute("data-status") || 200,
                            l = s && s.getAttribute("data-statusText") || "OK",
                            d = {
                                text: r ? s.value : t ? t.textContent || t.innerText : null
                            };
                        o(), n.responseText || (n.responseText = d.text), i(a, l, d, r ? "Content-Type: " + r : null)
                    })), s[0].submit()
                })), e("body").append(s, r)
            },
            abort: function() {
                null !== r && (r.unbind("load").attr("src", "about:blank"), o())
            }
        }
    }))
}(jQuery),
function(e) {
    var t;
    e.remotipart = t = {
        setup: function(i) {
            var n = i.data("ujs:submit-button"),
                o = e('meta[name="csrf-param"]').attr("content"),
                s = e('meta[name="csrf-token"]').attr("content"),
                r = i.find('input[name="' + o + '"]').length;
            i.one("ajax:beforeSend.remotipart", (function(a, l, d) {
                return delete d.beforeSend, d.iframe = !0, d.files = e(e.rails.fileInputSelector, i), d.data = i.serializeArray(), n && d.data.push(n), d.files.each((function(e, t) {
                    for (var i = d.data.length - 1; i >= 0; i--) d.data[i].name == t.name && d.data.splice(i, 1)
                })), d.processData = !1, void 0 === d.dataType && (d.dataType = "script *"), d.data.push({
                    name: "remotipart_submitted",
                    value: !0
                }), s && o && !r && d.data.push({
                    name: o,
                    value: s
                }), e.rails.fire(i, "ajax:remotipartSubmit", [l, d]) && (e.rails.ajax(d).always((function(t) {
                    e.rails.fire(i, "ajax:remotipartComplete", [t])
                })), setTimeout((function() {
                    e.rails.disableFormElements(i)
                }), 20)), t.teardown(i), !1
            })).data("remotipartSubmitted", !0)
        },
        teardown: function(e) {
            e.unbind("ajax:beforeSend.remotipart").removeData("remotipartSubmitted")
        }
    }, e(document).on("ajax:aborted:file", "form", (function() {
        var i = e(this);
        return t.setup(i), e.rails.handleRemote(i), !1
    }))
}(jQuery);
var prepend = "clearInput",
    check_input = function() {
        var e = $(this),
            t = e[0][prepend + "-$clear"];
        "" === e.val() ? (e.removeClass(prepend + "-filled"), t.removeClass(prepend + "-clear-filled"), t.attr("tabindex", "-1")) : (e.addClass(prepend + "-filled"), t.addClass(prepend + "-clear-filled"), t.removeAttr("tabindex"))
    };
if ($.fn.clearInput = function() {
        return this.each((function() {
            var e, t = this.tagName,
                i = $(this),
                n = i.parent(),
                o = !1,
                s = (e = "INPUT" !== t ? n.find("input[type='text']") : i).data("clear-label");
            if (e.length) {
                var r = n.find("." + prepend + "-clear");
                r.length || (r = $("<button/>").addClass(prepend + "-clear").attr("aria-label", s || "Clear").attr("type", "button").attr("tabindex", "-1").html('<svg class="icon"><use xlink:href="#close"></use></svg>'), o = !0), e.addClass(prepend + "-input"), e[0][prepend + "-$clear"] = r, r[0][prepend + "-$input"] = e, o && r.insertAfter(e), check_input.call(this)
            }
        }))
    }, document.addEventListener("DOMContentLoaded", (function() {
        "use strict";
        $("body").on("mousedown click", "." + prepend + "-clear", (function(e) {
            var t = $(this)[0][prepend + "-$input"];
            1 === e.which && t.val("").trigger("keyup").trigger("change").focus()
        })).on("keydown change input", "." + prepend + "-input", check_input)
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
    }((function(e) {
        return e.ui = e.ui || {}, e.ui.version = "1.12.1"
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery)
    }((function(e) {
        return e.ui.keyCode = {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery)
    }((function(e) {
        return function() {
            function t(e, t, i) {
                return [parseFloat(e[0]) * (u.test(e[0]) ? t / 100 : 1), parseFloat(e[1]) * (u.test(e[1]) ? i / 100 : 1)]
            }

            function i(t, i) {
                return parseInt(e.css(t, i), 10) || 0
            }

            function n(t) {
                var i = t[0];
                return 9 === i.nodeType ? {
                    width: t.width(),
                    height: t.height(),
                    offset: {
                        top: 0,
                        left: 0
                    }
                } : e.isWindow(i) ? {
                    width: t.width(),
                    height: t.height(),
                    offset: {
                        top: t.scrollTop(),
                        left: t.scrollLeft()
                    }
                } : i.preventDefault ? {
                    width: 0,
                    height: 0,
                    offset: {
                        top: i.pageY,
                        left: i.pageX
                    }
                } : {
                    width: t.outerWidth(),
                    height: t.outerHeight(),
                    offset: t.offset()
                }
            }
            var o, s = Math.max,
                r = Math.abs,
                a = /left|center|right/,
                l = /top|center|bottom/,
                d = /[\+\-]\d+(\.[\d]+)?%?/,
                c = /^\w+/,
                u = /%$/,
                p = e.fn.position;
            e.position = {
                scrollbarWidth: function() {
                    if (void 0 !== o) return o;
                    var t, i, n = e("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                        s = n.children()[0];
                    return e("body").append(n), t = s.offsetWidth, n.css("overflow", "scroll"), t === (i = s.offsetWidth) && (i = n[0].clientWidth), n.remove(), o = t - i
                },
                getScrollInfo: function(t) {
                    var i = t.isWindow || t.isDocument ? "" : t.element.css("overflow-x"),
                        n = t.isWindow || t.isDocument ? "" : t.element.css("overflow-y"),
                        o = "scroll" === i || "auto" === i && t.width < t.element[0].scrollWidth;
                    return {
                        width: "scroll" === n || "auto" === n && t.height < t.element[0].scrollHeight ? e.position.scrollbarWidth() : 0,
                        height: o ? e.position.scrollbarWidth() : 0
                    }
                },
                getWithinInfo: function(t) {
                    var i = e(t || window),
                        n = e.isWindow(i[0]),
                        o = !!i[0] && 9 === i[0].nodeType;
                    return {
                        element: i,
                        isWindow: n,
                        isDocument: o,
                        offset: !n && !o ? e(t).offset() : {
                            left: 0,
                            top: 0
                        },
                        scrollLeft: i.scrollLeft(),
                        scrollTop: i.scrollTop(),
                        width: i.outerWidth(),
                        height: i.outerHeight()
                    }
                }
            }, e.fn.position = function(o) {
                if (!o || !o.of) return p.apply(this, arguments);
                o = e.extend({}, o);
                var u, h, f, m, v, g, y = e(o.of),
                    b = e.position.getWithinInfo(o.within),
                    w = e.position.getScrollInfo(b),
                    x = (o.collision || "flip").split(" "),
                    C = {};
                return g = n(y), y[0].preventDefault && (o.at = "left top"), h = g.width, f = g.height, m = g.offset, v = e.extend({}, m), e.each(["my", "at"], (function() {
                    var e, t, i = (o[this] || "").split(" ");
                    1 === i.length && (i = a.test(i[0]) ? i.concat(["center"]) : l.test(i[0]) ? ["center"].concat(i) : ["center", "center"]), i[0] = a.test(i[0]) ? i[0] : "center", i[1] = l.test(i[1]) ? i[1] : "center", e = d.exec(i[0]), t = d.exec(i[1]), C[this] = [e ? e[0] : 0, t ? t[0] : 0], o[this] = [c.exec(i[0])[0], c.exec(i[1])[0]]
                })), 1 === x.length && (x[1] = x[0]), "right" === o.at[0] ? v.left += h : "center" === o.at[0] && (v.left += h / 2), "bottom" === o.at[1] ? v.top += f : "center" === o.at[1] && (v.top += f / 2), u = t(C.at, h, f), v.left += u[0], v.top += u[1], this.each((function() {
                    var n, a, l = e(this),
                        d = l.outerWidth(),
                        c = l.outerHeight(),
                        p = i(this, "marginLeft"),
                        g = i(this, "marginTop"),
                        k = d + p + i(this, "marginRight") + w.width,
                        T = c + g + i(this, "marginBottom") + w.height,
                        $ = e.extend({}, v),
                        S = t(C.my, l.outerWidth(), l.outerHeight());
                    "right" === o.my[0] ? $.left -= d : "center" === o.my[0] && ($.left -= d / 2), "bottom" === o.my[1] ? $.top -= c : "center" === o.my[1] && ($.top -= c / 2), $.left += S[0], $.top += S[1], n = {
                        marginLeft: p,
                        marginTop: g
                    }, e.each(["left", "top"], (function(t, i) {
                        e.ui.position[x[t]] && e.ui.position[x[t]][i]($, {
                            targetWidth: h,
                            targetHeight: f,
                            elemWidth: d,
                            elemHeight: c,
                            collisionPosition: n,
                            collisionWidth: k,
                            collisionHeight: T,
                            offset: [u[0] + S[0], u[1] + S[1]],
                            my: o.my,
                            at: o.at,
                            within: b,
                            elem: l
                        })
                    })), o.using && (a = function(e) {
                        var t = m.left - $.left,
                            i = t + h - d,
                            n = m.top - $.top,
                            a = n + f - c,
                            u = {
                                target: {
                                    element: y,
                                    left: m.left,
                                    top: m.top,
                                    width: h,
                                    height: f
                                },
                                element: {
                                    element: l,
                                    left: $.left,
                                    top: $.top,
                                    width: d,
                                    height: c
                                },
                                horizontal: i < 0 ? "left" : t > 0 ? "right" : "center",
                                vertical: a < 0 ? "top" : n > 0 ? "bottom" : "middle"
                            };
                        h < d && r(t + i) < h && (u.horizontal = "center"), f < c && r(n + a) < f && (u.vertical = "middle"), s(r(t), r(i)) > s(r(n), r(a)) ? u.important = "horizontal" : u.important = "vertical", o.using.call(this, e, u)
                    }), l.offset(e.extend($, {
                        using: a
                    }))
                }))
            }, e.ui.position = {
                fit: {
                    left: function(e, t) {
                        var i, n = t.within,
                            o = n.isWindow ? n.scrollLeft : n.offset.left,
                            r = n.width,
                            a = e.left - t.collisionPosition.marginLeft,
                            l = o - a,
                            d = a + t.collisionWidth - r - o;
                        t.collisionWidth > r ? l > 0 && d <= 0 ? (i = e.left + l + t.collisionWidth - r - o, e.left += l - i) : e.left = d > 0 && l <= 0 ? o : l > d ? o + r - t.collisionWidth : o : l > 0 ? e.left += l : d > 0 ? e.left -= d : e.left = s(e.left - a, e.left)
                    },
                    top: function(e, t) {
                        var i, n = t.within,
                            o = n.isWindow ? n.scrollTop : n.offset.top,
                            r = t.within.height,
                            a = e.top - t.collisionPosition.marginTop,
                            l = o - a,
                            d = a + t.collisionHeight - r - o;
                        t.collisionHeight > r ? l > 0 && d <= 0 ? (i = e.top + l + t.collisionHeight - r - o, e.top += l - i) : e.top = d > 0 && l <= 0 ? o : l > d ? o + r - t.collisionHeight : o : l > 0 ? e.top += l : d > 0 ? e.top -= d : e.top = s(e.top - a, e.top)
                    }
                },
                flip: {
                    left: function(e, t) {
                        var i, n, o = t.within,
                            s = o.offset.left + o.scrollLeft,
                            a = o.width,
                            l = o.isWindow ? o.scrollLeft : o.offset.left,
                            d = e.left - t.collisionPosition.marginLeft,
                            c = d - l,
                            u = d + t.collisionWidth - a - l,
                            p = "left" === t.my[0] ? -t.elemWidth : "right" === t.my[0] ? t.elemWidth : 0,
                            h = "left" === t.at[0] ? t.targetWidth : "right" === t.at[0] ? -t.targetWidth : 0,
                            f = -2 * t.offset[0];
                        c < 0 ? ((i = e.left + p + h + f + t.collisionWidth - a - s) < 0 || i < r(c)) && (e.left += p + h + f) : u > 0 && ((n = e.left - t.collisionPosition.marginLeft + p + h + f - l) > 0 || r(n) < u) && (e.left += p + h + f)
                    },
                    top: function(e, t) {
                        var i, n, o = t.within,
                            s = o.offset.top + o.scrollTop,
                            a = o.height,
                            l = o.isWindow ? o.scrollTop : o.offset.top,
                            d = e.top - t.collisionPosition.marginTop,
                            c = d - l,
                            u = d + t.collisionHeight - a - l,
                            p = "top" === t.my[1] ? -t.elemHeight : "bottom" === t.my[1] ? t.elemHeight : 0,
                            h = "top" === t.at[1] ? t.targetHeight : "bottom" === t.at[1] ? -t.targetHeight : 0,
                            f = -2 * t.offset[1];
                        c < 0 ? ((n = e.top + p + h + f + t.collisionHeight - a - s) < 0 || n < r(c)) && (e.top += p + h + f) : u > 0 && ((i = e.top - t.collisionPosition.marginTop + p + h + f - l) > 0 || r(i) < u) && (e.top += p + h + f)
                    }
                },
                flipfit: {
                    left: function() {
                        e.ui.position.flip.left.apply(this, arguments), e.ui.position.fit.left.apply(this, arguments)
                    },
                    top: function() {
                        e.ui.position.flip.top.apply(this, arguments), e.ui.position.fit.top.apply(this, arguments)
                    }
                }
            }
        }(), e.ui.position
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery)
    }((function(e) {
        return e.ui.safeActiveElement = function(e) {
            var t;
            try {
                t = e.activeElement
            } catch (i) {
                t = e.body
            }
            return t || (t = e.body), t.nodeName || (t = e.body), t
        }
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery)
    }((function(e) {
        return e.fn.extend({
            uniqueId: (t = 0, function() {
                return this.each((function() {
                    this.id || (this.id = "ui-id-" + ++t)
                }))
            }),
            removeUniqueId: function() {
                return this.each((function() {
                    /^ui-id-\d+$/.test(this.id) && e(this).removeAttr("id")
                }))
            }
        });
        var t
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery)
    }((function(e) {
        var t, i = 0,
            n = Array.prototype.slice;
        return e.cleanData = (t = e.cleanData, function(i) {
            var n, o, s;
            for (s = 0; null != (o = i[s]); s++) try {
                (n = e._data(o, "events")) && n.remove && e(o).triggerHandler("remove")
            } catch (e) {}
            t(i)
        }), e.widget = function(t, i, n) {
            var o, s, r, a = {},
                l = t.split(".")[0],
                d = l + "-" + (t = t.split(".")[1]);
            return n || (n = i, i = e.Widget), e.isArray(n) && (n = e.extend.apply(null, [{}].concat(n))), e.expr[":"][d.toLowerCase()] = function(t) {
                return !!e.data(t, d)
            }, e[l] = e[l] || {}, o = e[l][t], s = e[l][t] = function(e, t) {
                if (!this._createWidget) return new s(e, t);
                arguments.length && this._createWidget(e, t)
            }, e.extend(s, o, {
                version: n.version,
                _proto: e.extend({}, n),
                _childConstructors: []
            }), (r = new i).options = e.widget.extend({}, r.options), e.each(n, (function(t, n) {
                e.isFunction(n) ? a[t] = function() {
                    function e() {
                        return i.prototype[t].apply(this, arguments)
                    }

                    function o(e) {
                        return i.prototype[t].apply(this, e)
                    }
                    return function() {
                        var t, i = this._super,
                            s = this._superApply;
                        return this._super = e, this._superApply = o, t = n.apply(this, arguments), this._super = i, this._superApply = s, t
                    }
                }() : a[t] = n
            })), s.prototype = e.widget.extend(r, {
                widgetEventPrefix: o && r.widgetEventPrefix || t
            }, a, {
                constructor: s,
                namespace: l,
                widgetName: t,
                widgetFullName: d
            }), o ? (e.each(o._childConstructors, (function(t, i) {
                var n = i.prototype;
                e.widget(n.namespace + "." + n.widgetName, s, i._proto)
            })), delete o._childConstructors) : i._childConstructors.push(s), e.widget.bridge(t, s), s
        }, e.widget.extend = function(t) {
            for (var i, o, s = n.call(arguments, 1), r = 0, a = s.length; r < a; r++)
                for (i in s[r]) o = s[r][i], s[r].hasOwnProperty(i) && void 0 !== o && (e.isPlainObject(o) ? t[i] = e.isPlainObject(t[i]) ? e.widget.extend({}, t[i], o) : e.widget.extend({}, o) : t[i] = o);
            return t
        }, e.widget.bridge = function(t, i) {
            var o = i.prototype.widgetFullName || t;
            e.fn[t] = function(s) {
                var r = "string" == typeof s,
                    a = n.call(arguments, 1),
                    l = this;
                return r ? this.length || "instance" !== s ? this.each((function() {
                    var i, n = e.data(this, o);
                    return "instance" === s ? (l = n, !1) : n ? e.isFunction(n[s]) && "_" !== s.charAt(0) ? (i = n[s].apply(n, a)) !== n && void 0 !== i ? (l = i && i.jquery ? l.pushStack(i.get()) : i, !1) : void 0 : e.error("no such method '" + s + "' for " + t + " widget instance") : e.error("cannot call methods on " + t + " prior to initialization; attempted to call method '" + s + "'")
                })) : l = void 0 : (a.length && (s = e.widget.extend.apply(null, [s].concat(a))), this.each((function() {
                    var t = e.data(this, o);
                    t ? (t.option(s || {}), t._init && t._init()) : e.data(this, o, new i(s, this))
                }))), l
            }
        }, e.Widget = function() {}, e.Widget._childConstructors = [], e.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                classes: {},
                disabled: !1,
                create: null
            },
            _createWidget: function(t, n) {
                n = e(n || this.defaultElement || this)[0], this.element = e(n), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = e(), this.hoverable = e(), this.focusable = e(), this.classesElementLookup = {}, n !== this && (e.data(n, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function(e) {
                        e.target === n && this.destroy()
                    }
                }), this.document = e(n.style ? n.ownerDocument : n.document || n), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this._create(), this.options.disabled && this._setOptionDisabled(this.options.disabled), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: function() {
                return {}
            },
            _getCreateEventData: e.noop,
            _create: e.noop,
            _init: e.noop,
            destroy: function() {
                var t = this;
                this._destroy(), e.each(this.classesElementLookup, (function(e, i) {
                    t._removeClass(i, e)
                })), this.element.off(this.eventNamespace).removeData(this.widgetFullName), this.widget().off(this.eventNamespace).removeAttr("aria-disabled"), this.bindings.off(this.eventNamespace)
            },
            _destroy: e.noop,
            widget: function() {
                return this.element
            },
            option: function(t, i) {
                var n, o, s, r = t;
                if (0 === arguments.length) return e.widget.extend({}, this.options);
                if ("string" == typeof t)
                    if (r = {}, n = t.split("."), t = n.shift(), n.length) {
                        for (o = r[t] = e.widget.extend({}, this.options[t]), s = 0; s < n.length - 1; s++) o[n[s]] = o[n[s]] || {}, o = o[n[s]];
                        if (t = n.pop(), 1 === arguments.length) return void 0 === o[t] ? null : o[t];
                        o[t] = i
                    } else {
                        if (1 === arguments.length) return void 0 === this.options[t] ? null : this.options[t];
                        r[t] = i
                    }
                return this._setOptions(r), this
            },
            _setOptions: function(e) {
                var t;
                for (t in e) this._setOption(t, e[t]);
                return this
            },
            _setOption: function(e, t) {
                return "classes" === e && this._setOptionClasses(t), this.options[e] = t, "disabled" === e && this._setOptionDisabled(t), this
            },
            _setOptionClasses: function(t) {
                var i, n, o;
                for (i in t) o = this.classesElementLookup[i], t[i] !== this.options.classes[i] && o && o.length && (n = e(o.get()), this._removeClass(o, i), n.addClass(this._classes({
                    element: n,
                    keys: i,
                    classes: t,
                    add: !0
                })))
            },
            _setOptionDisabled: function(e) {
                this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!e), e && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
            },
            enable: function() {
                return this._setOptions({
                    disabled: !1
                })
            },
            disable: function() {
                return this._setOptions({
                    disabled: !0
                })
            },
            _classes: function(t) {
                function i(i, s) {
                    var r, a;
                    for (a = 0; a < i.length; a++) r = o.classesElementLookup[i[a]] || e(), r = t.add ? e(e.unique(r.get().concat(t.element.get()))) : e(r.not(t.element).get()), o.classesElementLookup[i[a]] = r, n.push(i[a]), s && t.classes[i[a]] && n.push(t.classes[i[a]])
                }
                var n = [],
                    o = this;
                return t = e.extend({
                    element: this.element,
                    classes: this.options.classes || {}
                }, t), this._on(t.element, {
                    remove: "_untrackClassesElement"
                }), t.keys && i(t.keys.match(/\S+/g) || [], !0), t.extra && i(t.extra.match(/\S+/g) || []), n.join(" ")
            },
            _untrackClassesElement: function(t) {
                var i = this;
                e.each(i.classesElementLookup, (function(n, o) {
                    -1 !== e.inArray(t.target, o) && (i.classesElementLookup[n] = e(o.not(t.target).get()))
                }))
            },
            _removeClass: function(e, t, i) {
                return this._toggleClass(e, t, i, !1)
            },
            _addClass: function(e, t, i) {
                return this._toggleClass(e, t, i, !0)
            },
            _toggleClass: function(e, t, i, n) {
                n = "boolean" == typeof n ? n : i;
                var o = "string" == typeof e || null === e,
                    s = {
                        extra: o ? t : i,
                        keys: o ? e : t,
                        element: o ? this.element : e,
                        add: n
                    };
                return s.element.toggleClass(this._classes(s), n), this
            },
            _on: function(t, i, n) {
                var o, s = this;
                "boolean" != typeof t && (n = i,
                    i = t, t = !1), n ? (i = o = e(i), this.bindings = this.bindings.add(i)) : (n = i, i = this.element, o = this.widget()), e.each(n, (function(n, r) {
                    function a() {
                        if (t || !0 !== s.options.disabled && !e(this).hasClass("ui-state-disabled")) return ("string" == typeof r ? s[r] : r).apply(s, arguments)
                    }
                    "string" != typeof r && (a.guid = r.guid = r.guid || a.guid || e.guid++);
                    var l = n.match(/^([\w:-]*)\s*(.*)$/),
                        d = l[1] + s.eventNamespace,
                        c = l[2];
                    c ? o.on(d, c, a) : i.on(d, a)
                }))
            },
            _off: function(t, i) {
                i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.off(i).off(i), this.bindings = e(this.bindings.not(t).get()), this.focusable = e(this.focusable.not(t).get()), this.hoverable = e(this.hoverable.not(t).get())
            },
            _delay: function(e, t) {
                function i() {
                    return ("string" == typeof e ? n[e] : e).apply(n, arguments)
                }
                var n = this;
                return setTimeout(i, t || 0)
            },
            _hoverable: function(t) {
                this.hoverable = this.hoverable.add(t), this._on(t, {
                    mouseenter: function(t) {
                        this._addClass(e(t.currentTarget), null, "ui-state-hover")
                    },
                    mouseleave: function(t) {
                        this._removeClass(e(t.currentTarget), null, "ui-state-hover")
                    }
                })
            },
            _focusable: function(t) {
                this.focusable = this.focusable.add(t), this._on(t, {
                    focusin: function(t) {
                        this._addClass(e(t.currentTarget), null, "ui-state-focus")
                    },
                    focusout: function(t) {
                        this._removeClass(e(t.currentTarget), null, "ui-state-focus")
                    }
                })
            },
            _trigger: function(t, i, n) {
                var o, s, r = this.options[t];
                if (n = n || {}, (i = e.Event(i)).type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], s = i.originalEvent)
                    for (o in s) o in i || (i[o] = s[o]);
                return this.element.trigger(i, n), !(e.isFunction(r) && !1 === r.apply(this.element[0], [i].concat(n)) || i.isDefaultPrevented())
            }
        }, e.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, (function(t, i) {
            e.Widget.prototype["_" + t] = function(n, o, s) {
                var r;
                "string" == typeof o && (o = {
                    effect: o
                });
                var a = o ? !0 === o || "number" == typeof o ? i : o.effect || i : t;
                "number" == typeof(o = o || {}) && (o = {
                    duration: o
                }), r = !e.isEmptyObject(o), o.complete = s, o.delay && n.delay(o.delay), r && e.effects && e.effects.effect[a] ? n[t](o) : a !== t && n[a] ? n[a](o.duration, o.easing, s) : n.queue((function(i) {
                    e(this)[t](), s && s.call(n[0]), i()
                }))
            }
        })), e.widget
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "../keycode", "../position", "../safe-active-element", "../unique-id", "../version", "../widget"], e) : e(jQuery)
    }((function(e) {
        return e.widget("ui.menu", {
            version: "1.12.1",
            defaultElement: "<ul>",
            delay: 300,
            options: {
                icons: {
                    submenu: "ui-icon-caret-1-e"
                },
                items: "> *",
                menus: "ul",
                position: {
                    my: "left top",
                    at: "right top"
                },
                role: "menu",
                blur: null,
                focus: null,
                select: null
            },
            _create: function() {
                this.activeMenu = this.element, this.mouseHandled = !1, this.element.uniqueId().attr({
                    role: this.options.role,
                    tabIndex: 0
                }), this._addClass("ui-menu", "ui-widget ui-widget-content"), this._on({
                    "mousedown .ui-menu-item": function(e) {
                        e.preventDefault()
                    },
                    "click .ui-menu-item": function(t) {
                        var i = e(t.target),
                            n = e(e.ui.safeActiveElement(this.document[0]));
                        !this.mouseHandled && i.not(".ui-state-disabled").length && (this.select(t), t.isPropagationStopped() || (this.mouseHandled = !0), i.has(".ui-menu").length ? this.expand(t) : !this.element.is(":focus") && n.closest(".ui-menu").length && (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)))
                    },
                    "mouseenter .ui-menu-item": function(t) {
                        if (!this.previousFilter) {
                            var i = e(t.target).closest(".ui-menu-item"),
                                n = e(t.currentTarget);
                            i[0] === n[0] && (this._removeClass(n.siblings().children(".ui-state-active"), null, "ui-state-active"), this.focus(t, n))
                        }
                    },
                    mouseleave: "collapseAll",
                    "mouseleave .ui-menu": "collapseAll",
                    focus: function(e, t) {
                        var i = this.active || this.element.find(this.options.items).eq(0);
                        t || this.focus(e, i)
                    },
                    blur: function(t) {
                        this._delay((function() {
                            !e.contains(this.element[0], e.ui.safeActiveElement(this.document[0])) && this.collapseAll(t)
                        }))
                    },
                    keydown: "_keydown"
                }), this.refresh(), this._on(this.document, {
                    click: function(e) {
                        this._closeOnDocumentClick(e) && this.collapseAll(e), this.mouseHandled = !1
                    }
                })
            },
            _destroy: function() {
                var t = this.element.find(".ui-menu-item").removeAttr("role aria-disabled").children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");
                this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show(), t.children().each((function() {
                    var t = e(this);
                    t.data("ui-menu-submenu-caret") && t.remove()
                }))
            },
            _keydown: function(t) {
                var i, n, o, s, r = !0;
                switch (t.keyCode) {
                    case e.ui.keyCode.PAGE_UP:
                        this.previousPage(t);
                        break;
                    case e.ui.keyCode.PAGE_DOWN:
                        this.nextPage(t);
                        break;
                    case e.ui.keyCode.HOME:
                        this._move("first", "first", t);
                        break;
                    case e.ui.keyCode.END:
                        this._move("last", "last", t);
                        break;
                    case e.ui.keyCode.UP:
                        this.previous(t);
                        break;
                    case e.ui.keyCode.DOWN:
                        this.next(t);
                        break;
                    case e.ui.keyCode.LEFT:
                        this.collapse(t);
                        break;
                    case e.ui.keyCode.RIGHT:
                        this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
                        break;
                    case e.ui.keyCode.ENTER:
                    case e.ui.keyCode.SPACE:
                        this._activate(t);
                        break;
                    case e.ui.keyCode.ESCAPE:
                        this.collapse(t);
                        break;
                    default:
                        r = !1, n = this.previousFilter || "", s = !1, o = t.keyCode >= 96 && t.keyCode <= 105 ? (t.keyCode - 96).toString() : String.fromCharCode(t.keyCode), clearTimeout(this.filterTimer), o === n ? s = !0 : o = n + o, i = this._filterMenuItems(o), (i = s && -1 !== i.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : i).length || (o = String.fromCharCode(t.keyCode), i = this._filterMenuItems(o)), i.length ? (this.focus(t, i), this.previousFilter = o, this.filterTimer = this._delay((function() {
                            delete this.previousFilter
                        }), 1e3)) : delete this.previousFilter
                }
                r && t.preventDefault()
            },
            _activate: function(e) {
                this.active && !this.active.is(".ui-state-disabled") && (this.active.children("[aria-haspopup='true']").length ? this.expand(e) : this.select(e))
            },
            refresh: function() {
                var t, i, n, o, s = this,
                    r = this.options.icons.submenu,
                    a = this.element.find(this.options.menus);
                this._toggleClass("ui-menu-icons", null, !!this.element.find(".ui-icon").length), i = a.filter(":not(.ui-menu)").hide().attr({
                    role: this.options.role,
                    "aria-hidden": "true",
                    "aria-expanded": "false"
                }).each((function() {
                    var t = e(this),
                        i = t.prev(),
                        n = e("<span>").data("ui-menu-submenu-caret", !0);
                    s._addClass(n, "ui-menu-icon", "ui-icon " + r), i.attr("aria-haspopup", "true").prepend(n), t.attr("aria-labelledby", i.attr("id"))
                })), this._addClass(i, "ui-menu", "ui-widget ui-widget-content ui-front"), (t = a.add(this.element).find(this.options.items)).not(".ui-menu-item").each((function() {
                    var t = e(this);
                    s._isDivider(t) && s._addClass(t, "ui-menu-divider", "ui-widget-content")
                })), o = (n = t.not(".ui-menu-item, .ui-menu-divider")).children().not(".ui-menu").uniqueId().attr({
                    tabIndex: -1,
                    role: this._itemRole()
                }), this._addClass(n, "ui-menu-item")._addClass(o, "ui-menu-item-wrapper"), t.filter(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !e.contains(this.element[0], this.active[0]) && this.blur()
            },
            _itemRole: function() {
                return {
                    menu: "menuitem",
                    listbox: "option"
                }[this.options.role]
            },
            _setOption: function(e, t) {
                if ("icons" === e) {
                    var i = this.element.find(".ui-menu-icon");
                    this._removeClass(i, null, this.options.icons.submenu)._addClass(i, null, t.submenu)
                }
                this._super(e, t)
            },
            _setOptionDisabled: function(e) {
                this._super(e), this.element.attr("aria-disabled", String(e)), this._toggleClass(null, "ui-state-disabled", !!e)
            },
            focus: function(e, t) {
                var i, n, o;
                this.blur(e, e && "focus" === e.type), this._scrollIntoView(t), this.active = t.first(), n = this.active.children(".ui-menu-item-wrapper"), this._addClass(n, null, "ui-state-active"), this.options.role && this.element.attr("aria-activedescendant", n.attr("id")), o = this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper"), this._addClass(o, null, "ui-state-active"), e && "keydown" === e.type ? this._close() : this.timer = this._delay((function() {
                    this._close()
                }), this.delay), (i = t.children(".ui-menu")).length && e && /^mouse/.test(e.type) && this._startOpening(i), this.activeMenu = t.parent(), this._trigger("focus", e, {
                    item: t
                })
            },
            _scrollIntoView: function(t) {
                var i, n, o, s, r, a;
                this._hasScroll() && (i = parseFloat(e.css(this.activeMenu[0], "borderTopWidth")) || 0, n = parseFloat(e.css(this.activeMenu[0], "paddingTop")) || 0, o = t.offset().top - this.activeMenu.offset().top - i - n, s = this.activeMenu.scrollTop(), r = this.activeMenu.height(), a = t.outerHeight(), o < 0 ? this.activeMenu.scrollTop(s + o) : o + a > r && this.activeMenu.scrollTop(s + o - r + a))
            },
            blur: function(e, t) {
                t || clearTimeout(this.timer), this.active && (this._removeClass(this.active.children(".ui-menu-item-wrapper"), null, "ui-state-active"), this._trigger("blur", e, {
                    item: this.active
                }), this.active = null)
            },
            _startOpening: function(e) {
                clearTimeout(this.timer), "true" === e.attr("aria-hidden") && (this.timer = this._delay((function() {
                    this._close(), this._open(e)
                }), this.delay))
            },
            _open: function(t) {
                var i = e.extend({ of: this.active
                }, this.options.position);
                clearTimeout(this.timer), this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true"), t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i)
            },
            collapseAll: function(t, i) {
                clearTimeout(this.timer), this.timer = this._delay((function() {
                    var n = i ? this.element : e(t && t.target).closest(this.element.find(".ui-menu"));
                    n.length || (n = this.element), this._close(n), this.blur(t), this._removeClass(n.find(".ui-state-active"), null, "ui-state-active"), this.activeMenu = n
                }), this.delay)
            },
            _close: function(e) {
                e || (e = this.active ? this.active.parent() : this.element), e.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false")
            },
            _closeOnDocumentClick: function(t) {
                return !e(t.target).closest(".ui-menu").length
            },
            _isDivider: function(e) {
                return !/[^\-\u2014\u2013\s]/.test(e.text())
            },
            collapse: function(e) {
                var t = this.active && this.active.parent().closest(".ui-menu-item", this.element);
                t && t.length && (this._close(), this.focus(e, t))
            },
            expand: function(e) {
                var t = this.active && this.active.children(".ui-menu ").find(this.options.items).first();
                t && t.length && (this._open(t.parent()), this._delay((function() {
                    this.focus(e, t)
                })))
            },
            next: function(e) {
                this._move("next", "first", e)
            },
            previous: function(e) {
                this._move("prev", "last", e)
            },
            isFirstItem: function() {
                return this.active && !this.active.prevAll(".ui-menu-item").length
            },
            isLastItem: function() {
                return this.active && !this.active.nextAll(".ui-menu-item").length
            },
            _move: function(e, t, i) {
                var n;
                this.active && (n = "first" === e || "last" === e ? this.active["first" === e ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[e + "All"](".ui-menu-item").eq(0)), n && n.length && this.active || (n = this.activeMenu.find(this.options.items)[t]()), this.focus(i, n)
            },
            nextPage: function(t) {
                var i, n, o;
                this.active ? this.isLastItem() || (this._hasScroll() ? (n = this.active.offset().top, o = this.element.height(), this.active.nextAll(".ui-menu-item").each((function() {
                    return (i = e(this)).offset().top - n - o < 0
                })), this.focus(t, i)) : this.focus(t, this.activeMenu.find(this.options.items)[this.active ? "last" : "first"]())) : this.next(t)
            },
            previousPage: function(t) {
                var i, n, o;
                this.active ? this.isFirstItem() || (this._hasScroll() ? (n = this.active.offset().top, o = this.element.height(), this.active.prevAll(".ui-menu-item").each((function() {
                    return (i = e(this)).offset().top - n + o > 0
                })), this.focus(t, i)) : this.focus(t, this.activeMenu.find(this.options.items).first())) : this.next(t)
            },
            _hasScroll: function() {
                return this.element.outerHeight() < this.element.prop("scrollHeight")
            },
            select: function(t) {
                this.active = this.active || e(t.target).closest(".ui-menu-item");
                var i = {
                    item: this.active
                };
                this.active.has(".ui-menu").length || this.collapseAll(t, !0), this._trigger("select", t, i)
            },
            _filterMenuItems: function(t) {
                var i = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"),
                    n = new RegExp("^" + i, "i");
                return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter((function() {
                    return n.test(e.trim(e(this).children(".ui-menu-item-wrapper").text()))
                }))
            }
        })
    })), function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "./menu", "../keycode", "../position", "../safe-active-element", "../version", "../widget"], e) : e(jQuery)
    }((function(e) {
        return e.widget("ui.autocomplete", {
            version: "1.12.1",
            defaultElement: "<input>",
            options: {
                appendTo: null,
                autoFocus: !1,
                delay: 300,
                minLength: 1,
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "none"
                },
                source: null,
                change: null,
                close: null,
                focus: null,
                open: null,
                response: null,
                search: null,
                select: null
            },
            requestIndex: 0,
            pending: 0,
            _create: function() {
                var t, i, n, o = this.element[0].nodeName.toLowerCase(),
                    s = "textarea" === o,
                    r = "input" === o;
                this.isMultiLine = s || !r && this._isContentEditable(this.element), this.valueMethod = this.element[s || r ? "val" : "text"], this.isNewMenu = !0, this._addClass("ui-autocomplete-input"), this.element.attr("autocomplete", "off"), this._on(this.element, {
                    keydown: function(o) {
                        if (this.element.prop("readOnly")) return t = !0, n = !0, void(i = !0);
                        t = !1, n = !1, i = !1;
                        var s = e.ui.keyCode;
                        switch (o.keyCode) {
                            case s.PAGE_UP:
                                t = !0, this._move("previousPage", o);
                                break;
                            case s.PAGE_DOWN:
                                t = !0, this._move("nextPage", o);
                                break;
                            case s.UP:
                                t = !0, this._keyEvent("previous", o);
                                break;
                            case s.DOWN:
                                t = !0, this._keyEvent("next", o);
                                break;
                            case s.ENTER:
                                this.menu.active && (t = !0, o.preventDefault(), this.menu.select(o));
                                break;
                            case s.TAB:
                                this.menu.active && this.menu.select(o);
                                break;
                            case s.ESCAPE:
                                this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term), this.close(o), o.preventDefault());
                                break;
                            default:
                                i = !0, this._searchTimeout(o)
                        }
                    },
                    keypress: function(n) {
                        if (t) return t = !1, void(this.isMultiLine && !this.menu.element.is(":visible") || n.preventDefault());
                        if (!i) {
                            var o = e.ui.keyCode;
                            switch (n.keyCode) {
                                case o.PAGE_UP:
                                    this._move("previousPage", n);
                                    break;
                                case o.PAGE_DOWN:
                                    this._move("nextPage", n);
                                    break;
                                case o.UP:
                                    this._keyEvent("previous", n);
                                    break;
                                case o.DOWN:
                                    this._keyEvent("next", n)
                            }
                        }
                    },
                    input: function(e) {
                        if (n) return n = !1, void e.preventDefault();
                        this._searchTimeout(e)
                    },
                    focus: function() {
                        this.selectedItem = null, this.previous = this._value()
                    },
                    blur: function(e) {
                        this.cancelBlur ? delete this.cancelBlur : (clearTimeout(this.searching), this.close(e), this._change(e))
                    }
                }), this._initSource(), this.menu = e("<ul>").appendTo(this._appendTo()).menu({
                    role: null
                }).hide().menu("instance"), this._addClass(this.menu.element, "ui-autocomplete", "ui-front"), this._on(this.menu.element, {
                    mousedown: function(t) {
                        t.preventDefault(), this.cancelBlur = !0, this._delay((function() {
                            delete this.cancelBlur, this.element[0] !== e.ui.safeActiveElement(this.document[0]) && this.element.trigger("focus")
                        }))
                    },
                    menufocus: function(t, i) {
                        var n, o;
                        if (this.isNewMenu && (this.isNewMenu = !1, t.originalEvent && /^mouse/.test(t.originalEvent.type))) return this.menu.blur(), void this.document.one("mousemove", (function() {
                            e(t.target).trigger(t.originalEvent)
                        }));
                        o = i.item.data("ui-autocomplete-item"), !1 !== this._trigger("focus", t, {
                            item: o
                        }) && t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(o.value), (n = i.item.attr("aria-label") || o.value) && e.trim(n).length && (this.liveRegion.children().hide(), e("<div>").text(n).appendTo(this.liveRegion))
                    },
                    menuselect: function(t, i) {
                        var n = i.item.data("ui-autocomplete-item"),
                            o = this.previous;
                        this.element[0] !== e.ui.safeActiveElement(this.document[0]) && (this.element.trigger("focus"), this.previous = o, this._delay((function() {
                            this.previous = o, this.selectedItem = n
                        }))), !1 !== this._trigger("select", t, {
                            item: n
                        }) && this._value(n.value), this.term = this._value(), this.close(t), this.selectedItem = n
                    }
                }), this.liveRegion = e("<div>", {
                    role: "status",
                    "aria-live": "assertive",
                    "aria-relevant": "additions"
                }).appendTo(this.document[0].body), this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible"), this._on(this.window, {
                    beforeunload: function() {
                        this.element.removeAttr("autocomplete")
                    }
                })
            },
            _destroy: function() {
                clearTimeout(this.searching), this.element.removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove()
            },
            _setOption: function(e, t) {
                this._super(e, t), "source" === e && this._initSource(), "appendTo" === e && this.menu.element.appendTo(this._appendTo()), "disabled" === e && t && this.xhr && this.xhr.abort()
            },
            _isEventTargetInWidget: function(t) {
                var i = this.menu.element[0];
                return t.target === this.element[0] || t.target === i || e.contains(i, t.target)
            },
            _closeOnClickOutside: function(e) {
                this._isEventTargetInWidget(e) || this.close()
            },
            _appendTo: function() {
                var t = this.options.appendTo;
                return t && (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)), t && t[0] || (t = this.element.closest(".ui-front, dialog")), t.length || (t = this.document[0].body), t
            },
            _initSource: function() {
                var t, i, n = this;
                e.isArray(this.options.source) ? (t = this.options.source, this.source = function(i, n) {
                    n(e.ui.autocomplete.filter(t, i.term))
                }) : "string" == typeof this.options.source ? (i = this.options.source, this.source = function(t, o) {
                    n.xhr && n.xhr.abort(), n.xhr = e.ajax({
                        url: i,
                        data: t,
                        dataType: "json",
                        success: function(e) {
                            o(e)
                        },
                        error: function() {
                            o([])
                        }
                    })
                }) : this.source = this.options.source
            },
            _searchTimeout: function(e) {
                clearTimeout(this.searching), this.searching = this._delay((function() {
                    var t = this.term === this._value(),
                        i = this.menu.element.is(":visible"),
                        n = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
                    t && (!t || i || n) || (this.selectedItem = null, this.search(null, e))
                }), this.options.delay)
            },
            search: function(e, t) {
                return e = null != e ? e : this._value(), this.term = this._value(), e.length < this.options.minLength ? this.close(t) : !1 !== this._trigger("search", t) ? this._search(e) : void 0
            },
            _search: function(e) {
                this.pending++, this._addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({
                    term: e
                }, this._response())
            },
            _response: function() {
                var t = ++this.requestIndex;
                return e.proxy((function(e) {
                    t === this.requestIndex && this.__response(e), this.pending--, this.pending || this._removeClass("ui-autocomplete-loading")
                }), this)
            },
            __response: function(e) {
                e && (e = this._normalize(e)), this._trigger("response", null, {
                    content: e
                }), !this.options.disabled && e && e.length && !this.cancelSearch ? (this._suggest(e), this._trigger("open")) : this._close()
            },
            close: function(e) {
                this.cancelSearch = !0, this._close(e)
            },
            _close: function(e) {
                this._off(this.document, "mousedown"), this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", e))
            },
            _change: function(e) {
                this.previous !== this._value() && this._trigger("change", e, {
                    item: this.selectedItem
                })
            },
            _normalize: function(t) {
                return t.length && t[0].label && t[0].value ? t : e.map(t, (function(t) {
                    return "string" == typeof t ? {
                        label: t,
                        value: t
                    } : e.extend({}, t, {
                        label: t.label || t.value,
                        value: t.value || t.label
                    })
                }))
            },
            _suggest: function(t) {
                var i = this.menu.element.empty();
                this._renderMenu(i, t), this.isNewMenu = !0, this.menu.refresh(), i.show(), this._resizeMenu(), i.position(e.extend({ of: this.element
                }, this.options.position)), this.options.autoFocus && this.menu.next(), this._on(this.document, {
                    mousedown: "_closeOnClickOutside"
                })
            },
            _resizeMenu: function() {
                var e = this.menu.element;
                e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()))
            },
            _renderMenu: function(t, i) {
                var n = this;
                e.each(i, (function(e, i) {
                    n._renderItemData(t, i)
                }))
            },
            _renderItemData: function(e, t) {
                return this._renderItem(e, t).data("ui-autocomplete-item", t)
            },
            _renderItem: function(t, i) {
                return e("<li>").append(e("<div>").text(i.label)).appendTo(t)
            },
            _move: function(e, t) {
                if (this.menu.element.is(":visible")) return this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e) ? (this.isMultiLine || this._value(this.term), void this.menu.blur()) : void this.menu[e](t);
                this.search(null, t)
            },
            widget: function() {
                return this.menu.element
            },
            _value: function() {
                return this.valueMethod.apply(this.element, arguments)
            },
            _keyEvent: function(e, t) {
                this.isMultiLine && !this.menu.element.is(":visible") || (this._move(e, t), t.preventDefault())
            },
            _isContentEditable: function(e) {
                if (!e.length) return !1;
                var t = e.prop("contentEditable");
                return "inherit" === t ? this._isContentEditable(e.parent()) : "true" === t
            }
        }), e.extend(e.ui.autocomplete, {
            escapeRegex: function(e) {
                return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            },
            filter: function(t, i) {
                var n = new RegExp(e.ui.autocomplete.escapeRegex(i), "i");
                return e.grep(t, (function(e) {
                    return n.test(e.label || e.value || e)
                }))
            }
        }), e.widget("ui.autocomplete", e.ui.autocomplete, {
            options: {
                messages: {
                    noResults: "No search results.",
                    results: function(e) {
                        return e + (e > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                    }
                }
            },
            __response: function(t) {
                var i;
                this._superApply(arguments), this.options.disabled || this.cancelSearch || (i = t && t.length ? this.options.messages.results(t.length) : this.options.messages.noResults, this.liveRegion.children().hide(), e("<div>").text(i).appendTo(this.liveRegion))
            }
        }), e.ui.autocomplete
    })), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");
! function() {
    "use strict";
    var e = jQuery.fn.jquery.split(" ")[0].split(".");
    if (e[0] < 2 && e[1] < 9 || 1 == e[0] && 9 == e[1] && e[2] < 1 || e[0] > 3) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")
}(),
function(e) {
    "use strict";

    function t() {
        var e = document.createElement("bootstrap"),
            t = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var i in t)
            if (void 0 !== e.style[i]) return {
                end: t[i]
            };
        return !1
    }
    e.fn.emulateTransitionEnd = function(t) {
        var i = !1,
            n = this;
        return e(this).one("bsTransitionEnd", (function() {
            i = !0
        })), setTimeout((function() {
            i || e(n).trigger(e.support.transition.end)
        }), t), this
    }, e((function() {
        e.support.transition = t(), e.support.transition && (e.event.special.bsTransitionEnd = {
            bindType: e.support.transition.end,
            delegateType: e.support.transition.end,
            handle: function(t) {
                if (e(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
            }
        })
    }))
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        return this.each((function() {
            var i = e(this),
                o = i.data("bs.alert");
            o || i.data("bs.alert", o = new n(this)), "string" == typeof t && o[t].call(i)
        }))
    }
    var i = '[data-dismiss="alert"]',
        n = function(t) {
            e(t).on("click", i, this.close)
        };
    n.VERSION = "3.4.1", n.TRANSITION_DURATION = 150, n.prototype.close = function(t) {
        function i() {
            r.detach().trigger("closed.bs.alert").remove()
        }
        var o = e(this),
            s = o.attr("data-target");
        s || (s = (s = o.attr("href")) && s.replace(/.*(?=#[^\s]*$)/, "")), s = "#" === s ? [] : s;
        var r = e(document).find(s);
        t && t.preventDefault(), r.length || (r = o.closest(".alert")), r.trigger(t = e.Event("close.bs.alert")), t.isDefaultPrevented() || (r.removeClass("in"), e.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", i).emulateTransitionEnd(n.TRANSITION_DURATION) : i())
    };
    var o = e.fn.alert;
    e.fn.alert = t, e.fn.alert.Constructor = n, e.fn.alert.noConflict = function() {
        return e.fn.alert = o, this
    }, e(document).on("click.bs.alert.data-api", i, n.prototype.close)
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        return this.each((function() {
            var n = e(this),
                o = n.data("bs.button"),
                s = "object" == typeof t && t;
            o || n.data("bs.button", o = new i(this, s)), "toggle" == t ? o.toggle() : t && o.setState(t)
        }))
    }
    var i = function(t, n) {
        this.$element = e(t), this.options = e.extend({}, i.DEFAULTS, n), this.isLoading = !1
    };
    i.VERSION = "3.4.1", i.DEFAULTS = {
        loadingText: "loading..."
    }, i.prototype.setState = function(t) {
        var i = "disabled",
            n = this.$element,
            o = n.is("input") ? "val" : "html",
            s = n.data();
        t += "Text", null == s.resetText && n.data("resetText", n[o]()), setTimeout(e.proxy((function() {
            n[o](null == s[t] ? this.options[t] : s[t]), "loadingText" == t ? (this.isLoading = !0, n.addClass(i).attr(i, i).prop(i, !0)) : this.isLoading && (this.isLoading = !1, n.removeClass(i).removeAttr(i).prop(i, !1))
        }), this), 0)
    }, i.prototype.toggle = function() {
        var e = !0,
            t = this.$element.closest('[data-toggle="buttons"]');
        if (t.length) {
            var i = this.$element.find("input");
            "radio" == i.prop("type") ? (i.prop("checked") && (e = !1), t.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == i.prop("type") && (i.prop("checked") !== this.$element.hasClass("active") && (e = !1), this.$element.toggleClass("active")), i.prop("checked", this.$element.hasClass("active")), e && i.trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
    };
    var n = e.fn.button;
    e.fn.button = t, e.fn.button.Constructor = i, e.fn.button.noConflict = function() {
        return e.fn.button = n, this
    }, e(document).on("click.bs.button.data-api", '[data-toggle^="button"]', (function(i) {
        var n = e(i.target).closest(".btn");
        t.call(n, "toggle"), e(i.target).is('input[type="radio"], input[type="checkbox"]') || (i.preventDefault(), n.is("input,button") ? n.trigger("focus") : n.find("input:visible,button:visible").first().trigger("focus"))
    })).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', (function(t) {
        e(t.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(t.type))
    }))
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        return this.each((function() {
            var n = e(this),
                o = n.data("bs.carousel"),
                s = e.extend({}, i.DEFAULTS, n.data(), "object" == typeof t && t),
                r = "string" == typeof t ? t : s.slide;
            o || n.data("bs.carousel", o = new i(this, s)), "number" == typeof t ? o.to(t) : r ? o[r]() : s.interval && o.pause().cycle()
        }))
    }
    var i = function(t, i) {
        this.$element = e(t), this.$indicators = this.$element.find(".carousel-indicators"), this.options = i, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", e.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", e.proxy(this.pause, this)).on("mouseleave.bs.carousel", e.proxy(this.cycle, this))
    };
    i.VERSION = "3.4.1", i.TRANSITION_DURATION = 600, i.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    }, i.prototype.keydown = function(e) {
        if (!/input|textarea/i.test(e.target.tagName)) {
            switch (e.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            e.preventDefault()
        }
    }, i.prototype.cycle = function(t) {
        return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(e.proxy(this.next, this), this.options.interval)), this
    }, i.prototype.getItemIndex = function(e) {
        return this.$items = e.parent().children(".item"), this.$items.index(e || this.$active)
    }, i.prototype.getItemForDirection = function(e, t) {
        var i = this.getItemIndex(t);
        if (("prev" == e && 0 === i || "next" == e && i == this.$items.length - 1) && !this.options.wrap) return t;
        var n = (i + ("prev" == e ? -1 : 1)) % this.$items.length;
        return this.$items.eq(n)
    }, i.prototype.to = function(e) {
        var t = this,
            i = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (!(e > this.$items.length - 1 || e < 0)) return this.sliding ? this.$element.one("slid.bs.carousel", (function() {
            t.to(e)
        })) : i == e ? this.pause().cycle() : this.slide(e > i ? "next" : "prev", this.$items.eq(e))
    }, i.prototype.pause = function(t) {
        return t || (this.paused = !0), this.$element.find(".next, .prev").length && e.support.transition && (this.$element.trigger(e.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, i.prototype.next = function() {
        if (!this.sliding) return this.slide("next")
    }, i.prototype.prev = function() {
        if (!this.sliding) return this.slide("prev")
    }, i.prototype.slide = function(t, n) {
        var o = this.$element.find(".item.active"),
            s = n || this.getItemForDirection(t, o),
            r = this.interval,
            a = "next" == t ? "left" : "right",
            l = this;
        if (s.hasClass("active")) return this.sliding = !1;
        var d = s[0],
            c = e.Event("slide.bs.carousel", {
                relatedTarget: d,
                direction: a
            });
        if (this.$element.trigger(c), !c.isDefaultPrevented()) {
            if (this.sliding = !0, r && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var u = e(this.$indicators.children()[this.getItemIndex(s)]);
                u && u.addClass("active")
            }
            var p = e.Event("slid.bs.carousel", {
                relatedTarget: d,
                direction: a
            });
            return e.support.transition && this.$element.hasClass("slide") ? (s.addClass(t), "object" == typeof s && s.length && s[0].offsetWidth, o.addClass(a), s.addClass(a), o.one("bsTransitionEnd", (function() {
                s.removeClass([t, a].join(" ")).addClass("active"), o.removeClass(["active", a].join(" ")), l.sliding = !1, setTimeout((function() {
                    l.$element.trigger(p)
                }), 0)
            })).emulateTransitionEnd(i.TRANSITION_DURATION)) : (o.removeClass("active"), s.addClass("active"), this.sliding = !1, this.$element.trigger(p)), r && this.cycle(), this
        }
    };
    var n = e.fn.carousel;
    e.fn.carousel = t, e.fn.carousel.Constructor = i, e.fn.carousel.noConflict = function() {
        return e.fn.carousel = n, this
    };
    var o = function(i) {
        var n = e(this),
            o = n.attr("href");
        o && (o = o.replace(/.*(?=#[^\s]+$)/, ""));
        var s = n.attr("data-target") || o,
            r = e(document).find(s);
        if (r.hasClass("carousel")) {
            var a = e.extend({}, r.data(), n.data()),
                l = n.attr("data-slide-to");
            l && (a.interval = !1), t.call(r, a), l && r.data("bs.carousel").to(l), i.preventDefault()
        }
    };
    e(document).on("click.bs.carousel.data-api", "[data-slide]", o).on("click.bs.carousel.data-api", "[data-slide-to]", o), e(window).on("load", (function() {
        e('[data-ride="carousel"]').each((function() {
            var i = e(this);
            t.call(i, i.data())
        }))
    }))
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        var i, n = t.attr("data-target") || (i = t.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "");
        return e(document).find(n)
    }

    function i(t) {
        return this.each((function() {
            var i = e(this),
                o = i.data("bs.collapse"),
                s = e.extend({}, n.DEFAULTS, i.data(), "object" == typeof t && t);
            !o && s.toggle && /show|hide/.test(t) && (s.toggle = !1), o || i.data("bs.collapse", o = new n(this, s)), "string" == typeof t && o[t]()
        }))
    }
    var n = function(t, i) {
        this.$element = e(t), this.options = e.extend({}, n.DEFAULTS, i), this.$trigger = e('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    n.VERSION = "3.4.1", n.TRANSITION_DURATION = 350, n.DEFAULTS = {
        toggle: !0
    }, n.prototype.dimension = function() {
        return this.$element.hasClass("width") ? "width" : "height"
    }, n.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var t, o = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(o && o.length && (t = o.data("bs.collapse")) && t.transitioning)) {
                var s = e.Event("show.bs.collapse");
                if (this.$element.trigger(s), !s.isDefaultPrevented()) {
                    o && o.length && (i.call(o, "hide"), t || o.data("bs.collapse", null));
                    var r = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[r](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var a = function() {
                        this.$element.removeClass("collapsing").addClass("collapse in")[r](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!e.support.transition) return a.call(this);
                    var l = e.camelCase(["scroll", r].join("-"));
                    this.$element.one("bsTransitionEnd", e.proxy(a, this)).emulateTransitionEnd(n.TRANSITION_DURATION)[r](this.$element[0][l])
                }
            }
        }
    }, n.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var t = e.Event("hide.bs.collapse");
            if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                var i = this.dimension();
                this.$element[i](this.$element[i]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var o = function() {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                if (!e.support.transition) return o.call(this);
                this.$element[i](0).one("bsTransitionEnd", e.proxy(o, this)).emulateTransitionEnd(n.TRANSITION_DURATION)
            }
        }
    }, n.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, n.prototype.getParent = function() {
        return e(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(e.proxy((function(i, n) {
            var o = e(n);
            this.addAriaAndCollapsedClass(t(o), o)
        }), this)).end()
    }, n.prototype.addAriaAndCollapsedClass = function(e, t) {
        var i = e.hasClass("in");
        e.attr("aria-expanded", i), t.toggleClass("collapsed", !i).attr("aria-expanded", i)
    };
    var o = e.fn.collapse;
    e.fn.collapse = i, e.fn.collapse.Constructor = n, e.fn.collapse.noConflict = function() {
        return e.fn.collapse = o, this
    }, e(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', (function(n) {
        var o = e(this);
        o.attr("data-target") || n.preventDefault();
        var s = t(o),
            r = s.data("bs.collapse") ? "toggle" : o.data();
        i.call(s, r)
    }))
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        var i = t.attr("data-target");
        i || (i = (i = t.attr("href")) && /#[A-Za-z]/.test(i) && i.replace(/.*(?=#[^\s]*$)/, ""));
        var n = "#" !== i ? e(document).find(i) : null;
        return n && n.length ? n : t.parent()
    }

    function i(i) {
        i && 3 === i.which || (e(o).remove(), e(s).each((function() {
            var n = e(this),
                o = t(n),
                s = {
                    relatedTarget: this
                };
            o.hasClass("open") && (i && "click" == i.type && /input|textarea/i.test(i.target.tagName) && e.contains(o[0], i.target) || (o.trigger(i = e.Event("hide.bs.dropdown", s)), i.isDefaultPrevented() || (n.attr("aria-expanded", "false"), o.removeClass("open").trigger(e.Event("hidden.bs.dropdown", s)))))
        })))
    }

    function n(t) {
        return this.each((function() {
            var i = e(this),
                n = i.data("bs.dropdown");
            n || i.data("bs.dropdown", n = new r(this)), "string" == typeof t && n[t].call(i)
        }))
    }
    var o = ".dropdown-backdrop",
        s = '[data-toggle="dropdown"]',
        r = function(t) {
            e(t).on("click.bs.dropdown", this.toggle)
        };
    r.VERSION = "3.4.1", r.prototype.toggle = function(n) {
        var o = e(this);
        if (!o.is(".disabled, :disabled")) {
            var s = t(o),
                r = s.hasClass("open");
            if (i(), !r) {
                "ontouchstart" in document.documentElement && !s.closest(".navbar-nav").length && e(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(e(this)).on("click", i);
                var a = {
                    relatedTarget: this
                };
                if (s.trigger(n = e.Event("show.bs.dropdown", a)), n.isDefaultPrevented()) return;
                o.trigger("focus").attr("aria-expanded", "true"), s.toggleClass("open").trigger(e.Event("shown.bs.dropdown", a))
            }
            return !1
        }
    }, r.prototype.keydown = function(i) {
        if (/(38|40|27|32)/.test(i.which) && !/input|textarea/i.test(i.target.tagName)) {
            var n = e(this);
            if (i.preventDefault(), i.stopPropagation(), !n.is(".disabled, :disabled")) {
                var o = t(n),
                    r = o.hasClass("open");
                if (!r && 27 != i.which || r && 27 == i.which) return 27 == i.which && o.find(s).trigger("focus"), n.trigger("click");
                var a = " li:not(.disabled):visible a",
                    l = o.find(".dropdown-menu" + a);
                if (l.length) {
                    var d = l.index(i.target);
                    38 == i.which && d > 0 && d--, 40 == i.which && d < l.length - 1 && d++, ~d || (d = 0), l.eq(d).trigger("focus")
                }
            }
        }
    };
    var a = e.fn.dropdown;
    e.fn.dropdown = n, e.fn.dropdown.Constructor = r, e.fn.dropdown.noConflict = function() {
        return e.fn.dropdown = a, this
    }, e(document).on("click.bs.dropdown.data-api", i).on("click.bs.dropdown.data-api", ".dropdown form", (function(e) {
        e.stopPropagation()
    })).on("click.bs.dropdown.data-api", s, r.prototype.toggle).on("keydown.bs.dropdown.data-api", s, r.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", r.prototype.keydown)
}(jQuery),
function(e) {
    "use strict";

    function t(t, n) {
        return this.each((function() {
            var o = e(this),
                s = o.data("bs.modal"),
                r = e.extend({}, i.DEFAULTS, o.data(), "object" == typeof t && t);
            s || o.data("bs.modal", s = new i(this, r)), "string" == typeof t ? s[t](n) : r.show && s.show(n)
        }))
    }
    var i = function(t, i) {
        this.options = i, this.$body = e(document.body), this.$element = e(t), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.fixedContent = ".navbar-fixed-top, .navbar-fixed-bottom", this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy((function() {
            this.$element.trigger("loaded.bs.modal")
        }), this))
    };
    i.VERSION = "3.4.1", i.TRANSITION_DURATION = 300, i.BACKDROP_TRANSITION_DURATION = 150, i.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, i.prototype.toggle = function(e) {
        return this.isShown ? this.hide() : this.show(e)
    }, i.prototype.show = function(t) {
        var n = this,
            o = e.Event("show.bs.modal", {
                relatedTarget: t
            });
        this.$element.trigger(o), this.isShown || o.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", (function() {
            n.$element.one("mouseup.dismiss.bs.modal", (function(t) {
                e(t.target).is(n.$element) && (n.ignoreBackdropClick = !0)
            }))
        })), this.backdrop((function() {
            var o = e.support.transition && n.$element.hasClass("fade");
            n.$element.parent().length || n.$element.appendTo(n.$body), n.$element.show().scrollTop(0), n.adjustDialog(), o && n.$element[0].offsetWidth, n.$element.addClass("in"), n.enforceFocus();
            var s = e.Event("shown.bs.modal", {
                relatedTarget: t
            });
            o ? n.$dialog.one("bsTransitionEnd", (function() {
                n.$element.trigger("focus").trigger(s)
            })).emulateTransitionEnd(i.TRANSITION_DURATION) : n.$element.trigger("focus").trigger(s)
        })))
    }, i.prototype.hide = function(t) {
        t && t.preventDefault(), t = e.Event("hide.bs.modal"), this.$element.trigger(t), this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), e(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : this.hideModal())
    }, i.prototype.enforceFocus = function() {
        e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy((function(e) {
            document === e.target || this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.trigger("focus")
        }), this))
    }, i.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", e.proxy((function(e) {
            27 == e.which && this.hide()
        }), this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, i.prototype.resize = function() {
        this.isShown ? e(window).on("resize.bs.modal", e.proxy(this.handleUpdate, this)) : e(window).off("resize.bs.modal")
    }, i.prototype.hideModal = function() {
        var e = this;
        this.$element.hide(), this.backdrop((function() {
            e.$body.removeClass("modal-open"), e.resetAdjustments(), e.resetScrollbar(), e.$element.trigger("hidden.bs.modal")
        }))
    }, i.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, i.prototype.backdrop = function(t) {
        var n = this,
            o = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var s = e.support.transition && o;
            if (this.$backdrop = e(document.createElement("div")).addClass("modal-backdrop " + o).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", e.proxy((function(e) {
                    this.ignoreBackdropClick ? this.ignoreBackdropClick = !1 : e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide())
                }), this)), s && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t) return;
            s ? this.$backdrop.one("bsTransitionEnd", t).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : t()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var r = function() {
                n.removeBackdrop(), t && t()
            };
            e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", r).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : r()
        } else t && t()
    }, i.prototype.handleUpdate = function() {
        this.adjustDialog()
    }, i.prototype.adjustDialog = function() {
        var e = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && e ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !e ? this.scrollbarWidth : ""
        })
    }, i.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        })
    }, i.prototype.checkScrollbar = function() {
        var e = window.innerWidth;
        if (!e) {
            var t = document.documentElement.getBoundingClientRect();
            e = t.right - Math.abs(t.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < e, this.scrollbarWidth = this.measureScrollbar()
    }, i.prototype.setScrollbar = function() {
        var t = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "";
        var i = this.scrollbarWidth;
        this.bodyIsOverflowing && (this.$body.css("padding-right", t + i), e(this.fixedContent).each((function(t, n) {
            var o = n.style.paddingRight,
                s = e(n).css("padding-right");
            e(n).data("padding-right", o).css("padding-right", parseFloat(s) + i + "px")
        })))
    }, i.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad), e(this.fixedContent).each((function(t, i) {
            var n = e(i).data("padding-right");
            e(i).removeData("padding-right"), i.style.paddingRight = n || ""
        }))
    }, i.prototype.measureScrollbar = function() {
        var e = document.createElement("div");
        e.className = "modal-scrollbar-measure", this.$body.append(e);
        var t = e.offsetWidth - e.clientWidth;
        return this.$body[0].removeChild(e), t
    };
    var n = e.fn.modal;
    e.fn.modal = t, e.fn.modal.Constructor = i, e.fn.modal.noConflict = function() {
        return e.fn.modal = n, this
    }, e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', (function(i) {
        var n = e(this),
            o = n.attr("href"),
            s = n.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, ""),
            r = e(document).find(s),
            a = r.data("bs.modal") ? "toggle" : e.extend({
                remote: !/#/.test(o) && o
            }, r.data(), n.data());
        n.is("a") && i.preventDefault(), r.one("show.bs.modal", (function(e) {
            e.isDefaultPrevented() || r.one("hidden.bs.modal", (function() {
                n.is(":visible") && n.trigger("focus")
            }))
        })), t.call(r, a, this)
    }))
}(jQuery),
function(e) {
    "use strict";

    function t(t, i) {
        var n = t.nodeName.toLowerCase();
        if (-1 !== e.inArray(n, i)) return -1 === e.inArray(n, s) || Boolean(t.nodeValue.match(a) || t.nodeValue.match(l));
        for (var o = e(i).filter((function(e, t) {
                return t instanceof RegExp
            })), r = 0, d = o.length; r < d; r++)
            if (n.match(o[r])) return !0;
        return !1
    }

    function i(i, n, o) {
        if (0 === i.length) return i;
        if (o && "function" == typeof o) return o(i);
        if (!document.implementation || !document.implementation.createHTMLDocument) return i;
        var s = document.implementation.createHTMLDocument("sanitization");
        s.body.innerHTML = i;
        for (var r = e.map(n, (function(e, t) {
                return t
            })), a = e(s.body).find("*"), l = 0, d = a.length; l < d; l++) {
            var c = a[l],
                u = c.nodeName.toLowerCase();
            if (-1 !== e.inArray(u, r))
                for (var p = e.map(c.attributes, (function(e) {
                        return e
                    })), h = [].concat(n["*"] || [], n[u] || []), f = 0, m = p.length; f < m; f++) t(p[f], h) || c.removeAttribute(p[f].nodeName);
            else c.parentNode.removeChild(c)
        }
        return s.body.innerHTML
    }

    function n(t) {
        return this.each((function() {
            var i = e(this),
                n = i.data("bs.tooltip"),
                o = "object" == typeof t && t;
            !n && /destroy|hide/.test(t) || (n || i.data("bs.tooltip", n = new d(this, o)), "string" == typeof t && n[t]())
        }))
    }
    var o = ["sanitize", "whiteList", "sanitizeFn"],
        s = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"],
        r = {
            "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
            a: ["target", "href", "title", "rel"],
            area: [],
            b: [],
            br: [],
            col: [],
            code: [],
            div: [],
            em: [],
            hr: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            i: [],
            img: ["src", "alt", "title", "width", "height"],
            li: [],
            ol: [],
            p: [],
            pre: [],
            s: [],
            small: [],
            span: [],
            sub: [],
            sup: [],
            strong: [],
            u: [],
            ul: []
        },
        a = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,
        l = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i,
        d = function(e, t) {
            this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", e, t)
        };
    d.VERSION = "3.4.1", d.TRANSITION_DURATION = 150, d.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        },
        sanitize: !0,
        sanitizeFn: null,
        whiteList: r
    }, d.prototype.init = function(t, i, n) {
        if (this.enabled = !0, this.type = t, this.$element = e(i), this.options = this.getOptions(n), this.$viewport = this.options.viewport && e(document).find(e.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                click: !1,
                hover: !1,
                focus: !1
            }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        for (var o = this.options.trigger.split(" "), s = o.length; s--;) {
            var r = o[s];
            if ("click" == r) this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this));
            else if ("manual" != r) {
                var a = "hover" == r ? "mouseenter" : "focusin",
                    l = "hover" == r ? "mouseleave" : "focusout";
                this.$element.on(a + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = e.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, d.prototype.getDefaults = function() {
        return d.DEFAULTS
    }, d.prototype.getOptions = function(t) {
        var n = this.$element.data();
        for (var s in n) n.hasOwnProperty(s) && -1 !== e.inArray(s, o) && delete n[s];
        return (t = e.extend({}, this.getDefaults(), n, t)).delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }), t.sanitize && (t.template = i(t.template, t.whiteList, t.sanitizeFn)), t
    }, d.prototype.getDelegateOptions = function() {
        var t = {},
            i = this.getDefaults();
        return this._options && e.each(this._options, (function(e, n) {
            i[e] != n && (t[e] = n)
        })), t
    }, d.prototype.enter = function(t) {
        var i = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        if (i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, i)), t instanceof e.Event && (i.inState["focusin" == t.type ? "focus" : "hover"] = !0), i.tip().hasClass("in") || "in" == i.hoverState) i.hoverState = "in";
        else {
            if (clearTimeout(i.timeout), i.hoverState = "in", !i.options.delay || !i.options.delay.show) return i.show();
            i.timeout = setTimeout((function() {
                "in" == i.hoverState && i.show()
            }), i.options.delay.show)
        }
    }, d.prototype.isInStateTrue = function() {
        for (var e in this.inState)
            if (this.inState[e]) return !0;
        return !1
    }, d.prototype.leave = function(t) {
        var i = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        if (i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, i)), t instanceof e.Event && (i.inState["focusout" == t.type ? "focus" : "hover"] = !1), !i.isInStateTrue()) {
            if (clearTimeout(i.timeout), i.hoverState = "out", !i.options.delay || !i.options.delay.hide) return i.hide();
            i.timeout = setTimeout((function() {
                "out" == i.hoverState && i.hide()
            }), i.options.delay.hide)
        }
    }, d.prototype.show = function() {
        var t = e.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(t);
            var i = e.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (t.isDefaultPrevented() || !i) return;
            var n = this,
                o = this.tip(),
                s = this.getUID(this.type);
            this.setContent(), o.attr("id", s), this.$element.attr("aria-describedby", s), this.options.animation && o.addClass("fade");
            var r = "function" == typeof this.options.placement ? this.options.placement.call(this, o[0], this.$element[0]) : this.options.placement,
                a = /\s?auto?\s?/i,
                l = a.test(r);
            l && (r = r.replace(a, "") || "top"), o.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(r).data("bs." + this.type, this), this.options.container ? o.appendTo(e(document).find(this.options.container)) : o.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
            var c = this.getPosition(),
                u = o[0].offsetWidth,
                p = o[0].offsetHeight;
            if (l) {
                var h = r,
                    f = this.getPosition(this.$viewport);
                r = "bottom" == r && c.bottom + p > f.bottom ? "top" : "top" == r && c.top - p < f.top ? "bottom" : "right" == r && c.right + u > f.width ? "left" : "left" == r && c.left - u < f.left ? "right" : r, o.removeClass(h).addClass(r)
            }
            var m = this.getCalculatedOffset(r, c, u, p);
            this.applyPlacement(m, r);
            var v = function() {
                var e = n.hoverState;
                n.$element.trigger("shown.bs." + n.type), n.hoverState = null, "out" == e && n.leave(n)
            };
            e.support.transition && this.$tip.hasClass("fade") ? o.one("bsTransitionEnd", v).emulateTransitionEnd(d.TRANSITION_DURATION) : v()
        }
    }, d.prototype.applyPlacement = function(t, i) {
        var n = this.tip(),
            o = n[0].offsetWidth,
            s = n[0].offsetHeight,
            r = parseInt(n.css("margin-top"), 10),
            a = parseInt(n.css("margin-left"), 10);
        isNaN(r) && (r = 0), isNaN(a) && (a = 0), t.top += r, t.left += a, e.offset.setOffset(n[0], e.extend({
            using: function(e) {
                n.css({
                    top: Math.round(e.top),
                    left: Math.round(e.left)
                })
            }
        }, t), 0), n.addClass("in");
        var l = n[0].offsetWidth,
            d = n[0].offsetHeight;
        "top" == i && d != s && (t.top = t.top + s - d);
        var c = this.getViewportAdjustedDelta(i, t, l, d);
        c.left ? t.left += c.left : t.top += c.top;
        var u = /top|bottom/.test(i),
            p = u ? 2 * c.left - o + l : 2 * c.top - s + d,
            h = u ? "offsetWidth" : "offsetHeight";
        n.offset(t), this.replaceArrow(p, n[0][h], u)
    }, d.prototype.replaceArrow = function(e, t, i) {
        this.arrow().css(i ? "left" : "top", 50 * (1 - e / t) + "%").css(i ? "top" : "left", "")
    }, d.prototype.setContent = function() {
        var e = this.tip(),
            t = this.getTitle();
        this.options.html ? (this.options.sanitize && (t = i(t, this.options.whiteList, this.options.sanitizeFn)), e.find(".tooltip-inner").html(t)) : e.find(".tooltip-inner").text(t), e.removeClass("fade in top bottom left right")
    }, d.prototype.hide = function(t) {
        function i() {
            "in" != n.hoverState && o.detach(), n.$element && n.$element.removeAttr("aria-describedby").trigger("hidden.bs." + n.type), t && t()
        }
        var n = this,
            o = e(this.$tip),
            s = e.Event("hide.bs." + this.type);
        if (this.$element.trigger(s), !s.isDefaultPrevented()) return o.removeClass("in"), e.support.transition && o.hasClass("fade") ? o.one("bsTransitionEnd", i).emulateTransitionEnd(d.TRANSITION_DURATION) : i(), this.hoverState = null, this
    }, d.prototype.fixTitle = function() {
        var e = this.$element;
        (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
    }, d.prototype.hasContent = function() {
        return this.getTitle()
    }, d.prototype.getPosition = function(t) {
        var i = (t = t || this.$element)[0],
            n = "BODY" == i.tagName,
            o = i.getBoundingClientRect();
        null == o.width && (o = e.extend({}, o, {
            width: o.right - o.left,
            height: o.bottom - o.top
        }));
        var s = window.SVGElement && i instanceof window.SVGElement,
            r = n ? {
                top: 0,
                left: 0
            } : s ? null : t.offset(),
            a = {
                scroll: n ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()
            },
            l = n ? {
                width: e(window).width(),
                height: e(window).height()
            } : null;
        return e.extend({}, o, a, l, r)
    }, d.prototype.getCalculatedOffset = function(e, t, i, n) {
        return "bottom" == e ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - i / 2
        } : "top" == e ? {
            top: t.top - n,
            left: t.left + t.width / 2 - i / 2
        } : "left" == e ? {
            top: t.top + t.height / 2 - n / 2,
            left: t.left - i
        } : {
            top: t.top + t.height / 2 - n / 2,
            left: t.left + t.width
        }
    }, d.prototype.getViewportAdjustedDelta = function(e, t, i, n) {
        var o = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return o;
        var s = this.options.viewport && this.options.viewport.padding || 0,
            r = this.getPosition(this.$viewport);
        if (/right|left/.test(e)) {
            var a = t.top - s - r.scroll,
                l = t.top + s - r.scroll + n;
            a < r.top ? o.top = r.top - a : l > r.top + r.height && (o.top = r.top + r.height - l)
        } else {
            var d = t.left - s,
                c = t.left + s + i;
            d < r.left ? o.left = r.left - d : c > r.right && (o.left = r.left + r.width - c)
        }
        return o
    }, d.prototype.getTitle = function() {
        var e = this.$element,
            t = this.options;
        return e.attr("data-original-title") || ("function" == typeof t.title ? t.title.call(e[0]) : t.title)
    }, d.prototype.getUID = function(e) {
        do {
            e += ~~(1e6 * Math.random())
        } while (document.getElementById(e));
        return e
    }, d.prototype.tip = function() {
        if (!this.$tip && (this.$tip = e(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip
    }, d.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, d.prototype.enable = function() {
        this.enabled = !0
    }, d.prototype.disable = function() {
        this.enabled = !1
    }, d.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }, d.prototype.toggle = function(t) {
        var i = this;
        t && ((i = e(t.currentTarget).data("bs." + this.type)) || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, i))), t ? (i.inState.click = !i.inState.click, i.isInStateTrue() ? i.enter(i) : i.leave(i)) : i.tip().hasClass("in") ? i.leave(i) : i.enter(i)
    }, d.prototype.destroy = function() {
        var e = this;
        clearTimeout(this.timeout), this.hide((function() {
            e.$element.off("." + e.type).removeData("bs." + e.type), e.$tip && e.$tip.detach(), e.$tip = null, e.$arrow = null, e.$viewport = null, e.$element = null
        }))
    }, d.prototype.sanitizeHtml = function(e) {
        return i(e, this.options.whiteList, this.options.sanitizeFn)
    };
    var c = e.fn.tooltip;
    e.fn.tooltip = n, e.fn.tooltip.Constructor = d, e.fn.tooltip.noConflict = function() {
        return e.fn.tooltip = c, this
    }
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        return this.each((function() {
            var n = e(this),
                o = n.data("bs.popover"),
                s = "object" == typeof t && t;
            !o && /destroy|hide/.test(t) || (o || n.data("bs.popover", o = new i(this, s)), "string" == typeof t && o[t]())
        }))
    }
    var i = function(e, t) {
        this.init("popover", e, t)
    };
    if (!e.fn.tooltip) throw new Error("Popover requires tooltip.js");
    i.VERSION = "3.4.1", i.DEFAULTS = e.extend({}, e.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), i.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype), i.prototype.constructor = i, i.prototype.getDefaults = function() {
        return i.DEFAULTS
    }, i.prototype.setContent = function() {
        var e = this.tip(),
            t = this.getTitle(),
            i = this.getContent();
        if (this.options.html) {
            var n = typeof i;
            this.options.sanitize && (t = this.sanitizeHtml(t), "string" === n && (i = this.sanitizeHtml(i))), e.find(".popover-title").html(t), e.find(".popover-content").children().detach().end()["string" === n ? "html" : "append"](i)
        } else e.find(".popover-title").text(t), e.find(".popover-content").children().detach().end().text(i);
        e.removeClass("fade top bottom left right in"), e.find(".popover-title").html() || e.find(".popover-title").hide()
    }, i.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }, i.prototype.getContent = function() {
        var e = this.$element,
            t = this.options;
        return e.attr("data-content") || ("function" == typeof t.content ? t.content.call(e[0]) : t.content)
    }, i.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    var n = e.fn.popover;
    e.fn.popover = t, e.fn.popover.Constructor = i, e.fn.popover.noConflict = function() {
        return e.fn.popover = n, this
    }
}(jQuery),
function(e) {
    "use strict";

    function t(i, n) {
        this.$body = e(document.body), this.$scrollElement = e(i).is(document.body) ? e(window) : e(i), this.options = e.extend({}, t.DEFAULTS, n), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", e.proxy(this.process, this)), this.refresh(), this.process()
    }

    function i(i) {
        return this.each((function() {
            var n = e(this),
                o = n.data("bs.scrollspy"),
                s = "object" == typeof i && i;
            o || n.data("bs.scrollspy", o = new t(this, s)), "string" == typeof i && o[i]()
        }))
    }
    t.VERSION = "3.4.1", t.DEFAULTS = {
        offset: 10
    }, t.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, t.prototype.refresh = function() {
        var t = this,
            i = "offset",
            n = 0;
        this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), e.isWindow(this.$scrollElement[0]) || (i = "position", n = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map((function() {
            var t = e(this),
                o = t.data("target") || t.attr("href"),
                s = /^#./.test(o) && e(o);
            return s && s.length && s.is(":visible") && [
                [s[i]().top + n, o]
            ] || null
        })).sort((function(e, t) {
            return e[0] - t[0]
        })).each((function() {
            t.offsets.push(this[0]), t.targets.push(this[1])
        }))
    }, t.prototype.process = function() {
        var e, t = this.$scrollElement.scrollTop() + this.options.offset,
            i = this.getScrollHeight(),
            n = this.options.offset + i - this.$scrollElement.height(),
            o = this.offsets,
            s = this.targets,
            r = this.activeTarget;
        if (this.scrollHeight != i && this.refresh(), t >= n) return r != (e = s[s.length - 1]) && this.activate(e);
        if (r && t < o[0]) return this.activeTarget = null, this.clear();
        for (e = o.length; e--;) r != s[e] && t >= o[e] && (void 0 === o[e + 1] || t < o[e + 1]) && this.activate(s[e])
    }, t.prototype.activate = function(t) {
        this.activeTarget = t, this.clear();
        var i = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
            n = e(i).parents("li").addClass("active");
        n.parent(".dropdown-menu").length && (n = n.closest("li.dropdown").addClass("active")), n.trigger("activate.bs.scrollspy")
    }, t.prototype.clear = function() {
        e(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var n = e.fn.scrollspy;
    e.fn.scrollspy = i, e.fn.scrollspy.Constructor = t, e.fn.scrollspy.noConflict = function() {
        return e.fn.scrollspy = n, this
    }, e(window).on("load.bs.scrollspy.data-api", (function() {
        e('[data-spy="scroll"]').each((function() {
            var t = e(this);
            i.call(t, t.data())
        }))
    }))
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        return this.each((function() {
            var n = e(this),
                o = n.data("bs.tab");
            o || n.data("bs.tab", o = new i(this)), "string" == typeof t && o[t]()
        }))
    }
    var i = function(t) {
        this.element = e(t)
    };
    i.VERSION = "3.4.1", i.TRANSITION_DURATION = 150, i.prototype.show = function() {
        var t = this.element,
            i = t.closest("ul:not(.dropdown-menu)"),
            n = t.data("target");
        if (n || (n = (n = t.attr("href")) && n.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active")) {
            var o = i.find(".active:last a"),
                s = e.Event("hide.bs.tab", {
                    relatedTarget: t[0]
                }),
                r = e.Event("show.bs.tab", {
                    relatedTarget: o[0]
                });
            if (o.trigger(s), t.trigger(r), !r.isDefaultPrevented() && !s.isDefaultPrevented()) {
                var a = e(document).find(n);
                this.activate(t.closest("li"), i), this.activate(a, a.parent(), (function() {
                    o.trigger({
                        type: "hidden.bs.tab",
                        relatedTarget: t[0]
                    }), t.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: o[0]
                    })
                }))
            }
        }
    }, i.prototype.activate = function(t, n, o) {
        function s() {
            r.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), a ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"), t.parent(".dropdown-menu").length && t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), o && o()
        }
        var r = n.find("> .active"),
            a = o && e.support.transition && (r.length && r.hasClass("fade") || !!n.find("> .fade").length);
        r.length && a ? r.one("bsTransitionEnd", s).emulateTransitionEnd(i.TRANSITION_DURATION) : s(), r.removeClass("in")
    };
    var n = e.fn.tab;
    e.fn.tab = t, e.fn.tab.Constructor = i, e.fn.tab.noConflict = function() {
        return e.fn.tab = n, this
    };
    var o = function(i) {
        i.preventDefault(), t.call(e(this), "show")
    };
    e(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', o).on("click.bs.tab.data-api", '[data-toggle="pill"]', o)
}(jQuery),
function(e) {
    "use strict";

    function t(t) {
        return this.each((function() {
            var n = e(this),
                o = n.data("bs.affix"),
                s = "object" == typeof t && t;
            o || n.data("bs.affix", o = new i(this, s)), "string" == typeof t && o[t]()
        }))
    }
    var i = function(t, n) {
        this.options = e.extend({}, i.DEFAULTS, n);
        var o = this.options.target === i.DEFAULTS.target ? e(this.options.target) : e(document).find(this.options.target);
        this.$target = o.on("scroll.bs.affix.data-api", e.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", e.proxy(this.checkPositionWithEventLoop, this)), this.$element = e(t), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
    };
    i.VERSION = "3.4.1", i.RESET = "affix affix-top affix-bottom", i.DEFAULTS = {
        offset: 0,
        target: window
    }, i.prototype.getState = function(e, t, i, n) {
        var o = this.$target.scrollTop(),
            s = this.$element.offset(),
            r = this.$target.height();
        if (null != i && "top" == this.affixed) return o < i && "top";
        if ("bottom" == this.affixed) return null != i ? !(o + this.unpin <= s.top) && "bottom" : !(o + r <= e - n) && "bottom";
        var a = null == this.affixed,
            l = a ? o : s.top;
        return null != i && o <= i ? "top" : null != n && l + (a ? r : t) >= e - n && "bottom"
    }, i.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(i.RESET).addClass("affix");
        var e = this.$target.scrollTop(),
            t = this.$element.offset();
        return this.pinnedOffset = t.top - e
    }, i.prototype.checkPositionWithEventLoop = function() {
        setTimeout(e.proxy(this.checkPosition, this), 1)
    }, i.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var t = this.$element.height(),
                n = this.options.offset,
                o = n.top,
                s = n.bottom,
                r = Math.max(e(document).height(), e(document.body).height());
            "object" != typeof n && (s = o = n), "function" == typeof o && (o = n.top(this.$element)), "function" == typeof s && (s = n.bottom(this.$element));
            var a = this.getState(r, t, o, s);
            if (this.affixed != a) {
                null != this.unpin && this.$element.css("top", "");
                var l = "affix" + (a ? "-" + a : ""),
                    d = e.Event(l + ".bs.affix");
                if (this.$element.trigger(d), d.isDefaultPrevented()) return;
                this.affixed = a, this.unpin = "bottom" == a ? this.getPinnedOffset() : null, this.$element.removeClass(i.RESET).addClass(l).trigger(l.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == a && this.$element.offset({
                top: r - t - s
            })
        }
    };
    var n = e.fn.affix;
    e.fn.affix = t, e.fn.affix.Constructor = i, e.fn.affix.noConflict = function() {
        return e.fn.affix = n, this
    }, e(window).on("load", (function() {
        e('[data-spy="affix"]').each((function() {
            var i = e(this),
                n = i.data();
            n.offset = n.offset || {}, null != n.offsetBottom && (n.offset.bottom = n.offsetBottom), null != n.offsetTop && (n.offset.top = n.offsetTop), t.call(i, n)
        }))
    }))
}(jQuery), window.initializeMultiselect = function(e) {
        var t = e.data("max-selected");
        e.multiselect({
            includeSelectAllOption: 1 === e.data("select-all"),
            selectAllText: e.data("select-all-text"),
            enableFiltering: 1 === e.data("filterable") && e.find("option").length > 10,
            enableCaseInsensitiveFiltering: 1 === e.data("filterable") && e.find("option").length > 10,
            filterPlaceholder: e.data("search-text"),
            nonSelectedText: e.data("placeholder"),
            buttonClass: "btn btn-utility btn-alt",
            buttonWidth: "100%",
            maxHeight: 200,
            numberDisplayed: e.data("number-displayed") || 1,
            allSelectedText: e.data("all-selected-text"),
            nSelectedText: e.data("n-selected-text"),
            onChange: function() {
                limitSelections(e, t)
            }
        })
    }, document.addEventListener("DOMContentLoaded", (function() {
        $(".dropdown_advanced").each((function() {
            initializeMultiselect($(this))
        }))
    })), document.addEventListener("DOMContentLoaded", (function() {
        $('[data-toggle="popover"]').popover()
    })), document.addEventListener("DOMContentLoaded", (function() {
        $('[data-toggle="tooltip"]').tooltip()
    })),
    function() {
        jQuery((function() {
            return $(".modal").on("shown.bs.modal", (function() {
                return $(this).find("input:text:visible:first").focus()
            }))
        }))
    }.call(this),
    function() {
        var e;
        e = {
            en: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Terms and Conditions",
                        privacy_policy: "Privacy Policy",
                        ccpa_notice: "CCPA Notice"
                    }
                },
                newsletters: {
                    submitted: "was successfully added to our list."
                },
                payment: {
                    errors: {
                        empty_form: "All fields are required.",
                        expired_session: {
                            modal: {
                                text: "Please reload the page in order to continue with your purchase."
                            }
                        },
                        invalid_card: "Validation failed with the payment service. Is the card valid?",
                        network_error: "A network error occurred when contacting the payment service. Please try again.",
                        unknown_error: "An unknown error occurred with the payment service. Please try again.",
                        invalid_field: {
                            number: "Invalid card number",
                            cvv: "Invalid security code number",
                            expiration_date: "Invalid expiration date",
                            postal_code: "Invalid postal code"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "Example: 'New York, NY', 'London'",
                        temporary_location_placeholder: "Location of eventual on site work",
                        hybrid_location_placeholder: "Location of on site work",
                        full_location_placeholder: "'%{standard_location}' or Company Headquarters"
                    }
                }
            },
            da: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Vilk\xe5r & Betingelser",
                        privacy_policy: "Privatlivs Politik",
                        ccpa_notice: "CCPA meddelelse."
                    }
                },
                newsletters: {
                    submitted: "blev tilf\xf8jet til vores liste."
                },
                payment: {
                    errors: {
                        empty_form: "AAlle felter skal udfyldes.",
                        expired_session: {
                            modal: {
                                text: "Genindl\xe6s siden for at forts\xe6tte med dit k\xf8b."
                            }
                        },
                        invalid_card: "Validering mislykkedes med betalingstjenesten. Er kortet gyldigt?",
                        network_error: "Der opstod en netv\xe6rksfejl, da du kontaktede betalingstjenesten. Pr\xf8v igen.",
                        unknown_error: "Der opstod en ukendt fejl med betalingstjenesten. Pr\xf8v igen.",
                        invalid_field: {
                            number: "Ugyldigt kortnummer",
                            cvv: "Ugyldigt sikkerhedskodenummer",
                            expiration_date: "Ugyldig udl\xf8bsdato",
                            postal_code: "Ugyldig postnummer"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "Eksempel: 'K\xf8benhavn', 'Aarhus'",
                        temporary_location_placeholder: "Placering af eventuelt on-site arbejde",
                        hybrid_location_placeholder: "Placering af on -stedet arbejde",
                        full_location_placeholder: "'%{standard_location}' eller virksomhedens hovedkvarter"
                    }
                }
            },
            de: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Nutzungsbedingungen",
                        privacy_policy: "Datenschutzerkl\xe4rung",
                        ccpa_notice: "CCPA-Hinweis"
                    }
                },
                newsletters: {
                    submitted: "wurde erfolgreich zu unserer Liste hinzugef\xfcgt."
                },
                payment: {
                    errors: {
                        empty_form: "Alle Felder m\xfcssen ausgef\xfcllt werden.",
                        expired_session: {
                            modal: {
                                text: "Bitte laden Sie die Seite neu, um mit dem Kauf fortzufahren."
                            }
                        },
                        invalid_card: "Die \xdcberpr\xfcfung durch den Zahlungsdienst ist fehlgeschlagen. Ist die Karte g\xfcltig?",
                        network_error: "Beim Kontaktieren des Zahlungsdienstes ist ein Netzwerkfehler aufgetreten. Bitte versuchen Sie es erneut.",
                        unknown_error: "Beim Kontaktieren des Zahlungsdienstes ist ein unbekannter Fehler aufgetreten. Bitte versuchen Sie es erneut.",
                        invalid_field: {
                            number: "Ung\xfcltige Kartennummer",
                            cvv: "Ung\xfcltiger Sicherheitscode",
                            expiration_date: "Ung\xfcltiges Ablaufdatum",
                            postal_code: "Ung\xfcltige Postleitzahl"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "Beispiel: 'Berlin', '10785 Berlin'",
                        temporary_location_placeholder: "Ort der eventuellen Arbeiten vor Ort",
                        hybrid_location_placeholder: "Standort der Arbeit vor Ort",
                        full_location_placeholder: "'%{standard_location}' oder Firmensitz"
                    }
                }
            },
            es: {
                legal: {
                    agreements: {
                        terms_and_conditions: "T\xe9rminos y Condiciones",
                        privacy_policy: "Pol\xedtica de Privacidad",
                        ccpa_notice: "Aviso de CCPA"
                    }
                },
                newsletters: {
                    submitted: "fue agregado con \xe9xito a nuestra lista."
                },
                payment: {
                    errors: {
                        empty_form: "Todos los campos son obligatorios.",
                        expired_session: {
                            modal: {
                                text: "Vuelva a cargar la p\xe1gina para continuar con su compra."
                            }
                        },
                        invalid_card: "La validaci\xf3n fall\xf3 con el servicio de pago. \xbfEs v\xe1lida la tarjeta?",
                        network_error: "Se produjo un error de red al contactar al servicio de pago. Int\xe9ntalo de nuevo.",
                        unknown_error: "Se produjo un error desconocido con el servicio de pago. Int\xe9ntalo de nuevo.",
                        invalid_field: {
                            number: "Numero de tarjeta invalido",
                            cvv: "N\xfamero de c\xf3digo de seguridad inv\xe1lido",
                            expiration_date: "Fecha de expiracion inv\xe1lida",
                            postal_code: "C\xf3digo postal inv\xe1lido"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "Ejemplo: 'Nueva York, NY', 'Londres'",
                        temporary_location_placeholder: "Ubicaci\xf3n del eventual trabajo en el sitio",
                        hybrid_location_placeholder: "Ubicaci\xf3n del trabajo en el sitio",
                        full_location_placeholder: "'%{standard_location}' o sede de la empresa"
                    }
                }
            },
            fr: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Conditions g\xe9n\xe9rales",
                        privacy_policy: "Politique de confidentialit\xe9",
                        ccpa_notice: "Avis de confidentialit\xe9 de l\u2019ACCP"
                    }
                },
                newsletters: {
                    submitted: "a \xe9t\xe9 ajout\xe9e \xe0 notre liste."
                },
                payment: {
                    errors: {
                        empty_form: "Tous les champs sont obligatoires.",
                        expired_session: {
                            modal: {
                                text: "Veuillez recharger la page afin de terminer votre achat."
                            }
                        },
                        invalid_card: "La validation a \xe9chou\xe9 aupr\xe8s du service de paiement. La carte est-elle valide\xa0?",
                        network_error: "Une erreur r\xe9seau s\u2019est produite lors de la tentative de connexion au service de paiement. Veuillez r\xe9essayer.",
                        unknown_error: "Une erreur inconnue s\u2019est produite avec le service de paiement. Veuillez r\xe9essayer.",
                        invalid_field: {
                            number: "Num\xe9ro de carte non valide",
                            cvv: "Num\xe9ro de code de s\xe9curit\xe9 non valide",
                            expiration_date: "Date d\u2019expiration non valide",
                            postal_code: "Code postal non valide"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: 'Exemple\xa0: "New York, NY", "Londres"',
                        temporary_location_placeholder: "Localit\xe9 de l\u2019\xe9ventuel travail sur site",
                        hybrid_location_placeholder: "Emplacement du travail sur site",
                        full_location_placeholder: "'%{standard_location}' ou si\xe8ge de l\u2019entreprise"
                    }
                }
            },
            it: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Termini e Condizioni",
                        privacy_policy: "Informativa sulla Privacy",
                        ccpa_notice: "Avviso CCPA"
                    }
                },
                newsletters: {
                    submitted: "\xe8 stato aggiunto correttamente alla nostra lista."
                },
                payment: {
                    errors: {
                        empty_form: "Sono richiesti tutti i campi.",
                        expired_session: {
                            modal: {
                                text: "Ricarica la pagina per continuare con il tuo acquisto."
                            }
                        },
                        invalid_card: "La convalida del pagamento \xe8 fallita. Assicurati che la carta sia valida",
                        network_error: "Si \xe8 verificato un errore di rete durante la procedura del pagamento. Per favore, riprova.",
                        unknown_error: "S\xec \xe8 verificato un errore sconosciuto durante la procedura di pagamento. Per favore, riprova.",
                        invalid_field: {
                            number: "Numero della carta di credito non valido",
                            cvv: "Numero del codice di sicurezza non valido",
                            expiration_date: "Data di scadenza non valida",
                            postal_code: "Codice postale non valido"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "Esempio: 'Milan', 'Napoli', 'Roma'",
                        temporary_location_placeholder: "Posizione di eventuali lavori in loco",
                        hybrid_location_placeholder: "Posizione del lavoro in loco",
                        full_location_placeholder: "'%{standard_location}' o sede dell'azienda"
                    }
                }
            },
            nl: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Algemene voorwaarden",
                        privacy_policy: "Privacy beleid",
                        ccpa_notice: "CCPA Merk op"
                    }
                },
                newsletters: {
                    submitted: "is succesvol toegevoegd aan onze lijst."
                },
                payment: {
                    errors: {
                        empty_form: "Alle velden zijn verplicht.",
                        expired_session: {
                            modal: {
                                text: "Laad de pagina opnieuw om door te gaan met uw aankoop."
                            }
                        },
                        invalid_card: "Validatie mislukt met de betaaldienst. Is de kaart geldig?",
                        network_error: "Er is een netwerkfout opgetreden bij het contact met de betaaldienst. Probeer het opnieuw.",
                        unknown_error: "Er is een onbekende fout opgetreden met de betalingsservice. Probeer het opnieuw.",
                        invalid_field: {
                            number: "Ongeldig kaart nummer",
                            cvv: "Ongeldig beveiligingscodenummer",
                            expiration_date: "Ongeldige vervaldatum",
                            postal_code: "Ongeldige postcode"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "Bijvoorbeeld: 'Amsterdam', 'Rotterdam'",
                        temporary_location_placeholder: "Locatie van eventueel werk ter plaatse",
                        hybrid_location_placeholder: "Locatie van het werk ter plaatse",
                        full_location_placeholder: "'%{standard_location}' of hoofdkantoor van het bedrijf"
                    }
                }
            },
            pt: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Termos e Condi\xe7\xf5es",
                        privacy_policy: "Pol\xedtica de Privacidade",
                        ccpa_notice: "Aviso de CCPA."
                    }
                },
                newsletters: {
                    submitted: "foi adicionado com sucesso \xe0 nossa lista."
                },
                payment: {
                    errors: {
                        empty_form: "Todos os campos s\xe3o necess\xe1rios.",
                        expired_session: {
                            modal: {
                                text: "Atualize a p\xe1gina para continuar com sua compra."
                            }
                        },
                        invalid_card: "A valida\xe7\xe3o falhou com o servi\xe7o de pagamento. O cart\xe3o \xe9 v\xe1lido?",
                        network_error: "Ocorreu um erro de rede ao contactar o servi\xe7o de pagamento. Por favor, tente novamente.",
                        unknown_error: "Ocorreu um erro desconhecido no servi\xe7o de pagamento. Por favor, tente novamente.",
                        invalid_field: {
                            number: "N\xfamero de cart\xe3o inv\xe1lido",
                            cvv: "N\xfamero de c\xf3digo de seguran\xe7a inv\xe1lido",
                            expiration_date: "Data de validade inv\xe1lida",
                            postal_code: "C\xf3digo postal inv\xe1lido"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "Examplo: 'Lisboa', 'Porto'",
                        temporary_location_placeholder: "Localiza\xe7\xe3o de eventuais trabalhos no local",
                        hybrid_location_placeholder: "Localiza\xe7\xe3o do trabalho no local",
                        full_location_placeholder: "'%{standard_location}' ou sede da empresa"
                    }
                }
            },
            sv: {
                legal: {
                    agreements: {
                        terms_and_conditions: "Anv\xe4ndarvillkor",
                        privacy_policy: "Sekretesspolicy",
                        ccpa_notice: "CCPA-meddelande"
                    }
                },
                newsletters: {
                    submitted: "har framg\xe5ngsrikt lagts till i v\xe5r lista."
                },
                payment: {
                    errors: {
                        empty_form: "Alla f\xe4lt \xe4r obligatoriska.",
                        expired_session: {
                            modal: {
                                text: "Ladda om sidan f\xf6r att forts\xe4tta med ditt k\xf6p."
                            }
                        },
                        invalid_card: "Validering misslyckades med betaltj\xe4nsten. \xc4r kortet giltigt?",
                        network_error: "Ett n\xe4tverksfel uppstod vid kontakt med betaltj\xe4nsten. Var god f\xf6rs\xf6k igen.",
                        unknown_error: "Ett ok\xe4nt fel intr\xe4ffade med betaltj\xe4nsten. Var god f\xf6rs\xf6k igen.",
                        invalid_field: {
                            number: "Ogiltigt kortnummer",
                            cvv: "Ogiltigt s\xe4kerhetskodnummer",
                            expiration_date: "Ogiltigt utg\xe5ngsdatum",
                            postal_code: "Ogiltig postnummer"
                        }
                    }
                },
                jobs: {
                    form: {
                        on_site_location_placeholder: "T.ex: 'T\xe4by, Stockholms l\xe4n', 'G\xf6teborg'",
                        temporary_location_placeholder: "Plats f\xf6r eventuellt arbete p\xe5 plats",
                        hybrid_location_placeholder: "Plats f\xf6r arbetet p\xe5 platsen",
                        full_location_placeholder: "'%{standard_location}' eller f\xf6retagets huvudkontor"
                    }
                }
            }
        }, $((function() {
            var t, i, n;
            return "7", t = {}, (n = (i = $("body").data("tenant-lang") || $("body").data("lang")).split("-")[0]) === i ? t = e[i] : ($.extend(!0, t, e[n]), $.extend(!0, t, e[i])), window.I18n = t
        }))
    }.call(this),
    function() {
        var e, t, i;
        document.addEventListener("DOMContentLoaded", (function() {
            var e;
            e = $("[id='postJob']"), $("[data-js='postJobSubmit']").on("click", (function() {
                e.submit()
            }))
        })), t = function(e) {
            return $.ajax({
                type: "POST",
                url: "/jobs/" + e + "/tracker.js"
            })
        }, i = function(e) {
            return $.ajax({
                type: "GET",
                url: "/jobs/" + e + "/suggestions.js",
                dataType: "script",
                cache: !1
            })
        }, e = function() {
            var e;
            return e = $("#job_salary_currency option:selected").data("symbol"), $("#min-symbol, #max-symbol").html(e)
        }, jQuery((function() {
            var n, o;
            return e(), $(".redactor").length && $R(".redactor", {
                plugins: ["alignment", "video"],
                formatting: ["p", "blockquote", "pre", "h2", "h3", "h4", "h5"],
                minHeight: "250px",
                maxHeight: "350px",
                autoresize: !1,
                source: !0,
                buttons: ["bold", "italic", "underline", "link", "ul", "ol", "format", "html"]
            }), $(".apply-button").on("click", (function() {
                var e;
                return runActionIfAllowed("googleAnalytics", (function() {
                    return ga("send", "event", "apply-button", "click", "apply-button-click")
                })), runActionIfAllowed("googleAnalyticsFour", (function() {
                    return gtag("send", "event", "apply-button", "click", "apply-button-click")
                })), e = $(this).data("button-location"), mixpanel.track("apply button click", $.extend({
                    "button-location": "" + e
                }, $(this).data("mixpanel")))
            })), $(".apply-button.external_apply").on("click", (function() {
                var e;
                return $(this).data("button-location"), e = $(this).data("job-id"), track_click($(this).data("track")), t(e), i(e)
            })), $(".apply-button.modal_apply").on("click", (function() {
                var e;
                return e = $(this).data("job-id"), i(e)
            })), $("#job_apply_url").blur((function() {
                $("#job_apply_url").val().length > 0 && $("#job_apply_email").val("")
            })), $("#apply_method_apply-url").click((function() {
                $(".apply-url").show(), $(".apply-email").hide()
            })), $("#apply_method_apply-email").click((function() {
                $(".apply-url").hide(), $(".apply-email").show()
            })), $("#job_apply_url").length && ($("#job_apply_url").val().length > 0 ? ($(".apply-email").hide(), $("input:radio[name=apply_method]").filter("[value=apply-url]").prop("checked", !0)) : $(".apply-url").hide()), $("#job_location").change((function() {
                "Other" === $(this).val() ? $("#location_other").slideDown("fast") : $("#location_other").slideUp("fast")
            })), $(".location-distance li").click((function() {
                var e, t;
                e = parseInt($(this).attr("data-value"), 10), t = $(this).text(), $("#d").val(e.toString()), $(".distance-button-text").text(t), $(".btn-search").focus()
            })), $("#location-distance-button").length > 0 && (n = 0, (n = parseInt(getParameterByName("d"))) > 0 && ($("#d").val(n.toString()), o = $("ul.location-distance li[data-value='" + n + "']").text(), $(".distance-button-text").text(o))), $("[data-js='postJobUpgrade']").on("change", (function() {
                var e, t;
                e = (t = $(this)).closest(".postJobUpgrade"), t.is(":checked") ? e.addClass("is-active") : e.removeClass("is-active")
            })), $("[data-js='maxAmountToggle']").on("click", (function(e) {
                e.preventDefault(), $(".postJob-compensation-maxWrapper > div").toggleClass("u-hidden"), "postJob-compensation-maxToggleIcon" === $(this).attr("class") && $("[data-js='compensationMaxInput']").val("")
            })), "" !== $("[data-js='compensationMaxInput']").val() && $(".postJob-compensation-maxWrapper > div").toggleClass("u-hidden"), $("#job_salary_currency").on("change", (function() {
                return e()
            }))
        }))
    }.call(this),
    function() {
        document.addEventListener("DOMContentLoaded", (function() {
            var e;
            e = $('[id="form-invoice"]'), $('[data-js="postInvoiceSubmit"]').on("click", (function() {
                e.submit(), $('[data-js="postInvoiceSubmit"]').attr("disabled", "disabled")
            }))
        }))
    }.call(this),
    function() {
        document.addEventListener("DOMContentLoaded", (function() {
            var e;
            Array.from(document.querySelectorAll('[data-js="disableLinkButton"]')).forEach((function(e) {
                e.addEventListener("click", (function(e) {
                    e.target.setAttribute("style", "pointer-events: none"), e.target.setAttribute("disabled", "disabled")
                }))
            })), (e = $('[data-js="employerCarousel"]')).length && (e.on("beforeChange", (function(e, t) {
                var i, n, o;
                n = void 0, o = void 0, i = void 0, i = "vimeo" === (n = $(t.$slider).find(".slick-current")).find("iframe").attr("id") ? {
                    method: "pause",
                    value: "true"
                } : {
                    event: "command",
                    func: "pauseVideo"
                }, void 0 !== (o = n.find("iframe").get(0)) && o.contentWindow.postMessage(JSON.stringify(i), "*")
            })), e.slick({
                arrows: !1,
                dots: !0,
                autoplay: !0,
                autoplaySpeed: 4e3
            }))
        })), jQuery((function() {
            $(window).resize((function() {
                var e;
                e = $("#bc1 :nth-child(2)"), $("#bc1 a:hidden").length > 0 ? e.show() : e.hide()
            })), $("#employer-jobs-search").on("submit", null, (function() {
                return $.get(this.action, $(this).serialize(), null, "script"), !1
            })), $("#employer-jobs-search-query").keyup((function() {
                $(this).val().length >= 3 && $("#employer-jobs-search").submit()
            })), $("#employer-jobs-search-query").on("keyup change", (function() {
                "" === $("#employer-jobs-search-query").val() && $("#employer-jobs-search").submit()
            }))
        }))
    }.call(this), document.addEventListener("DOMContentLoaded", (function() {
        $("#cvv-card").length && $("#cvv-card").popover({
            html: !0
        }), $(".promo-link").click((function() {
            return $(".form-coupon").toggle(), $(".promo-link").toggle()
        })), $('[data-js="promoCode"]').on("click", (function(e) {
            e.preventDefault(), $(this).hide(), $('[data-js="promoCodeInput"]').removeClass("u-hidden")
        })), $('[data-js="paymentPromoVerify"]').on("click", (function() {
            $(this).parent().hide(), $('[data-js="paymentPromoMessage"]').removeClass("u-hidden")
        }))
    }));
var stripeFormSubmitted = !1,
    originalPaymentButtonText = null,
    jQueryFormButtonId = '[data-js="postPaymentSubmit"]',
    stripeElementClasses = {},
    stripeElementStyles = {
        base: {
            iconColor: "#999999",
            color: "#555555",
            lineHeight: "26px",
            fontSize: "16px",
            "::placeholder": {
                color: "#999999"
            }
        }
    },
    stripeElementOptions = {
        classes: stripeElementClasses,
        style: stripeElementStyles
    };
(function() {
    jQuery((function() {
        return $(".location-distance li").on("click", (function() {
            $("#geodistance").val($(this).attr("data-value"))
        })), $("#profiles-search").on("submit", null, (function() {
            return $.get(this.action, $(this).serialize(), null, "script"), !1
        }))
    }))
}).call(this), document.addEventListener("DOMContentLoaded", (function() {
        var e = document.querySelector('[data-js="hideContactInfo"]'),
            t = document.querySelector('[name="hideContactInfo"]');
        if (e) {
            e.addEventListener("click", (function(e) {
                e.preventDefault(), t.submit()
            }));
            var i = document.querySelector('[data-js="hideProfile"]'),
                n = document.querySelector('[name="hideProfile"]');
            i.addEventListener("click", (function(e) {
                e.preventDefault(), n.submit()
            }))
        }
    })), document.addEventListener("DOMContentLoaded", (function() {
        function e() {
            return "ontouchstart" in document || window.DocumentTouch && document instanceof window.DocumentTouch || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0 || !1
        }
        var t = e() ? "is-touch" : "no-touch";
        $("html").addClass(t)
    })),
    function(e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
    }((function(e) {
        "use strict";
        var t = window.Slick || {};
        (t = function() {
            var t = 0;
            return function(i, n) {
                var o, s = this;
                s.defaults = {
                    accessibility: !0,
                    adaptiveHeight: !1,
                    appendArrows: e(i),
                    appendDots: e(i),
                    arrows: !0,
                    asNavFor: null,
                    prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                    nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                    autoplay: !1,
                    autoplaySpeed: 3e3,
                    centerMode: !1,
                    centerPadding: "50px",
                    cssEase: "ease",
                    customPaging: function(t, i) {
                        return e('<button type="button" />').text(i + 1)
                    },
                    dots: !1,
                    dotsClass: "slick-dots",
                    draggable: !0,
                    easing: "linear",
                    edgeFriction: .35,
                    fade: !1,
                    focusOnSelect: !1,
                    focusOnChange: !1,
                    infinite: !0,
                    initialSlide: 0,
                    lazyLoad: "ondemand",
                    mobileFirst: !1,
                    pauseOnHover: !0,
                    pauseOnFocus: !0,
                    pauseOnDotsHover: !1,
                    respondTo: "window",
                    responsive: null,
                    rows: 1,
                    rtl: !1,
                    slide: "",
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 500,
                    swipe: !0,
                    swipeToSlide: !1,
                    touchMove: !0,
                    touchThreshold: 5,
                    useCSS: !0,
                    useTransform: !0,
                    variableWidth: !1,
                    vertical: !1,
                    verticalSwiping: !1,
                    waitForAnimate: !0,
                    zIndex: 1e3
                }, s.initials = {
                    animating: !1,
                    dragging: !1,
                    autoPlayTimer: null,
                    currentDirection: 0,
                    currentLeft: null,
                    currentSlide: 0,
                    direction: 1,
                    $dots: null,
                    listWidth: null,
                    listHeight: null,
                    loadIndex: 0,
                    $nextArrow: null,
                    $prevArrow: null,
                    scrolling: !1,
                    slideCount: null,
                    slideWidth: null,
                    $slideTrack: null,
                    $slides: null,
                    sliding: !1,
                    slideOffset: 0,
                    swipeLeft: null,
                    swiping: !1,
                    $list: null,
                    touchObject: {},
                    transformsEnabled: !1,
                    unslicked: !1
                }, e.extend(s, s.initials), s.activeBreakpoint = null, s.animType = null, s.animProp = null, s.breakpoints = [], s.breakpointSettings = [], s.cssTransitions = !1, s.focussed = !1, s.interrupted = !1, s.hidden = "hidden", s.paused = !0, s.positionProp = null, s.respondTo = null, s.rowCount = 1, s.shouldClick = !0, s.$slider = e(i), s.$slidesCache = null, s.transformType = null, s.transitionType = null, s.visibilityChange = "visibilitychange", s.windowWidth = 0, s.windowTimer = null, o = e(i).data("slick") || {}, s.options = e.extend({}, s.defaults, n, o), s.currentSlide = s.options.initialSlide, s.originalSettings = s.options, void 0 !== document.mozHidden ? (s.hidden = "mozHidden", s.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (s.hidden = "webkitHidden", s.visibilityChange = "webkitvisibilitychange"), s.autoPlay = e.proxy(s.autoPlay, s), s.autoPlayClear = e.proxy(s.autoPlayClear, s), s.autoPlayIterator = e.proxy(s.autoPlayIterator, s), s.changeSlide = e.proxy(s.changeSlide, s), s.clickHandler = e.proxy(s.clickHandler, s), s.selectHandler = e.proxy(s.selectHandler, s), s.setPosition = e.proxy(s.setPosition, s), s.swipeHandler = e.proxy(s.swipeHandler, s), s.dragHandler = e.proxy(s.dragHandler, s), s.keyHandler = e.proxy(s.keyHandler, s), s.instanceUid = t++, s.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, s.registerBreakpoints(), s.init(!0)
            }
        }()).prototype.activateADA = function() {
            this.$slideTrack.find(".slick-active").attr({
                "aria-hidden": "false"
            }).find("a, input, button, select").attr({
                tabindex: "0"
            })
        }, t.prototype.addSlide = t.prototype.slickAdd = function(t, i, n) {
            var o = this;
            if ("boolean" == typeof i) n = i, i = null;
            else if (i < 0 || i >= o.slideCount) return !1;
            o.unload(), "number" == typeof i ? 0 === i && 0 === o.$slides.length ? e(t).appendTo(o.$slideTrack) : n ? e(t).insertBefore(o.$slides.eq(i)) : e(t).insertAfter(o.$slides.eq(i)) : !0 === n ? e(t).prependTo(o.$slideTrack) : e(t).appendTo(o.$slideTrack), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slides.each((function(t, i) {
                e(i).attr("data-slick-index", t)
            })), o.$slidesCache = o.$slides, o.reinit()
        }, t.prototype.animateHeight = function() {
            var e = this;
            if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
                var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                e.$list.animate({
                    height: t
                }, e.options.speed)
            }
        }, t.prototype.animateSlide = function(t, i) {
            var n = {},
                o = this;
            o.animateHeight(), !0 === o.options.rtl && !1 === o.options.vertical && (t = -t), !1 === o.transformsEnabled ? !1 === o.options.vertical ? o.$slideTrack.animate({
                left: t
            }, o.options.speed, o.options.easing, i) : o.$slideTrack.animate({
                top: t
            }, o.options.speed, o.options.easing, i) : !1 === o.cssTransitions ? (!0 === o.options.rtl && (o.currentLeft = -o.currentLeft), e({
                animStart: o.currentLeft
            }).animate({
                animStart: t
            }, {
                duration: o.options.speed,
                easing: o.options.easing,
                step: function(e) {
                    e = Math.ceil(e), !1 === o.options.vertical ? (n[o.animType] = "translate(" + e + "px, 0px)", o.$slideTrack.css(n)) : (n[o.animType] = "translate(0px," + e + "px)", o.$slideTrack.css(n))
                },
                complete: function() {
                    i && i.call()
                }
            })) : (o.applyTransition(), t = Math.ceil(t), !1 === o.options.vertical ? n[o.animType] = "translate3d(" + t + "px, 0px, 0px)" : n[o.animType] = "translate3d(0px," + t + "px, 0px)", o.$slideTrack.css(n), i && setTimeout((function() {
                o.disableTransition(), i.call()
            }), o.options.speed))
        }, t.prototype.getNavTarget = function() {
            var t = this,
                i = t.options.asNavFor;
            return i && null !== i && (i = e(i).not(t.$slider)), i
        }, t.prototype.asNavFor = function(t) {
            var i = this.getNavTarget();
            null !== i && "object" == typeof i && i.each((function() {
                var i = e(this).slick("getSlick");
                i.unslicked || i.slideHandler(t, !0)
            }))
        }, t.prototype.applyTransition = function(e) {
            var t = this,
                i = {};
            !1 === t.options.fade ? i[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : i[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
        }, t.prototype.autoPlay = function() {
            var e = this;
            e.autoPlayClear(), e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
        }, t.prototype.autoPlayClear = function() {
            var e = this;
            e.autoPlayTimer && clearInterval(e.autoPlayTimer)
        }, t.prototype.autoPlayIterator = function() {
            var e = this,
                t = e.currentSlide + e.options.slidesToScroll;
            e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll, e.currentSlide - 1 == 0 && (e.direction = 1))), e.slideHandler(t))
        }, t.prototype.buildArrows = function() {
            var t = this;
            !0 === t.options.arrows && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"), t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"), t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows), !0 !== t.options.infinite && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
                "aria-disabled": "true",
                tabindex: "-1"
            }))
        }, t.prototype.buildDots = function() {
            var t, i, n = this;
            if (!0 === n.options.dots) {
                for (n.$slider.addClass("slick-dotted"), i = e("<ul />").addClass(n.options.dotsClass), t = 0; t <= n.getDotCount(); t += 1) i.append(e("<li />").append(n.options.customPaging.call(this, n, t)));
                n.$dots = i.appendTo(n.options.appendDots), n.$dots.find("li").first().addClass("slick-active")
            }
        }, t.prototype.buildOut = function() {
            var t = this;
            t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), t.slideCount = t.$slides.length, t.$slides.each((function(t, i) {
                e(i).attr("data-slick-index", t).data("originalStyling", e(i).attr("style") || "")
            })), t.$slider.addClass("slick-slider"), t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(), t.$list = t.$slideTrack.wrap('<div class="slick-list"/>').parent(), t.$slideTrack.css("opacity", 0), !0 !== t.options.centerMode && !0 !== t.options.swipeToSlide || (t.options.slidesToScroll = 1), e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"), t.setupInfinite(), t.buildArrows(), t.buildDots(), t.updateDots(), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), !0 === t.options.draggable && t.$list.addClass("draggable")
        }, t.prototype.buildRows = function() {
            var e, t, i, n, o, s, r, a = this;
            if (n = document.createDocumentFragment(), s = a.$slider.children(), a.options.rows > 1) {
                for (r = a.options.slidesPerRow * a.options.rows, o = Math.ceil(s.length / r), e = 0; e < o; e++) {
                    var l = document.createElement("div");
                    for (t = 0; t < a.options.rows; t++) {
                        var d = document.createElement("div");
                        for (i = 0; i < a.options.slidesPerRow; i++) {
                            var c = e * r + (t * a.options.slidesPerRow + i);
                            s.get(c) && d.appendChild(s.get(c))
                        }
                        l.appendChild(d)
                    }
                    n.appendChild(l)
                }
                a.$slider.empty().append(n), a.$slider.children().children().children().css({
                    width: 100 / a.options.slidesPerRow + "%",
                    display: "inline-block"
                })
            }
        }, t.prototype.checkResponsive = function(t, i) {
            var n, o, s, r = this,
                a = !1,
                l = r.$slider.width(),
                d = window.innerWidth || e(window).width();
            if ("window" === r.respondTo ? s = d : "slider" === r.respondTo ? s = l : "min" === r.respondTo && (s = Math.min(d, l)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
                for (n in o = null, r.breakpoints) r.breakpoints.hasOwnProperty(n) && (!1 === r.originalSettings.mobileFirst ? s < r.breakpoints[n] && (o = r.breakpoints[n]) : s > r.breakpoints[n] && (o = r.breakpoints[n]));
                null !== o ? null !== r.activeBreakpoint ? (o !== r.activeBreakpoint || i) && (r.activeBreakpoint = o, "unslick" === r.breakpointSettings[o] ? r.unslick(o) : (r.options = e.extend({}, r.originalSettings, r.breakpointSettings[o]), !0 === t && (r.currentSlide = r.options.initialSlide), r.refresh(t)), a = o) : (r.activeBreakpoint = o, "unslick" === r.breakpointSettings[o] ? r.unslick(o) : (r.options = e.extend({}, r.originalSettings, r.breakpointSettings[o]), !0 === t && (r.currentSlide = r.options.initialSlide), r.refresh(t)), a = o) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === t && (r.currentSlide = r.options.initialSlide), r.refresh(t), a = o), t || !1 === a || r.$slider.trigger("breakpoint", [r, a])
            }
        }, t.prototype.changeSlide = function(t, i) {
            var n, o, s = this,
                r = e(t.currentTarget);
            switch (r.is("a") && t.preventDefault(), r.is("li") || (r = r.closest("li")), n = s.slideCount % s.options.slidesToScroll != 0 ? 0 : (s.slideCount - s.currentSlide) % s.options.slidesToScroll, t.data.message) {
                case "previous":
                    o = 0 === n ? s.options.slidesToScroll : s.options.slidesToShow - n, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide - o, !1, i);
                    break;
                case "next":
                    o = 0 === n ? s.options.slidesToScroll : n, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide + o, !1, i);
                    break;
                case "index":
                    var a = 0 === t.data.index ? 0 : t.data.index || r.index() * s.options.slidesToScroll;
                    s.slideHandler(s.checkNavigable(a), !1, i), r.children().trigger("focus");
                    break;
                default:
                    return
            }
        }, t.prototype.checkNavigable = function(e) {
            var t, i;
            if (i = 0, e > (t = this.getNavigableIndexes())[t.length - 1]) e = t[t.length - 1];
            else
                for (var n in t) {
                    if (e < t[n]) {
                        e = i;
                        break
                    }
                    i = t[n]
                }
            return e
        }, t.prototype.cleanUpEvents = function() {
            var t = this;
            t.options.dots && null !== t.$dots && (e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)), !0 === t.options.accessibility && t.$dots.off("keydown.slick", t.keyHandler)), t.$slider.off("focus.slick blur.slick"), !0 === t.options.arrows && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide), t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide), !0 === t.options.accessibility && (t.$prevArrow && t.$prevArrow.off("keydown.slick", t.keyHandler), t.$nextArrow && t.$nextArrow.off("keydown.slick", t.keyHandler))), t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler), t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler), t.$list.off("touchend.slick mouseup.slick", t.swipeHandler), t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler), t.$list.off("click.slick", t.clickHandler), e(document).off(t.visibilityChange, t.visibility), t.cleanUpSlideEvents(), !0 === t.options.accessibility && t.$list.off("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().off("click.slick", t.selectHandler), e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange), e(window).off("resize.slick.slick-" + t.instanceUid, t.resize), e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault), e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition)
        }, t.prototype.cleanUpSlideEvents = function() {
            var t = this;
            t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1))
        }, t.prototype.cleanUpRows = function() {
            var e, t = this;
            t.options.rows > 1 && ((e = t.$slides.children().children()).removeAttr("style"), t.$slider.empty().append(e))
        }, t.prototype.clickHandler = function(e) {
            !1 === this.shouldClick && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
        }, t.prototype.destroy = function(t) {
            var i = this;
            i.autoPlayClear(), i.touchObject = {}, i.cleanUpEvents(), e(".slick-cloned", i.$slider).detach(), i.$dots && i.$dots.remove(), i.$prevArrow && i.$prevArrow.length && (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()), i.$nextArrow && i.$nextArrow.length && (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()), i.$slides && (i.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each((function() {
                e(this).attr("style", e(this).data("originalStyling"))
            })), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.detach(), i.$list.detach(), i.$slider.append(i.$slides)), i.cleanUpRows(), i.$slider.removeClass("slick-slider"), i.$slider.removeClass("slick-initialized"), i.$slider.removeClass("slick-dotted"), i.unslicked = !0, t || i.$slider.trigger("destroy", [i])
        }, t.prototype.disableTransition = function(e) {
            var t = this,
                i = {};
            i[t.transitionType] = "", !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
        }, t.prototype.fadeSlide = function(e, t) {
            var i = this;
            !1 === i.cssTransitions ? (i.$slides.eq(e).css({
                zIndex: i.options.zIndex
            }), i.$slides.eq(e).animate({
                opacity: 1
            }, i.options.speed, i.options.easing, t)) : (i.applyTransition(e), i.$slides.eq(e).css({
                opacity: 1,
                zIndex: i.options.zIndex
            }), t && setTimeout((function() {
                i.disableTransition(e), t.call()
            }), i.options.speed))
        }, t.prototype.fadeSlideOut = function(e) {
            var t = this;
            !1 === t.cssTransitions ? t.$slides.eq(e).animate({
                opacity: 0,
                zIndex: t.options.zIndex - 2
            }, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e).css({
                opacity: 0,
                zIndex: t.options.zIndex - 2
            }))
        }, t.prototype.filterSlides = t.prototype.slickFilter = function(e) {
            var t = this;
            null !== e && (t.$slidesCache = t.$slides, t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.filter(e).appendTo(t.$slideTrack), t.reinit())
        }, t.prototype.focusHandler = function() {
            var t = this;
            t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", (function(i) {
                i.stopImmediatePropagation();
                var n = e(this);
                setTimeout((function() {
                    t.options.pauseOnFocus && (t.focussed = n.is(":focus"), t.autoPlay())
                }), 0)
            }))
        }, t.prototype.getCurrent = t.prototype.slickCurrentSlide = function() {
            return this.currentSlide
        }, t.prototype.getDotCount = function() {
            var e = this,
                t = 0,
                i = 0,
                n = 0;
            if (!0 === e.options.infinite)
                if (e.slideCount <= e.options.slidesToShow) ++n;
                else
                    for (; t < e.slideCount;) ++n, t = i + e.options.slidesToScroll, i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            else if (!0 === e.options.centerMode) n = e.slideCount;
            else if (e.options.asNavFor)
                for (; t < e.slideCount;) ++n, t = i + e.options.slidesToScroll, i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            else n = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
            return n - 1
        }, t.prototype.getLeft = function(e) {
            var t, i, n, o, s = this,
                r = 0;
            return s.slideOffset = 0, i = s.$slides.first().outerHeight(!0), !0 === s.options.infinite ? (s.slideCount > s.options.slidesToShow && (s.slideOffset = s.slideWidth * s.options.slidesToShow * -1, o = -1, !0 === s.options.vertical && !0 === s.options.centerMode && (2 === s.options.slidesToShow ? o = -1.5 : 1 === s.options.slidesToShow && (o = -2)), r = i * s.options.slidesToShow * o), s.slideCount % s.options.slidesToScroll != 0 && e + s.options.slidesToScroll > s.slideCount && s.slideCount > s.options.slidesToShow && (e > s.slideCount ? (s.slideOffset = (s.options.slidesToShow - (e - s.slideCount)) * s.slideWidth * -1, r = (s.options.slidesToShow - (e - s.slideCount)) * i * -1) : (s.slideOffset = s.slideCount % s.options.slidesToScroll * s.slideWidth * -1, r = s.slideCount % s.options.slidesToScroll * i * -1))) : e + s.options.slidesToShow > s.slideCount && (s.slideOffset = (e + s.options.slidesToShow - s.slideCount) * s.slideWidth, r = (e + s.options.slidesToShow - s.slideCount) * i), s.slideCount <= s.options.slidesToShow && (s.slideOffset = 0, r = 0), !0 === s.options.centerMode && s.slideCount <= s.options.slidesToShow ? s.slideOffset = s.slideWidth * Math.floor(s.options.slidesToShow) / 2 - s.slideWidth * s.slideCount / 2 : !0 === s.options.centerMode && !0 === s.options.infinite ? s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2) - s.slideWidth : !0 === s.options.centerMode && (s.slideOffset = 0, s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2)), t = !1 === s.options.vertical ? e * s.slideWidth * -1 + s.slideOffset : e * i * -1 + r, !0 === s.options.variableWidth && (n = s.slideCount <= s.options.slidesToShow || !1 === s.options.infinite ? s.$slideTrack.children(".slick-slide").eq(e) : s.$slideTrack.children(".slick-slide").eq(e + s.options.slidesToShow), t = !0 === s.options.rtl ? n[0] ? -1 * (s.$slideTrack.width() - n[0].offsetLeft - n.width()) : 0 : n[0] ? -1 * n[0].offsetLeft : 0, !0 === s.options.centerMode && (n = s.slideCount <= s.options.slidesToShow || !1 === s.options.infinite ? s.$slideTrack.children(".slick-slide").eq(e) : s.$slideTrack.children(".slick-slide").eq(e + s.options.slidesToShow + 1), t = !0 === s.options.rtl ? n[0] ? -1 * (s.$slideTrack.width() - n[0].offsetLeft - n.width()) : 0 : n[0] ? -1 * n[0].offsetLeft : 0, t += (s.$list.width() - n.outerWidth()) / 2)), t
        }, t.prototype.getOption = t.prototype.slickGetOption = function(e) {
            return this.options[e]
        }, t.prototype.getNavigableIndexes = function() {
            var e, t = this,
                i = 0,
                n = 0,
                o = [];
            for (!1 === t.options.infinite ? e = t.slideCount : (i = -1 * t.options.slidesToScroll, n = -1 * t.options.slidesToScroll, e = 2 * t.slideCount); i < e;) o.push(i), i = n + t.options.slidesToScroll, n += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
            return o
        }, t.prototype.getSlick = function() {
            return this
        }, t.prototype.getSlideCount = function() {
            var t, i, n = this;
            return i = !0 === n.options.centerMode ? n.slideWidth * Math.floor(n.options.slidesToShow / 2) : 0, !0 === n.options.swipeToSlide ? (n.$slideTrack.find(".slick-slide").each((function(o, s) {
                if (s.offsetLeft - i + e(s).outerWidth() / 2 > -1 * n.swipeLeft) return t = s, !1
            })), Math.abs(e(t).attr("data-slick-index") - n.currentSlide) || 1) : n.options.slidesToScroll
        }, t.prototype.goTo = t.prototype.slickGoTo = function(e, t) {
            this.changeSlide({
                data: {
                    message: "index",
                    index: parseInt(e)
                }
            }, t)
        }, t.prototype.init = function(t) {
            var i = this;
            e(i.$slider).hasClass("slick-initialized") || (e(i.$slider).addClass("slick-initialized"), i.buildRows(), i.buildOut(), i.setProps(), i.startLoad(), i.loadSlider(), i.initializeEvents(), i.updateArrows(), i.updateDots(), i.checkResponsive(!0), i.focusHandler()), t && i.$slider.trigger("init", [i]), !0 === i.options.accessibility && i.initADA(), i.options.autoplay && (i.paused = !1, i.autoPlay())
        }, t.prototype.initADA = function() {
            var t = this,
                i = Math.ceil(t.slideCount / t.options.slidesToShow),
                n = t.getNavigableIndexes().filter((function(e) {
                    return e >= 0 && e < t.slideCount
                }));
            t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
                "aria-hidden": "true",
                tabindex: "-1"
            }).find("a, input, button, select").attr({
                tabindex: "-1"
            }), null !== t.$dots && (t.$slides.not(t.$slideTrack.find(".slick-cloned")).each((function(i) {
                var o = n.indexOf(i);
                e(this).attr({
                    role: "tabpanel",
                    id: "slick-slide" + t.instanceUid + i,
                    tabindex: -1
                }), -1 !== o && e(this).attr({
                    "aria-describedby": "slick-slide-control" + t.instanceUid + o
                })
            })), t.$dots.attr("role", "tablist").find("li").each((function(o) {
                var s = n[o];
                e(this).attr({
                    role: "presentation"
                }), e(this).find("button").first().attr({
                    role: "tab",
                    id: "slick-slide-control" + t.instanceUid + o,
                    "aria-controls": "slick-slide" + t.instanceUid + s,
                    "aria-label": o + 1 + " of " + i,
                    "aria-selected": null,
                    tabindex: "-1"
                })
            })).eq(t.currentSlide).find("button").attr({
                "aria-selected": "true",
                tabindex: "0"
            }).end());
            for (var o = t.currentSlide, s = o + t.options.slidesToShow; o < s; o++) t.$slides.eq(o).attr("tabindex", 0);
            t.activateADA()
        }, t.prototype.initArrowEvents = function() {
            var e = this;
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
                message: "previous"
            }, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", {
                message: "next"
            }, e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler), e.$nextArrow.on("keydown.slick", e.keyHandler)))
        }, t.prototype.initDotEvents = function() {
            var t = this;
            !0 === t.options.dots && (e("li", t.$dots).on("click.slick", {
                message: "index"
            }, t.changeSlide), !0 === t.options.accessibility && t.$dots.on("keydown.slick", t.keyHandler)), !0 === t.options.dots && !0 === t.options.pauseOnDotsHover && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1))
        }, t.prototype.initSlideEvents = function() {
            var t = this;
            t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)))
        }, t.prototype.initializeEvents = function() {
            var t = this;
            t.initArrowEvents(), t.initDotEvents(), t.initSlideEvents(), t.$list.on("touchstart.slick mousedown.slick", {
                action: "start"
            }, t.swipeHandler), t.$list.on("touchmove.slick mousemove.slick", {
                action: "move"
            }, t.swipeHandler), t.$list.on("touchend.slick mouseup.slick", {
                action: "end"
            }, t.swipeHandler), t.$list.on("touchcancel.slick mouseleave.slick", {
                action: "end"
            }, t.swipeHandler), t.$list.on("click.slick", t.clickHandler), e(document).on(t.visibilityChange, e.proxy(t.visibility, t)), !0 === t.options.accessibility && t.$list.on("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)), e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)), e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault), e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition), e(t.setPosition)
        }, t.prototype.initUI = function() {
            var e = this;
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
        }, t.prototype.keyHandler = function(e) {
            var t = this;
            e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
                data: {
                    message: !0 === t.options.rtl ? "next" : "previous"
                }
            }) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
                data: {
                    message: !0 === t.options.rtl ? "previous" : "next"
                }
            }))
        }, t.prototype.lazyLoad = function() {
            function t(t) {
                e("img[data-lazy]", t).each((function() {
                    var t = e(this),
                        i = e(this).attr("data-lazy"),
                        n = e(this).attr("data-srcset"),
                        o = e(this).attr("data-sizes") || s.$slider.attr("data-sizes"),
                        r = document.createElement("img");
                    r.onload = function() {
                        t.animate({
                            opacity: 0
                        }, 100, (function() {
                            n && (t.attr("srcset", n), o && t.attr("sizes", o)), t.attr("src", i).animate({
                                opacity: 1
                            }, 200, (function() {
                                t.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                            })), s.$slider.trigger("lazyLoaded", [s, t, i])
                        }))
                    }, r.onerror = function() {
                        t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), s.$slider.trigger("lazyLoadError", [s, t, i])
                    }, r.src = i
                }))
            }
            var i, n, o, s = this;
            if (!0 === s.options.centerMode ? !0 === s.options.infinite ? o = (n = s.currentSlide + (s.options.slidesToShow / 2 + 1)) + s.options.slidesToShow + 2 : (n = Math.max(0, s.currentSlide - (s.options.slidesToShow / 2 + 1)), o = s.options.slidesToShow / 2 + 1 + 2 + s.currentSlide) : (n = s.options.infinite ? s.options.slidesToShow + s.currentSlide : s.currentSlide, o = Math.ceil(n + s.options.slidesToShow), !0 === s.options.fade && (n > 0 && n--, o <= s.slideCount && o++)), i = s.$slider.find(".slick-slide").slice(n, o), "anticipated" === s.options.lazyLoad)
                for (var r = n - 1, a = o, l = s.$slider.find(".slick-slide"), d = 0; d < s.options.slidesToScroll; d++) r < 0 && (r = s.slideCount - 1), i = (i = i.add(l.eq(r))).add(l.eq(a)), r--, a++;
            t(i), s.slideCount <= s.options.slidesToShow ? t(s.$slider.find(".slick-slide")) : s.currentSlide >= s.slideCount - s.options.slidesToShow ? t(s.$slider.find(".slick-cloned").slice(0, s.options.slidesToShow)) : 0 === s.currentSlide && t(s.$slider.find(".slick-cloned").slice(-1 * s.options.slidesToShow))
        }, t.prototype.loadSlider = function() {
            var e = this;
            e.setPosition(), e.$slideTrack.css({
                opacity: 1
            }), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
        }, t.prototype.next = t.prototype.slickNext = function() {
            this.changeSlide({
                data: {
                    message: "next"
                }
            })
        }, t.prototype.orientationChange = function() {
            var e = this;
            e.checkResponsive(), e.setPosition()
        }, t.prototype.pause = t.prototype.slickPause = function() {
            var e = this;
            e.autoPlayClear(), e.paused = !0
        }, t.prototype.play = t.prototype.slickPlay = function() {
            var e = this;
            e.autoPlay(), e.options.autoplay = !0, e.paused = !1, e.focussed = !1, e.interrupted = !1
        }, t.prototype.postSlide = function(t) {
            var i = this;
            i.unslicked || (i.$slider.trigger("afterChange", [i, t]), i.animating = !1, i.slideCount > i.options.slidesToShow && i.setPosition(), i.swipeLeft = null, i.options.autoplay && i.autoPlay(), !0 === i.options.accessibility && (i.initADA(), i.options.focusOnChange && e(i.$slides.get(i.currentSlide)).attr("tabindex", 0).focus()))
        }, t.prototype.prev = t.prototype.slickPrev = function() {
            this.changeSlide({
                data: {
                    message: "previous"
                }
            })
        }, t.prototype.preventDefault = function(e) {
            e.preventDefault()
        }, t.prototype.progressiveLazyLoad = function(t) {
            t = t || 1;
            var i, n, o, s, r, a = this,
                l = e("img[data-lazy]", a.$slider);
            l.length ? (i = l.first(), n = i.attr("data-lazy"), o = i.attr("data-srcset"), s = i.attr("data-sizes") || a.$slider.attr("data-sizes"), (r = document.createElement("img")).onload = function() {
                o && (i.attr("srcset", o), s && i.attr("sizes", s)), i.attr("src", n).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === a.options.adaptiveHeight && a.setPosition(), a.$slider.trigger("lazyLoaded", [a, i, n]), a.progressiveLazyLoad()
            }, r.onerror = function() {
                t < 3 ? setTimeout((function() {
                    a.progressiveLazyLoad(t + 1)
                }), 500) : (i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), a.$slider.trigger("lazyLoadError", [a, i, n]), a.progressiveLazyLoad())
            }, r.src = n) : a.$slider.trigger("allImagesLoaded", [a])
        }, t.prototype.refresh = function(t) {
            var i, n, o = this;
            n = o.slideCount - o.options.slidesToShow, !o.options.infinite && o.currentSlide > n && (o.currentSlide = n), o.slideCount <= o.options.slidesToShow && (o.currentSlide = 0), i = o.currentSlide, o.destroy(!0), e.extend(o, o.initials, {
                currentSlide: i
            }), o.init(), t || o.changeSlide({
                data: {
                    message: "index",
                    index: i
                }
            }, !1)
        }, t.prototype.registerBreakpoints = function() {
            var t, i, n, o = this,
                s = o.options.responsive || null;
            if ("array" === e.type(s) && s.length) {
                for (t in o.respondTo = o.options.respondTo || "window", s)
                    if (n = o.breakpoints.length - 1, s.hasOwnProperty(t)) {
                        for (i = s[t].breakpoint; n >= 0;) o.breakpoints[n] && o.breakpoints[n] === i && o.breakpoints.splice(n, 1), n--;
                        o.breakpoints.push(i), o.breakpointSettings[i] = s[t].settings
                    }
                o.breakpoints.sort((function(e, t) {
                    return o.options.mobileFirst ? e - t : t - e
                }))
            }
        }, t.prototype.reinit = function() {
            var t = this;
            t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"), t.slideCount = t.$slides.length, t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll), t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0), t.registerBreakpoints(), t.setProps(), t.setupInfinite(), t.buildArrows(), t.updateArrows(), t.initArrowEvents(), t.buildDots(), t.updateDots(), t.initDotEvents(), t.cleanUpSlideEvents(), t.initSlideEvents(), t.checkResponsive(!1, !0), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), t.setPosition(), t.focusHandler(), t.paused = !t.options.autoplay, t.autoPlay(), t.$slider.trigger("reInit", [t])
        }, t.prototype.resize = function() {
            var t = this;
            e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay), t.windowDelay = window.setTimeout((function() {
                t.windowWidth = e(window).width(), t.checkResponsive(), t.unslicked || t.setPosition()
            }), 50))
        }, t.prototype.removeSlide = t.prototype.slickRemove = function(e, t, i) {
            var n = this;
            if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : n.slideCount - 1 : !0 === t ? --e : e, n.slideCount < 1 || e < 0 || e > n.slideCount - 1) return !1;
            n.unload(), !0 === i ? n.$slideTrack.children().remove() : n.$slideTrack.children(this.options.slide).eq(e).remove(), n.$slides = n.$slideTrack.children(this.options.slide), n.$slideTrack.children(this.options.slide).detach(), n.$slideTrack.append(n.$slides), n.$slidesCache = n.$slides, n.reinit()
        }, t.prototype.setCSS = function(e) {
            var t, i, n = this,
                o = {};
            !0 === n.options.rtl && (e = -e), t = "left" == n.positionProp ? Math.ceil(e) + "px" : "0px", i = "top" == n.positionProp ? Math.ceil(e) + "px" : "0px", o[n.positionProp] = e, !1 === n.transformsEnabled ? n.$slideTrack.css(o) : (o = {}, !1 === n.cssTransitions ? (o[n.animType] = "translate(" + t + ", " + i + ")", n.$slideTrack.css(o)) : (o[n.animType] = "translate3d(" + t + ", " + i + ", 0px)", n.$slideTrack.css(o)))
        }, t.prototype.setDimensions = function() {
            var e = this;
            !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
                padding: "0px " + e.options.centerPadding
            }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), !0 === e.options.centerMode && e.$list.css({
                padding: e.options.centerPadding + " 0px"
            })), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
            var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
            !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
        }, t.prototype.setFade = function() {
            var t, i = this;
            i.$slides.each((function(n, o) {
                t = i.slideWidth * n * -1, !0 === i.options.rtl ? e(o).css({
                    position: "relative",
                    right: t,
                    top: 0,
                    zIndex: i.options.zIndex - 2,
                    opacity: 0
                }) : e(o).css({
                    position: "relative",
                    left: t,
                    top: 0,
                    zIndex: i.options.zIndex - 2,
                    opacity: 0
                })
            })), i.$slides.eq(i.currentSlide).css({
                zIndex: i.options.zIndex - 1,
                opacity: 1
            })
        }, t.prototype.setHeight = function() {
            var e = this;
            if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
                var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                e.$list.css("height", t)
            }
        }, t.prototype.setOption = t.prototype.slickSetOption = function() {
            var t, i, n, o, s, r = this,
                a = !1;
            if ("object" === e.type(arguments[0]) ? (n = arguments[0], a = arguments[1], s = "multiple") : "string" === e.type(arguments[0]) && (n = arguments[0], o = arguments[1], a = arguments[2], "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? s = "responsive" : void 0 !== arguments[1] && (s = "single")), "single" === s) r.options[n] = o;
            else if ("multiple" === s) e.each(n, (function(e, t) {
                r.options[e] = t
            }));
            else if ("responsive" === s)
                for (i in o)
                    if ("array" !== e.type(r.options.responsive)) r.options.responsive = [o[i]];
                    else {
                        for (t = r.options.responsive.length - 1; t >= 0;) r.options.responsive[t].breakpoint === o[i].breakpoint && r.options.responsive.splice(t, 1), t--;
                        r.options.responsive.push(o[i])
                    }
            a && (r.unload(), r.reinit())
        }, t.prototype.setPosition = function() {
            var e = this;
            e.setDimensions(), e.setHeight(), !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
        }, t.prototype.setProps = function() {
            var e = this,
                t = document.body.style;
            e.positionProp = !0 === e.options.vertical ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), void 0 !== t.OTransform && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.MozTransform && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)), void 0 !== t.webkitTransform && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.msTransform && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", void 0 === t.msTransform && (e.animType = !1)), void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
        }, t.prototype.setSlideClasses = function(e) {
            var t, i, n, o, s = this;
            if (i = s.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), s.$slides.eq(e).addClass("slick-current"), !0 === s.options.centerMode) {
                var r = s.options.slidesToShow % 2 == 0 ? 1 : 0;
                t = Math.floor(s.options.slidesToShow / 2), !0 === s.options.infinite && (e >= t && e <= s.slideCount - 1 - t ? s.$slides.slice(e - t + r, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (n = s.options.slidesToShow + e, i.slice(n - t + 1 + r, n + t + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === e ? i.eq(i.length - 1 - s.options.slidesToShow).addClass("slick-center") : e === s.slideCount - 1 && i.eq(s.options.slidesToShow).addClass("slick-center")), s.$slides.eq(e).addClass("slick-center")
            } else e >= 0 && e <= s.slideCount - s.options.slidesToShow ? s.$slides.slice(e, e + s.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= s.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (o = s.slideCount % s.options.slidesToShow, n = !0 === s.options.infinite ? s.options.slidesToShow + e : e, s.options.slidesToShow == s.options.slidesToScroll && s.slideCount - e < s.options.slidesToShow ? i.slice(n - (s.options.slidesToShow - o), n + o).addClass("slick-active").attr("aria-hidden", "false") : i.slice(n, n + s.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
            "ondemand" !== s.options.lazyLoad && "anticipated" !== s.options.lazyLoad || s.lazyLoad()
        }, t.prototype.setupInfinite = function() {
            var t, i, n, o = this;
            if (!0 === o.options.fade && (o.options.centerMode = !1), !0 === o.options.infinite && !1 === o.options.fade && (i = null, o.slideCount > o.options.slidesToShow)) {
                for (n = !0 === o.options.centerMode ? o.options.slidesToShow + 1 : o.options.slidesToShow, t = o.slideCount; t > o.slideCount - n; t -= 1) i = t - 1, e(o.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i - o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");
                for (t = 0; t < n + o.slideCount; t += 1) i = t, e(o.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i + o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");
                o.$slideTrack.find(".slick-cloned").find("[id]").each((function() {
                    e(this).attr("id", "")
                }))
            }
        }, t.prototype.interrupt = function(e) {
            var t = this;
            e || t.autoPlay(), t.interrupted = e
        }, t.prototype.selectHandler = function(t) {
            var i = this,
                n = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide"),
                o = parseInt(n.attr("data-slick-index"));
            o || (o = 0), i.slideCount <= i.options.slidesToShow ? i.slideHandler(o, !1, !0) : i.slideHandler(o)
        }, t.prototype.slideHandler = function(e, t, i) {
            var n, o, s, r, a, l = null,
                d = this;
            if (t = t || !1, !(!0 === d.animating && !0 === d.options.waitForAnimate || !0 === d.options.fade && d.currentSlide === e))
                if (!1 === t && d.asNavFor(e), n = e, l = d.getLeft(n), r = d.getLeft(d.currentSlide), d.currentLeft = null === d.swipeLeft ? r : d.swipeLeft, !1 === d.options.infinite && !1 === d.options.centerMode && (e < 0 || e > d.getDotCount() * d.options.slidesToScroll)) !1 === d.options.fade && (n = d.currentSlide, !0 !== i ? d.animateSlide(r, (function() {
                    d.postSlide(n)
                })) : d.postSlide(n));
                else if (!1 === d.options.infinite && !0 === d.options.centerMode && (e < 0 || e > d.slideCount - d.options.slidesToScroll)) !1 === d.options.fade && (n = d.currentSlide, !0 !== i ? d.animateSlide(r, (function() {
                d.postSlide(n)
            })) : d.postSlide(n));
            else {
                if (d.options.autoplay && clearInterval(d.autoPlayTimer), o = n < 0 ? d.slideCount % d.options.slidesToScroll != 0 ? d.slideCount - d.slideCount % d.options.slidesToScroll : d.slideCount + n : n >= d.slideCount ? d.slideCount % d.options.slidesToScroll != 0 ? 0 : n - d.slideCount : n, d.animating = !0, d.$slider.trigger("beforeChange", [d, d.currentSlide, o]), s = d.currentSlide, d.currentSlide = o, d.setSlideClasses(d.currentSlide), d.options.asNavFor && (a = (a = d.getNavTarget()).slick("getSlick")).slideCount <= a.options.slidesToShow && a.setSlideClasses(d.currentSlide), d.updateDots(), d.updateArrows(), !0 === d.options.fade) return !0 !== i ? (d.fadeSlideOut(s), d.fadeSlide(o, (function() {
                    d.postSlide(o)
                }))) : d.postSlide(o), void d.animateHeight();
                !0 !== i ? d.animateSlide(l, (function() {
                    d.postSlide(o)
                })) : d.postSlide(o)
            }
        }, t.prototype.startLoad = function() {
            var e = this;
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
        }, t.prototype.swipeDirection = function() {
            var e, t, i, n, o = this;
            return e = o.touchObject.startX - o.touchObject.curX, t = o.touchObject.startY - o.touchObject.curY, i = Math.atan2(t, e), (n = Math.round(180 * i / Math.PI)) < 0 && (n = 360 - Math.abs(n)), n <= 45 && n >= 0 || n <= 360 && n >= 315 ? !1 === o.options.rtl ? "left" : "right" : n >= 135 && n <= 225 ? !1 === o.options.rtl ? "right" : "left" : !0 === o.options.verticalSwiping ? n >= 35 && n <= 135 ? "down" : "up" : "vertical"
        }, t.prototype.swipeEnd = function() {
            var e, t, i = this;
            if (i.dragging = !1, i.swiping = !1, i.scrolling) return i.scrolling = !1, !1;
            if (i.interrupted = !1, i.shouldClick = !(i.touchObject.swipeLength > 10), void 0 === i.touchObject.curX) return !1;
            if (!0 === i.touchObject.edgeHit && i.$slider.trigger("edge", [i, i.swipeDirection()]), i.touchObject.swipeLength >= i.touchObject.minSwipe) {
                switch (t = i.swipeDirection()) {
                    case "left":
                    case "down":
                        e = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide + i.getSlideCount()) : i.currentSlide + i.getSlideCount(), i.currentDirection = 0;
                        break;
                    case "right":
                    case "up":
                        e = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide - i.getSlideCount()) : i.currentSlide - i.getSlideCount(), i.currentDirection = 1
                }
                "vertical" != t && (i.slideHandler(e), i.touchObject = {}, i.$slider.trigger("swipe", [i, t]))
            } else i.touchObject.startX !== i.touchObject.curX && (i.slideHandler(i.currentSlide), i.touchObject = {})
        }, t.prototype.swipeHandler = function(e) {
            var t = this;
            if (!(!1 === t.options.swipe || "ontouchend" in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
                case "start":
                    t.swipeStart(e);
                    break;
                case "move":
                    t.swipeMove(e);
                    break;
                case "end":
                    t.swipeEnd(e)
            }
        }, t.prototype.swipeMove = function(e) {
            var t, i, n, o, s, r, a = this;
            return s = void 0 !== e.originalEvent ? e.originalEvent.touches : null, !(!a.dragging || a.scrolling || s && 1 !== s.length) && (t = a.getLeft(a.currentSlide), a.touchObject.curX = void 0 !== s ? s[0].pageX : e.clientX, a.touchObject.curY = void 0 !== s ? s[0].pageY : e.clientY, a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2))), !a.options.verticalSwiping && !a.swiping && r > 4 ? (a.scrolling = !0, !1) : (!0 === a.options.verticalSwiping && (a.touchObject.swipeLength = r), i = a.swipeDirection(), void 0 !== e.originalEvent && a.touchObject.swipeLength > 4 && (a.swiping = !0, e.preventDefault()), o = (!1 === a.options.rtl ? 1 : -1) * (a.touchObject.curX > a.touchObject.startX ? 1 : -1), !0 === a.options.verticalSwiping && (o = a.touchObject.curY > a.touchObject.startY ? 1 : -1), n = a.touchObject.swipeLength, a.touchObject.edgeHit = !1, !1 === a.options.infinite && (0 === a.currentSlide && "right" === i || a.currentSlide >= a.getDotCount() && "left" === i) && (n = a.touchObject.swipeLength * a.options.edgeFriction, a.touchObject.edgeHit = !0), !1 === a.options.vertical ? a.swipeLeft = t + n * o : a.swipeLeft = t + n * (a.$list.height() / a.listWidth) * o, !0 === a.options.verticalSwiping && (a.swipeLeft = t + n * o), !0 !== a.options.fade && !1 !== a.options.touchMove && (!0 === a.animating ? (a.swipeLeft = null, !1) : void a.setCSS(a.swipeLeft))))
        }, t.prototype.swipeStart = function(e) {
            var t, i = this;
            if (i.interrupted = !0, 1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow) return i.touchObject = {}, !1;
            void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]), i.touchObject.startX = i.touchObject.curX = void 0 !== t ? t.pageX : e.clientX, i.touchObject.startY = i.touchObject.curY = void 0 !== t ? t.pageY : e.clientY, i.dragging = !0
        }, t.prototype.unfilterSlides = t.prototype.slickUnfilter = function() {
            var e = this;
            null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
        }, t.prototype.unload = function() {
            var t = this;
            e(".slick-cloned", t.$slider).remove(), t.$dots && t.$dots.remove(), t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(), t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(), t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
        }, t.prototype.unslick = function(e) {
            var t = this;
            t.$slider.trigger("unslick", [t, e]), t.destroy()
        }, t.prototype.updateArrows = function() {
            var e = this;
            Math.floor(e.options.slidesToShow / 2), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : (e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode || e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode) && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
        }, t.prototype.updateDots = function() {
            var e = this;
            null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").end(), e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
        }, t.prototype.visibility = function() {
            var e = this;
            e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
        }, e.fn.slick = function() {
            var e, i, n = this,
                o = arguments[0],
                s = Array.prototype.slice.call(arguments, 1),
                r = n.length;
            for (e = 0; e < r; e++)
                if ("object" == typeof o || void 0 === o ? n[e].slick = new t(n[e], o) : i = n[e].slick[o].apply(n[e].slick, s), void 0 !== i) return i;
            return n
        }
    }));
var optimizedResize = function() {
    function e() {
        o || (o = !0, window.requestAnimationFrame ? window.requestAnimationFrame(t) : setTimeout(t, 66))
    }

    function t() {
        n.forEach((function(e) {
            e()
        })), o = !1
    }

    function i(e) {
        e && n.push(e)
    }
    var n = [],
        o = !1;
    return {
        add: function(t) {
            n.length || window.addEventListener("resize", e), i(t)
        }
    }
}();
document.addEventListener("DOMContentLoaded", (function() {
        $('[data-js="navLinks"] li a').each((function() {
            linkurl = $(this).attr("href").replace(/\/?$/, "/"), locationurl = window.location.href.replace(/\/?$/, "/"), linkurl === locationurl && $(this).parent("li").addClass("active")
        }))
    })), document.addEventListener("DOMContentLoaded", (function() {
        $("#header-nav").on("show.bs.collapse", (function() {
            $('[href="#header-nav"] span').toggleClass("hidden")
        })), $("#header-nav").on("hide.bs.collapse", (function() {
            $('[href="#header-nav"] span').toggleClass("hidden")
        }))
    })), document.addEventListener("DOMContentLoaded", (function() {
        function e(e) {
            return null === e.target.closest(".search-panel .search-panelInner") && i(), !1
        }

        function t() {
            document.body.classList.add("has-openPanel"), setTimeout((function() {
                document.addEventListener("click", e, !1)
            }), 1)
        }

        function i() {
            document.body.classList.remove("has-openPanel"), setTimeout((function() {
                document.removeEventListener("click", e, !1)
            }), 1)
        }($("#subscribe").on("show.bs.collapse", (function() {
            $(".results-subscribePanel").toggleClass("is-open"), $(".results-subscribeToggle span").toggleClass("hidden")
        })), $("#subscribe").on("hide.bs.collapse", (function() {
            $(".results-subscribePanel").toggleClass("is-open"), $(".results-subscribeToggle span").toggleClass("hidden")
        })), $("#search_sort_attribute").change((function() {
            window.location.href = $(this).find(":selected").data("url")
        })), document.querySelector(".search-panel")) && (document.querySelector('[data-js="refineSearchToggle"]').addEventListener("click", (function(e) {
            e.preventDefault(), t()
        })), document.querySelector('[data-js="closeSearchPanel"]').addEventListener("click", (function(e) {
            e.preventDefault(), i()
        })), window.optimizedResize.add((function() {
            window.matchMedia("(min-width: 768px)").matches && document.body.classList.contains("has-openPanel") && i()
        })))
    })),
    function() {
        jQuery((function() {
            return $("body").on("click", ".results-more", (function() {
                var e;
                $(this).addClass("hidden"), (e = $(this).closest(".results-options")).find(".results-more-facets").removeClass("hidden"), e.find(".results-less").removeClass("hidden")
            })), $("body").on("click", ".results-less", (function() {
                var e;
                $(this).addClass("hidden"), (e = $(this).closest(".results-options")).find(".results-more-facets").addClass("hidden"), e.find(".results-more").removeClass("hidden")
            }))
        }))
    }.call(this), window.mobileSearch = window.mobileSearch || {}, mobileSearch.visible = !1, document.addEventListener("DOMContentLoaded", (function() {
        var e = $('[data-js="searchPanelToggleWithHide"]');
        window.mobileSearch.fullSize = mobileWidth(), $('[data-js="searchPanel"]') && (mobileWidth() ? e.show() : e.hide(), window.optimizedResize.add(mobileSearchResize), $('[data-js="searchPanelToggle"]').on("click", toggleMobileSearchBar), e.on("click", toggleMobileSearchBar))
    })), document.addEventListener("DOMContentLoaded", (function() {
        if (document.querySelector(".siteSearch")) {
            var e = $("#search_slugs"),
                t = $("#taxonomyLabel");
            $(".siteSearch-taxonomy ul.siteSearch-dropdown li").on("click", (function(i) {
                var n = $(this).find("a");
                i.preventDefault(), e.val(n.data("taxonomy")), t.text(n.text())
            }));
            var i = document.querySelector("#d"),
                n = Array.prototype.slice.call(document.querySelectorAll("[data-distance]")),
                o = document.querySelector('[data-js="distanceLabel"]'),
                s = getParameterByName("d");
            if (s.length > 0) {
                var r = $(".siteSearch-dropdown").find("[data-distance='" + s + "']");
                o.innerHTML = r.text()
            }
            n.forEach((function(e) {
                e.addEventListener("click", (function(t) {
                    t.preventDefault(), i.value = e.getAttribute("data-distance"), o.innerHTML = e.innerHTML
                }))
            }));
            var a = document.querySelector('[name="l"]'),
                l = Array.prototype.slice.call(document.querySelectorAll("[data-location]")),
                d = document.querySelector('[data-js="locationLabel"]');
            l.forEach((function(e) {
                e.addEventListener("click", (function(t) {
                    t.preventDefault(), a.value = e.innerHTML, d.innerHTML = e.innerHTML
                }))
            })), $(".btn-search").click((function() {
                $(':input[value=""]').attr("disabled", !0)
            })), $.fn.clearInput && $("#q").clearInput()
        }
    })), document.addEventListener("DOMContentLoaded", (function() {
        var e = $('[data-js="moreTrigger"]');
        e.on("click", (function(t) {
            t.preventDefault();
            var i = $(e.attr("href"));
            i && ($("span", e).toggleClass("u-hidden"), i.toggleClass("u-hidden"))
        }))
    })),
    function() {
        jQuery((function() {
            return $("#need_consent_modal").modal("show"), $(".consent_form").on("click", "#tc_pp_consented", (function() {
                var e;
                return e = $(this).is(":checked"), $(".consent_form").find("[data-doc_type=terms_and_conditions], [data-doc_type=privacy_policy]").val(e)
            }))
        }))
    }.call(this);
var URI = function() {
    function e() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t - 0] = arguments[t];
        if (1 < e.length) {
            e[0] = e[0].slice(0, -1);
            t = e.length - 1;
            for (var i = 1; i < t; ++i) e[i] = e[i].slice(1, -1);
            return e[t] = e[t].slice(1), e.join("")
        }
        return e[0]
    }

    function t(e) {
        return 16 > (e = e.charCodeAt(0)) ? "%0" + e.toString(16).toUpperCase() : 128 > e ? "%" + e.toString(16).toUpperCase() : 2048 > e ? "%" + (e >> 6 | 192).toString(16).toUpperCase() + "%" + (63 & e | 128).toString(16).toUpperCase() : "%" + (e >> 12 | 224).toString(16).toUpperCase() + "%" + (e >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (63 & e | 128).toString(16).toUpperCase()
    }

    function i(e) {
        for (var t, i, n, o = "", s = 0, r = e.length; s < r;) 128 > (t = parseInt(e.substr(s + 1, 2), 16)) ? (o += String.fromCharCode(t), s += 3) : 194 <= t && 224 > t ? (6 <= r - s ? (i = parseInt(e.substr(s + 4, 2), 16), o += String.fromCharCode((31 & t) << 6 | 63 & i)) : o += e.substr(s, 6), s += 6) : 224 <= t ? (9 <= r - s ? (i = parseInt(e.substr(s + 4, 2), 16), n = parseInt(e.substr(s + 7, 2), 16), o += String.fromCharCode((15 & t) << 12 | (63 & i) << 6 | 63 & n)) : o += e.substr(s, 9), s += 9) : (o += e.substr(s, 3), s += 3);
        return o
    }

    function n(e) {
        return void 0 === e ? "undefined" : null === e ? "null" : Object.prototype.toString.call(e).split(" ").pop().split("]").shift().toLowerCase()
    }

    function o(e) {
        return e.toUpperCase()
    }

    function s(e, n) {
        function s(e) {
            var t = i(e);
            return t.match(n.m) ? t : e
        }
        e.scheme && (e.scheme = String(e.scheme).replace(n.a, s).toLowerCase().replace(n.j, "")), void 0 !== e.userinfo && (e.userinfo = String(e.userinfo).replace(n.a, s).replace(n.l, t).replace(n.a, o)), void 0 !== e.host && (e.host = String(e.host).replace(n.a, s).toLowerCase().replace(n.f, t).replace(n.a, o)), void 0 !== e.path && (e.path = String(e.path).replace(n.a, s).replace(e.scheme ? n.g : n.h, t).replace(n.a, o)), void 0 !== e.query && (e.query = String(e.query).replace(n.a, s).replace(n.i, t).replace(n.a, o)), void 0 !== e.fragment && (e.fragment = String(e.fragment).replace(n.a, s).replace(n.c, t).replace(n.a, o))
    }

    function r(e, t) {
        void 0 === t && (t = {});
        var i, n = f,
            o = {};
        return "suffix" === t.reference && (e = (t.scheme ? t.scheme + ":" : "") + "//" + e), (i = e.match(m)) ? (w ? (o.scheme = i[1], o.userinfo = i[3], o.host = i[4], o.port = parseInt(i[5], 10), o.path = i[6] || "", o.query = i[7], o.fragment = i[8], isNaN(o.port) && (o.port = i[5])) : (o.scheme = i[1] || void 0, o.userinfo = -1 !== e.indexOf("@") ? i[3] : void 0, o.host = -1 !== e.indexOf("//") ? i[4] : void 0, o.port = parseInt(i[5], 10), o.path = i[6] || "", o.query = -1 !== e.indexOf("?") ? i[7] : void 0, o.fragment = -1 !== e.indexOf("#") ? i[8] : void 0, isNaN(o.port) && (o.port = e.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? i[4] : void 0)), o.reference = void 0 !== o.scheme || void 0 !== o.userinfo || void 0 !== o.host || void 0 !== o.port || o.path || void 0 !== o.query ? void 0 === o.scheme ? "relative" : void 0 === o.fragment ? "absolute" : "uri" : "same-document", t.reference && "suffix" !== t.reference && t.reference !== o.reference && (o.error = o.error || "URI is not a " + t.reference + " reference."), i = x[(t.scheme || o.scheme || "").toLowerCase()], s(o, n), i && i.parse && i.parse(o, t)) : o.error = o.error || "URI can not be parsed.", o
    }

    function a(e) {
        var t = [];
        return void 0 !== e.userinfo && (t.push(e.userinfo), t.push("@")), void 0 !== e.host && t.push(e.host), "number" == typeof e.port && (t.push(":"), t.push(e.port.toString(10))), t.length ? t.join("") : void 0
    }

    function l(e) {
        for (var t, i = []; e.length;) e.match(v) ? e = e.replace(v, "") : e.match(g) ? e = e.replace(g, "/") : e.match(y) ? (e = e.replace(y, "/"), i.pop()) : "." === e || ".." === e ? e = "" : (t = e.match(b)[0], e = e.slice(t.length), i.push(t));
        return i.join("")
    }

    function d(e, t) {
        void 0 === t && (t = {});
        var i, n, o = f,
            r = [];
        return (i = x[(t.scheme || e.scheme || "").toLowerCase()]) && i.serialize && i.serialize(e, t), s(e, o), "suffix" !== t.reference && e.scheme && (r.push(e.scheme), r.push(":")), void 0 !== (o = a(e)) && ("suffix" !== t.reference && r.push("//"), r.push(o), e.path && "/" !== e.path.charAt(0) && r.push("/")), void 0 !== e.path && (n = e.path, t.absolutePath || i && i.absolutePath || (n = l(n)), void 0 === o && (n = n.replace(/^\/\//, "/%2F")), r.push(n)), void 0 !== e.query && (r.push("?"), r.push(e.query)), void 0 !== e.fragment && (r.push("#"), r.push(e.fragment)), r.join("")
    }

    function c(e, t, i, n) {
        void 0 === i && (i = {});
        var o = {};
        return n || (e = r(d(e, i), i), t = r(d(t, i), i)), !(i = i || {}).tolerant && t.scheme ? (o.scheme = t.scheme, o.userinfo = t.userinfo, o.host = t.host, o.port = t.port, o.path = l(t.path), o.query = t.query) : (void 0 !== t.userinfo || void 0 !== t.host || void 0 !== t.port ? (o.userinfo = t.userinfo, o.host = t.host, o.port = t.port, o.path = l(t.path), o.query = t.query) : (t.path ? ("/" === t.path.charAt(0) ? o.path = l(t.path) : (void 0 === e.userinfo && void 0 === e.host && void 0 === e.port || e.path ? e.path ? o.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : o.path = t.path : o.path = "/" + t.path, o.path = l(o.path)), o.query = t.query) : (o.path = e.path, o.query = void 0 !== t.query ? t.query : e.query), o.userinfo = e.userinfo, o.host = e.host, o.port = e.port), o.scheme = e.scheme), o.fragment = t.fragment, o
    }
    var u, p, h, f = (u = !1, p = e("[0-9]", "[A-Fa-f]"), h = e("[A-Za-z]", "[0-9]", "[\\-\\.\\_\\~]", u ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]"), {
            s: !1,
            j: new RegExp(e("[^]", "[A-Za-z]", "[0-9]", "[\\+\\-\\.]"), "g"),
            l: new RegExp(e("[^\\%\\:]", h, "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]"), "g"),
            f: new RegExp(e("[^\\%]", h, "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]"), "g"),
            g: new RegExp(e("[^\\%\\/\\:\\@]", h, "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]"), "g"),
            h: new RegExp(e("[^\\%\\/\\@]", h, "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]"), "g"),
            i: new RegExp(e("[^\\%]", h, "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", "[\\:\\@\\/\\?]", u ? "[\\uE000-\\uF8FF]" : "[]"), "g"),
            c: new RegExp(e("[^\\%]", h, "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", "[\\:\\@\\/\\?]"), "g"),
            b: new RegExp(e("[^]", h, "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]"), "g"),
            m: new RegExp(h, "g"),
            o: new RegExp(e("[^\\%]", h, e("[\\:\\/\\?\\#\\[\\]\\@]", "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]")), "g"),
            a: new RegExp("(?:(?:%[EFef]" + p + "%" + p + p + "%" + p + p + ")|(?:%[89A-Fa-f]" + p + "%" + p + p + ")|(?:%" + p + p + "))", "g")
        }),
        m = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?([^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n)*))?/i,
        v = /^\.\.?\//,
        g = /^\/\.(\/|$)/,
        y = /^\/\.\.(\/|$)/,
        b = /^\/?(?:.|\n)*?(?=\/|$)/,
        w = void 0 === "".match(/(){0}/)[1],
        x = {};
    return {
        IRI_SUPPORT: !1,
        VALIDATE_SUPPORT: !1,
        pctEncChar: t,
        pctDecChars: i,
        SCHEMES: x,
        parse: r,
        _recomposeAuthority: a,
        removeDotSegments: l,
        serialize: d,
        resolveComponents: c,
        resolve: function(e, t, i) {
            return d(c(r(e, i), r(t, i), i, !0), i)
        },
        normalize: function(e, t) {
            return "string" == typeof e ? e = d(r(e, t), t) : "object" === n(e) && (e = r(d(e, t), t)), e
        },
        equal: function(e, t, i) {
            return "string" == typeof e ? e = d(r(e, i), i) : "object" === n(e) && (e = d(e, i)), "string" == typeof t ? t = d(r(t, i), i) : "object" === n(t) && (t = d(t, i)), e === t
        },
        escapeComponent: function(e) {
            return e && e.toString().replace(f.b, t)
        },
        unescapeComponent: function(e) {
            return e && e.toString().replace(f.a, i)
        }
    }
}();
URI.SCHEMES.http = URI.SCHEMES.https = {
        domainHost: !0,
        parse: function(e) {
            return e.host || (e.error = e.error || "HTTP URIs must have a host."), e
        },
        serialize: function(e) {
            return e.port !== ("https" !== String(e.scheme).toLowerCase() ? 80 : 443) && "" !== e.port || (e.port = void 0), e.path || (e.path = "/"), e
        }
    }, $(document).ready((function() {
        $(".button_to").submit((function() {
            return $this = $(this), $this.find(":submit").attr("disabled", "disabled"), !$this.data().isSubmitted && ($this.data().isSubmitted = !0, !0)
        })), $("#display-name").attr("data-email") && (email = $("#display-name").attr("data-email"), $("#job_alert_email").val(email))
    })), document.addEventListener("DOMContentLoaded", (function() {
        $(".featuredEmployers-slider").slick({
            variableWidth: !0,
            slidesToShow: 1,
            speed: 300,
            infinite: parseBooleanStyle($('[data-js="employerCarouselSlider"]').attr("data-infinite")),
            centerMode: !1,
            autoplay: parseBooleanStyle($('[data-js="employerCarouselSlider"]').attr("data-autoplay")),
            autoplaySpeed: 2e3,
            prevArrow: '<a href="#" class="slick-prev"><svg class="icon"><use xlink:href="#arrow-left"></use></a>',
            nextArrow: '<a href="#" class="slick-next"><svg class="icon"><use xlink:href="#arrow-right"></use></a>'
        })
    })),
    function() {
        var e, t = function(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        };
        e = function() {
            function e(e, i, n) {
                this._authToken = e, this._postalCode = i, this._i18n = n, this._handleFieldError = t(this._handleFieldError, this), this._handlePostalCodeError = t(this._handlePostalCodeError, this), this._handleExpirationDateError = t(this._handleExpirationDateError, this), this._handleSecurityCodeError = t(this._handleSecurityCodeError, this), this._handleNumberError = t(this._handleNumberError, this), this._handleInvalidFieldsError = t(this._handleInvalidFieldsError, this), this._handleTokenizeError = t(this._handleTokenizeError, this), this._handleFormSubmitCallback = t(this._handleFormSubmitCallback, this), this._handleFormSubmit = t(this._handleFormSubmit, this), this._handleInvalidChange = t(this._handleInvalidChange, this), this._handlePotentiallValidChange = t(this._handlePotentiallValidChange, this), this._handleValidChange = t(this._handleValidChange, this), this._removeFieldValidityFormatting = t(this._removeFieldValidityFormatting, this), this._handleCardTypeChange = t(this._handleCardTypeChange, this), this._handleValidityChange = t(this._handleValidityChange, this), this._handleHostedFieldsCreate = t(this._handleHostedFieldsCreate, this), this._handleClientCreated = t(this._handleClientCreated, this), this._form = $("#payment_form"), this._submitButton = $("#payment_button"), this._flashErrors = $("#braintree_messages"), this._successClass = "valid", this._invalidClass = "invalid", this._haveSuccessfulyTokenized = !1, braintree.client.create({
                    authorization: this._authToken
                }, this._handleClientCreated)
            }
            return e.prototype._handleClientCreated = function(e, t) {
                if (!e) return braintree.hostedFields.create(this._buildPropertiesForHostedFields(t), this._handleHostedFieldsCreate);
                console.error("Error attempting to create the Braintree client: ", e)
            }, e.prototype._buildPropertiesForHostedFields = function(e) {
                return {
                    client: e,
                    styles: {
                        input: {
                            "line-height": "26px",
                            "font-size": "16px",
                            color: "#555555"
                        },
                        "input.invalid": {
                            color: "red"
                        },
                        "input.valid": {
                            color: "green"
                        }
                    },
                    fields: {
                        number: {
                            selector: "#card-number",
                            placeholder: "1234 1234 1234 1234"
                        },
                        cvv: {
                            selector: "#cvv",
                            placeholder: "CVC"
                        },
                        expirationDate: {
                            selector: "#expiration-date",
                            placeholder: "MM / YY"
                        },
                        postalCode: {
                            selector: "#postal-code",
                            prefill: this._postalCode,
                            placeholder: "12345"
                        }
                    }
                }
            }, e.prototype._handleHostedFieldsCreate = function(e, t) {
                if (!e) return this._submitButton.removeAttr("disabled"), this._hostedFieldsInstance = t, this._form.submit(this._handleFormSubmit), this._hostedFieldsInstance.on("validityChange", this._handleValidityChange), this._hostedFieldsInstance.on("cardTypeChange", this._handleCardTypeChange);
                console.error("Error creating the Braintree hosted fields: ", e)
            }, e.prototype._handleValidityChange = function(e) {
                var t;
                return (t = e.fields[e.emittedBy]).isValid ? this._handleValidChange(e, t) : t.isPotentiallyValid ? this._handlePotentiallValidChange(e, t) : this._handleInvalidChange(e, t)
            }, e.prototype._handleCardTypeChange = function(e) {
                return 1 === e.cards.length ? setBrandIcon(e.cards[0].type) : setBrandIcon("unknown")
            }, e.prototype._removeFieldValidityFormatting = function(e, t) {
                return $(t.container).parents(".form-group").removeClass(this._invalidClass), $(t.container).parents(".form-group").removeClass(this._successClass)
            }, e.prototype._handleValidChange = function(e, t) {
                return this._removeFieldValidityFormatting(e, t), $(t.container).parents(".form-group").addClass(this._successClass)
            }, e.prototype._handlePotentiallValidChange = function(e, t) {
                return this._removeFieldValidityFormatting(e, t)
            }, e.prototype._handleInvalidChange = function(e, t) {
                return this._removeFieldValidityFormatting(e, t), $(t.container).parents(".form-group").addClass(this._invalidClass)
            }, e.prototype._handleFormSubmit = function(e) {
                if (!this._haveSuccessfulyTokenized) return e.preventDefault(), this._flashErrors.addClass("hidden"), this._flashErrors.text(""), this._hostedFieldsInstance.tokenize(this._handleFormSubmitCallback)
            }, e.prototype._handleFormSubmitCallback = function(e, t) {
                return e ? this._handleTokenizeError(e) : ($("#payment_method_nonce").attr("value", t.nonce), this._haveSuccessfulyTokenized = !0, this._form.submit())
            }, e.prototype._handleTokenizeError = function(e) {
                switch (e.code) {
                    case "HOSTED_FIELDS_FIELDS_EMPTY":
                        this._flashErrors.html(this._i18n.payment.errors.empty_form);
                        break;
                    case "HOSTED_FIELDS_FIELDS_INVALID":
                        this._handleInvalidFieldsError(e);
                        break;
                    case "HOSTED_FIELDS_FAILED_TOKENIZATION":
                        this._flashErrors.html(this._i18n.payment.errors.invalid_card);
                        break;
                    case "HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR":
                        this._flashErrors.html(this._i18n.payment.errors.network_error);
                        break;
                    default:
                        this._flashErrors.html(this._i18n.payment.errors.unknown_error)
                }
                return this._flashErrors.removeClass("hidden")
            }, e.prototype._handleInvalidFieldsError = function(e) {
                var t, i, n;
                return i = e.details.invalidFieldKeys, n = !1, t = $("<span>"), i.length > 1 && (n = !0, t = $("<ul>")), i.includes("number") && this._handleNumberError(n, t), i.includes("cvv") && this._handleSecurityCodeError(n, t), i.includes("expirationDate") && this._handleExpirationDateError(n, t), i.includes("postalCode") && this._handlePostalCodeError(n, t), this._flashErrors.html(t)
            }, e.prototype._handleNumberError = function(e, t) {
                return this._handleFieldError("number", this._i18n.payment.errors.invalid_field.number, e, t)
            }, e.prototype._handleSecurityCodeError = function(e, t) {
                return this._handleFieldError("cvv", this._i18n.payment.errors.invalid_field.cvv, e, t)
            }, e.prototype._handleExpirationDateError = function(e, t) {
                return this._handleFieldError("expirationDate", this._i18n.payment.errors.invalid_field.expiration_date, e, t)
            }, e.prototype._handlePostalCodeError = function(e, t) {
                return this._handleFieldError("postalCode", this._i18n.payment.errors.invalid_field.postal_code, e, t)
            }, e.prototype._handleFieldError = function(e, t, i, n) {
                return i ? n.append("<li>" + t + "</li>") : n.text(t), this._hostedFieldsInstance.addClass(e, "invalid"), this._hostedFieldsInstance.setMessage({
                    field: e,
                    message: t
                })
            }, e
        }(), window.BraintreePaymentForm = e
    }.call(this),
    function(e, t) {
        "function" == typeof define && define.amd && "function" == typeof require && "function" == typeof require.specified && require.specified("knockout") ? define(["jquery", "knockout"], t) : t(e.jQuery, e.ko)
    }(this, (function(e, t) {
        "use strict";

        function i(e, t) {
            for (var i = 0; i < e.length; ++i) t(e[i], i)
        }

        function n(t, i) {
            this.$select = e(t), this.options = this.mergeOptions(e.extend({}, i, this.$select.data())), this.$select.attr("data-placeholder") && (this.options.nonSelectedText = this.$select.data("placeholder")), this.originalOptions = this.$select.clone()[0].options, this.query = "", this.searchTimeout = null, this.lastToggledInput = null, this.options.multiple = "multiple" === this.$select.attr("multiple"), this.options.onChange = e.proxy(this.options.onChange, this), this.options.onSelectAll = e.proxy(this.options.onSelectAll, this), this.options.onDeselectAll = e.proxy(this.options.onDeselectAll, this), this.options.onDropdownShow = e.proxy(this.options.onDropdownShow, this), this.options.onDropdownHide = e.proxy(this.options.onDropdownHide, this), this.options.onDropdownShown = e.proxy(this.options.onDropdownShown, this), this.options.onDropdownHidden = e.proxy(this.options.onDropdownHidden, this), this.options.onInitialized = e.proxy(this.options.onInitialized, this), this.options.onFiltering = e.proxy(this.options.onFiltering, this), this.buildContainer(), this.buildButton(), this.buildDropdown(), this.buildReset(), this.buildSelectAll(), this.buildDropdownOptions(), this.buildFilter(), this.updateButtonText(), this.updateSelectAll(!0), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), this.options.wasDisabled = this.$select.prop("disabled"), this.options.disableIfEmpty && e("option", this.$select).length <= 0 && this.disable(), this.$select.wrap('<span class="multiselect-native-select" />').after(this.$container), this.options.onInitialized(this.$select, this.$container)
        }
        void 0 !== t && t.bindingHandlers && !t.bindingHandlers.multiselect && (t.bindingHandlers.multiselect = {
            after: ["options", "value", "selectedOptions", "enable", "disable"],
            init: function(i, n, o) {
                var s = e(i),
                    r = t.toJS(n());
                if (s.multiselect(r), o.has("options")) {
                    var a = o.get("options");
                    t.isObservable(a) && t.computed({
                        read: function() {
                            a(), setTimeout((function() {
                                var e = s.data("multiselect");
                                e && e.updateOriginalOptions(), s.multiselect("rebuild")
                            }), 1)
                        },
                        disposeWhenNodeIsRemoved: i
                    })
                }
                if (o.has("value")) {
                    var l = o.get("value");
                    t.isObservable(l) && t.computed({
                        read: function() {
                            l(), setTimeout((function() {
                                s.multiselect("refresh")
                            }), 1)
                        },
                        disposeWhenNodeIsRemoved: i
                    }).extend({
                        rateLimit: 100,
                        notifyWhenChangesStop: !0
                    })
                }
                if (o.has("selectedOptions")) {
                    var d = o.get("selectedOptions");
                    t.isObservable(d) && t.computed({
                        read: function() {
                            d(), setTimeout((function() {
                                s.multiselect("refresh")
                            }), 1)
                        },
                        disposeWhenNodeIsRemoved: i
                    }).extend({
                        rateLimit: 100,
                        notifyWhenChangesStop: !0
                    })
                }
                var c = function(e) {
                    setTimeout((function() {
                        e ? s.multiselect("enable") : s.multiselect("disable")
                    }))
                };
                if (o.has("enable")) {
                    var u = o.get("enable");
                    t.isObservable(u) ? t.computed({
                        read: function() {
                            c(u())
                        },
                        disposeWhenNodeIsRemoved: i
                    }).extend({
                        rateLimit: 100,
                        notifyWhenChangesStop: !0
                    }) : c(u)
                }
                if (o.has("disable")) {
                    var p = o.get("disable");
                    t.isObservable(p) ? t.computed({
                        read: function() {
                            c(!p())
                        },
                        disposeWhenNodeIsRemoved: i
                    }).extend({
                        rateLimit: 100,
                        notifyWhenChangesStop: !0
                    }) : c(!p)
                }
                t.utils.domNodeDisposal.addDisposeCallback(i, (function() {
                    s.multiselect("destroy")
                }))
            },
            update: function(i, n) {
                var o = e(i),
                    s = t.toJS(n());
                o.multiselect("setOptions", s), o.multiselect("rebuild")
            }
        }), n.prototype = {
            defaults: {
                buttonText: function(t, i) {
                    if (this.disabledText.length > 0 && (i.prop("disabled") || 0 == t.length && this.disableIfEmpty)) return this.disabledText;
                    if (0 === t.length) return this.nonSelectedText;
                    if (this.allSelectedText && t.length === e("option", e(i)).length && 1 !== e("option", e(i)).length && this.multiple) return this.selectAllNumber ? this.allSelectedText + " (" + t.length + ")" : this.allSelectedText;
                    if (0 != this.numberDisplayed && t.length > this.numberDisplayed) return t.length + " " + this.nSelectedText;
                    var n = "",
                        o = this.delimiterText;
                    return t.each((function() {
                        var t = void 0 !== e(this).attr("label") ? e(this).attr("label") : e(this).text();
                        n += t + o
                    })), n.substr(0, n.length - this.delimiterText.length)
                },
                buttonTitle: function(t) {
                    if (0 === t.length) return this.nonSelectedText;
                    var i = "",
                        n = this.delimiterText;
                    return t.each((function() {
                        var t = void 0 !== e(this).attr("label") ? e(this).attr("label") : e(this).text();
                        i += t + n
                    })), i.substr(0, i.length - this.delimiterText.length)
                },
                checkboxName: function() {
                    return !1
                },
                optionLabel: function(t) {
                    return e(t).attr("label") || e(t).text()
                },
                optionClass: function(t) {
                    return e(t).attr("class") || ""
                },
                onChange: function() {},
                onDropdownShow: function() {},
                onDropdownHide: function() {},
                onDropdownShown: function() {},
                onDropdownHidden: function() {},
                onSelectAll: function() {},
                onDeselectAll: function() {},
                onInitialized: function() {},
                onFiltering: function() {},
                enableHTML: !1,
                buttonClass: "btn btn-default",
                inheritClass: !1,
                buttonWidth: "auto",
                buttonContainer: '<div class="btn-group" />',
                dropRight: !1,
                dropUp: !1,
                selectedClass: "active",
                maxHeight: !1,
                includeSelectAllOption: !1,
                includeSelectAllIfMoreThan: 0,
                selectAllText: " Select all",
                selectAllValue: "multiselect-all",
                selectAllName: !1,
                selectAllNumber: !0,
                selectAllJustVisible: !0,
                enableFiltering: !1,
                enableCaseInsensitiveFiltering: !1,
                enableFullValueFiltering: !1,
                enableClickableOptGroups: !1,
                enableCollapsibleOptGroups: !1,
                collapseOptGroupsByDefault: !1,
                filterPlaceholder: "Search",
                filterBehavior: "text",
                includeFilterClearBtn: !0,
                preventInputChangeEvent: !1,
                nonSelectedText: "None selected",
                nSelectedText: "selected",
                allSelectedText: "All selected",
                numberDisplayed: 3,
                disableIfEmpty: !1,
                disabledText: "",
                delimiterText: ", ",
                includeResetOption: !1,
                includeResetDivider: !1,
                resetText: "Reset",
                templates: {
                    button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                    ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                    filter: '<li class="multiselect-item multiselect-filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text" /></div></li>',
                    filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                    li: '<li><a tabindex="0"><label></label></a></li>',
                    divider: '<li class="multiselect-item divider"></li>',
                    liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>',
                    resetButton: '<li class="multiselect-reset text-center"><div class="input-group"><a class="btn btn-default btn-block"></a></div></li>'
                }
            },
            constructor: n,
            buildContainer: function() {
                this.$container = e(this.options.buttonContainer), this.$container.on("show.bs.dropdown", this.options.onDropdownShow), this.$container.on("hide.bs.dropdown", this.options.onDropdownHide), this.$container.on("shown.bs.dropdown", this.options.onDropdownShown), this.$container.on("hidden.bs.dropdown", this.options.onDropdownHidden)
            },
            buildButton: function() {
                this.$button = e(this.options.templates.button).addClass(this.options.buttonClass), this.$select.attr("class") && this.options.inheritClass && this.$button.addClass(this.$select.attr("class")), this.$select.prop("disabled") ? this.disable() : this.enable(), this.options.buttonWidth && "auto" !== this.options.buttonWidth && (this.$button.css({
                    width: "100%",
                    overflow: "hidden",
                    "text-overflow": "ellipsis"
                }), this.$container.css({
                    width: this.options.buttonWidth
                }));
                var t = this.$select.attr("tabindex");
                t && this.$button.attr("tabindex", t), this.$container.prepend(this.$button)
            },
            buildDropdown: function() {
                if (this.$ul = e(this.options.templates.ul), this.options.dropRight && this.$ul.addClass("pull-right"), this.options.maxHeight && this.$ul.css({
                        "max-height": this.options.maxHeight + "px",
                        "overflow-y": "auto",
                        "overflow-x": "hidden"
                    }), this.options.dropUp) {
                    var t = Math.min(this.options.maxHeight, 26 * e('option[data-role!="divider"]', this.$select).length + 19 * e('option[data-role="divider"]', this.$select).length + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0)),
                        i = t + 34;
                    this.$ul.css({
                        "max-height": t + "px",
                        "overflow-y": "auto",
                        "overflow-x": "hidden",
                        "margin-top": "-" + i + "px"
                    })
                }
                this.$container.append(this.$ul)
            },
            buildDropdownOptions: function() {
                this.$select.children().each(e.proxy((function(t, i) {
                    var n = e(i),
                        o = n.prop("tagName").toLowerCase();
                    n.prop("value") !== this.options.selectAllValue && ("optgroup" === o ? this.createOptgroup(i) : "option" === o && ("divider" === n.data("role") ? this.createDivider() : this.createOptionValue(i)))
                }), this)), e(this.$ul).off("change", 'li:not(.multiselect-group) input[type="checkbox"], li:not(.multiselect-group) input[type="radio"]'), e(this.$ul).on("change", 'li:not(.multiselect-group) input[type="checkbox"], li:not(.multiselect-group) input[type="radio"]', e.proxy((function(t) {
                    var i = e(t.target),
                        n = i.prop("checked") || !1,
                        o = i.val() === this.options.selectAllValue;
                    this.options.selectedClass && (n ? i.closest("li").addClass(this.options.selectedClass) : i.closest("li").removeClass(this.options.selectedClass));
                    var s = i.val(),
                        r = this.getOptionByValue(s),
                        a = e("option", this.$select).not(r),
                        l = e("input", this.$container).not(i);
                    if (o ? n ? this.selectAll(this.options.selectAllJustVisible, !0) : this.deselectAll(this.options.selectAllJustVisible, !0) : (n ? (r.prop("selected", !0), this.options.multiple ? r.prop("selected", !0) : (this.options.selectedClass && e(l).closest("li").removeClass(this.options.selectedClass), e(l).prop("checked", !1), a.prop("selected", !1), this.$button.click()), "active" === this.options.selectedClass && a.closest("a").css("outline", "")) : r.prop("selected", !1), this.options.onChange(r, n), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()), this.$select.change(), this.updateButtonText(), this.options.preventInputChangeEvent) return !1
                }), this)), e("li a", this.$ul).on("mousedown", (function(e) {
                    if (e.shiftKey) return !1
                })), e(this.$ul).on("touchstart click", "li a", e.proxy((function(t) {
                    t.stopPropagation();
                    var i = e(t.target);
                    if (t.shiftKey && this.options.multiple) {
                        i.is("label") && (t.preventDefault(), (i = i.find("input")).prop("checked", !i.prop("checked")));
                        var n = i.prop("checked") || !1;
                        if (null !== this.lastToggledInput && this.lastToggledInput !== i) {
                            var o = this.$ul.find("li:visible").index(i.parents("li")),
                                s = this.$ul.find("li:visible").index(this.lastToggledInput.parents("li"));
                            if (o > s) {
                                var r = s;
                                s = o, o = r
                            }++s;
                            var a = this.$ul.find("li").not(".multiselect-filter-hidden").slice(o, s).find("input");
                            a.prop("checked", n), this.options.selectedClass && a.closest("li").toggleClass(this.options.selectedClass, n);
                            for (var l = 0, d = a.length; l < d; l++) {
                                var c = e(a[l]);
                                this.getOptionByValue(c.val()).prop("selected", n)
                            }
                        }
                        i.trigger("change")
                    }
                    i.is("input") && !i.closest("li").is(".multiselect-item") && (this.lastToggledInput = i), i.blur()
                }), this)), this.$container.off("keydown.multiselect").on("keydown.multiselect", e.proxy((function(t) {
                    if (!e('input[type="text"]', this.$container).is(":focus"))
                        if (9 === t.keyCode && this.$container.hasClass("open")) this.$button.click();
                        else {
                            var i = e(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");
                            if (!i.length) return;
                            var n = i.index(i.filter(":focus"));
                            38 === t.keyCode && n > 0 ? n-- : 40 === t.keyCode && n < i.length - 1 ? n++ : ~n || (n = 0);
                            var o = i.eq(n);
                            if (o.focus(), 32 === t.keyCode || 13 === t.keyCode) {
                                var s = o.find("input");
                                s.prop("checked", !s.prop("checked")), s.change()
                            }
                            t.stopPropagation(), t.preventDefault()
                        }
                }), this)), this.options.enableClickableOptGroups && this.options.multiple && e("li.multiselect-group input", this.$ul).on("change", e.proxy((function(t) {
                    t.stopPropagation();
                    var i = e(t.target).prop("checked") || !1,
                        n = e(t.target).closest("li"),
                        o = n.nextUntil("li.multiselect-group").not(".multiselect-filter-hidden").not(".disabled").find("input"),
                        s = [];
                    this.options.selectedClass && (i ? n.addClass(this.options.selectedClass) : n.removeClass(this.options.selectedClass)), e.each(o, e.proxy((function(t, n) {
                        var o = e(n).val(),
                            r = this.getOptionByValue(o);
                        i ? (e(n).prop("checked", !0), e(n).closest("li").addClass(this.options.selectedClass), r.prop("selected", !0)) : (e(n).prop("checked", !1), e(n).closest("li").removeClass(this.options.selectedClass), r.prop("selected", !1)), s.push(this.getOptionByValue(o))
                    }), this)), this.options.onChange(s, i), this.$select.change(), this.updateButtonText(), this.updateSelectAll()
                }), this)), this.options.enableCollapsibleOptGroups && this.options.multiple && (e("li.multiselect-group .caret-container", this.$ul).on("click", e.proxy((function(t) {
                    var i = e(t.target).closest("li").nextUntil("li.multiselect-group").not(".multiselect-filter-hidden"),
                        n = !0;
                    i.each((function() {
                        n = n && !e(this).hasClass("multiselect-collapsible-hidden")
                    })), n ? i.hide().addClass("multiselect-collapsible-hidden") : i.show().removeClass("multiselect-collapsible-hidden")
                }), this)), e("li.multiselect-all", this.$ul).css("background", "#f3f3f3").css("border-bottom", "1px solid #eaeaea"), e("li.multiselect-all > a > label.checkbox", this.$ul).css("padding", "3px 20px 3px 35px"), e("li.multiselect-group > a > input", this.$ul).css("margin", "4px 0px 5px -20px"))
            },
            createOptionValue: function(t) {
                var i = e(t);
                i.is(":selected") && i.prop("selected", !0);
                var n = this.options.optionLabel(t),
                    o = this.options.optionClass(t),
                    s = i.val(),
                    r = this.options.multiple ? "checkbox" : "radio",
                    a = e(this.options.templates.li),
                    l = e("label", a);
                l.addClass(r), l.attr("title", n), a.addClass(o), this.options.collapseOptGroupsByDefault && "optgroup" === e(t).parent().prop("tagName").toLowerCase() && (a.addClass("multiselect-collapsible-hidden"), a.hide()), this.options.enableHTML ? l.html(" " + n) : l.text(" " + n);
                var d = e("<input/>").attr("type", r),
                    c = this.options.checkboxName(i);
                c && d.attr("name", c), l.prepend(d);
                var u = i.prop("selected") || !1;
                d.val(s), s === this.options.selectAllValue && (a.addClass("multiselect-item multiselect-all"), d.parent().parent().addClass("multiselect-all")), l.attr("title", i.attr("title")), this.$ul.append(a), i.is(":disabled") && d.attr("disabled", "disabled").prop("disabled", !0).closest("a").attr("tabindex", "-1").closest("li").addClass("disabled"), d.prop("checked", u), u && this.options.selectedClass && d.closest("li").addClass(this.options.selectedClass)
            },
            createDivider: function() {
                var t = e(this.options.templates.divider);
                this.$ul.append(t)
            },
            createOptgroup: function(t) {
                var i = e(t).attr("label"),
                    n = e(t).attr("value"),
                    o = e('<li class="multiselect-item multiselect-group"><a href="javascript:void(0);"><label><b></b></label></a></li>'),
                    s = this.options.optionClass(t);
                o.addClass(s), this.options.enableHTML ? e("label b", o).html(" " + i) : e("label b", o).text(" " + i), this.options.enableCollapsibleOptGroups && this.options.multiple && e("a", o).append('<span class="caret-container"><b class="caret"></b></span>'), this.options.enableClickableOptGroups && this.options.multiple && e("a label", o).prepend('<input type="checkbox" value="' + n + '"/>'), e(t).is(":disabled") && o.addClass("disabled"), this.$ul.append(o), e("option", t).each(e.proxy((function(e, t) {
                    this.createOptionValue(t)
                }), this))
            },
            buildReset: function() {
                if (this.options.includeResetOption) {
                    this.options.includeResetDivider && this.$ul.prepend(e(this.options.templates.divider));
                    var t = e(this.options.templates.resetButton);
                    this.options.enableHTML ? e("a", t).html(this.options.resetText) : e("a", t).text(this.options.resetText), e("a", t).click(e.proxy((function() {
                        this.clearSelection()
                    }), this)), this.$ul.prepend(t)
                }
            },
            buildSelectAll: function() {
                if ("number" == typeof this.options.selectAllValue && (this.options.selectAllValue = this.options.selectAllValue.toString()), !this.hasSelectAll() && this.options.includeSelectAllOption && this.options.multiple && e("option", this.$select).length > this.options.includeSelectAllIfMoreThan) {
                    this.options.includeSelectAllDivider && this.$ul.prepend(e(this.options.templates.divider));
                    var t = e(this.options.templates.li);
                    e("label", t).addClass("checkbox"), this.options.enableHTML ? e("label", t).html(" " + this.options.selectAllText) : e("label", t).text(" " + this.options.selectAllText), this.options.selectAllName ? e("label", t).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />') : e("label", t).prepend('<input type="checkbox" />');
                    var i = e("input", t);
                    i.val(this.options.selectAllValue), t.addClass("multiselect-item multiselect-all"), i.parent().parent().addClass("multiselect-all"), this.$ul.prepend(t), i.prop("checked", !1)
                }
            },
            buildFilter: function() {
                if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                    var t = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);
                    if (this.$select.find("option").length >= t) {
                        if (this.$filter = e(this.options.templates.filter), e("input", this.$filter).attr("placeholder", this.options.filterPlaceholder), this.options.includeFilterClearBtn) {
                            var i = e(this.options.templates.filterClearBtn);
                            i.on("click", e.proxy((function() {
                                clearTimeout(this.searchTimeout), this.query = "", this.$filter.find(".multiselect-search").val(""), e("li", this.$ul).show().removeClass("multiselect-filter-hidden"), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
                            }), this)), this.$filter.find(".input-group").append(i)
                        }
                        this.$ul.prepend(this.$filter), this.$filter.val(this.query).on("click", (function(e) {
                            e.stopPropagation()
                        })).on("input keydown", e.proxy((function(t) {
                            13 === t.which && t.preventDefault(), clearTimeout(this.searchTimeout), this.searchTimeout = this.asyncFunction(e.proxy((function() {
                                var i, n;
                                this.query !== t.target.value && (this.query = t.target.value, e.each(e("li", this.$ul), e.proxy((function(t, o) {
                                    var s = e("input", o).length > 0 ? e("input", o).val() : "",
                                        r = e("label", o).text(),
                                        a = "";
                                    if ("text" === this.options.filterBehavior ? a = r : "value" === this.options.filterBehavior ? a = s : "both" === this.options.filterBehavior && (a = r + "\n" + s), s !== this.options.selectAllValue && r) {
                                        var l = !1;
                                        if (this.options.enableCaseInsensitiveFiltering && (a = a.toLowerCase(), this.query = this.query.toLowerCase()), this.options.enableFullValueFiltering && "both" !== this.options.filterBehavior) {
                                            var d = a.trim().substring(0, this.query.length);
                                            this.query.indexOf(d) > -1 && (l = !0)
                                        } else a.indexOf(this.query) > -1 && (l = !0);
                                        l || (e(o).css("display", "none"), e(o).addClass("multiselect-filter-hidden")), l && (e(o).css("display", "block"), e(o).removeClass("multiselect-filter-hidden")), e(o).hasClass("multiselect-group") ? (i = o, n = l) : (l && e(i).show().removeClass("multiselect-filter-hidden"), !l && n && e(o).show().removeClass("multiselect-filter-hidden"))
                                    }
                                }), this)));
                                this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), this.options.onFiltering(t.target)
                            }), this), 300, this)
                        }), this))
                    }
                }
            },
            destroy: function() {
                this.$container.remove(), this.$select.show(), this.$select.prop("disabled", this.options.wasDisabled), this.$select.data("multiselect", null)
            },
            refresh: function() {
                var t = {};
                e("li input", this.$ul).each((function() {
                    t[e(this).val()] = e(this)
                })), e("option", this.$select).each(e.proxy((function(i, n) {
                    var o = e(n),
                        s = t[e(n).val()];
                    o.is(":selected") ? (s.prop("checked", !0), this.options.selectedClass && s.closest("li").addClass(this.options.selectedClass)) : (s.prop("checked", !1), this.options.selectedClass && s.closest("li").removeClass(this.options.selectedClass)), o.is(":disabled") ? s.attr("disabled", "disabled").prop("disabled", !0).closest("li").addClass("disabled") : s.prop("disabled", !1).closest("li").removeClass("disabled")
                }), this)), this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
            },
            select: function(t, i) {
                e.isArray(t) || (t = [t]);
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    if (null != o) {
                        var s = this.getOptionByValue(o),
                            r = this.getInputByValue(o);
                        void 0 !== s && void 0 !== r && (this.options.multiple || this.deselectAll(!1), this.options.selectedClass && r.closest("li").addClass(this.options.selectedClass), r.prop("checked", !0), s.prop("selected", !0), i && this.options.onChange(s, !0))
                    }
                }
                this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
            },
            clearSelection: function() {
                this.deselectAll(!1), this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
            },
            deselect: function(t, i) {
                e.isArray(t) || (t = [t]);
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    if (null != o) {
                        var s = this.getOptionByValue(o),
                            r = this.getInputByValue(o);
                        void 0 !== s && void 0 !== r && (this.options.selectedClass && r.closest("li").removeClass(this.options.selectedClass), r.prop("checked", !1), s.prop("selected", !1), i && this.options.onChange(s, !1))
                    }
                }
                this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()
            },
            selectAll: function(t, i) {
                t = void 0 === t || t;
                var n = e("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul),
                    o = e("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(":visible");
                t ? (e("input:enabled", o).prop("checked", !0), o.addClass(this.options.selectedClass), e("input:enabled", o).each(e.proxy((function(t, i) {
                    var n = e(i).val(),
                        o = this.getOptionByValue(n);
                    e(o).prop("selected", !0)
                }), this))) : (e("input:enabled", n).prop("checked", !0), n.addClass(this.options.selectedClass), e("input:enabled", n).each(e.proxy((function(t, i) {
                    var n = e(i).val(),
                        o = this.getOptionByValue(n);
                    e(o).prop("selected", !0)
                }), this))), e('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop("checked", !0), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), i && this.options.onSelectAll()
            },
            deselectAll: function(t, i) {
                t = void 0 === t || t;
                var n = e("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul),
                    o = e("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(":visible");
                t ? (e('input[type="checkbox"]:enabled', o).prop("checked", !1), o.removeClass(this.options.selectedClass), e('input[type="checkbox"]:enabled', o).each(e.proxy((function(t, i) {
                    var n = e(i).val(),
                        o = this.getOptionByValue(n);
                    e(o).prop("selected", !1)
                }), this))) : (e('input[type="checkbox"]:enabled', n).prop("checked", !1), n.removeClass(this.options.selectedClass), e('input[type="checkbox"]:enabled', n).each(e.proxy((function(t, i) {
                    var n = e(i).val(),
                        o = this.getOptionByValue(n);
                    e(o).prop("selected", !1)
                }), this))), e('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop("checked", !1), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), i && this.options.onDeselectAll()
            },
            rebuild: function() {
                this.$ul.html(""), this.options.multiple = "multiple" === this.$select.attr("multiple"), this.buildSelectAll(), this.buildDropdownOptions(), this.buildFilter(), this.updateButtonText(), this.updateSelectAll(!0), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), this.options.disableIfEmpty && e("option", this.$select).length <= 0 ? this.disable() : this.enable(), this.options.dropRight && this.$ul.addClass("pull-right")
            },
            dataprovider: function(t) {
                var n = 0,
                    o = this.$select.empty();
                e.each(t, (function(t, s) {
                    var r;
                    if (e.isArray(s.children)) n++, r = e("<optgroup/>").attr({
                        label: s.label || "Group " + n,
                        disabled: !!s.disabled,
                        value: s.value
                    }), i(s.children, (function(t) {
                        var i = {
                            value: t.value,
                            label: t.label || t.value,
                            title: t.title,
                            selected: !!t.selected,
                            disabled: !!t.disabled
                        };
                        for (var n in t.attributes) i["data-" + n] = t.attributes[n];
                        r.append(e("<option/>").attr(i))
                    }));
                    else {
                        var a = {
                            value: s.value,
                            label: s.label || s.value,
                            title: s.title,
                            class: s.class,
                            selected: !!s.selected,
                            disabled: !!s.disabled
                        };
                        for (var l in s.attributes) a["data-" + l] = s.attributes[l];
                        (r = e("<option/>").attr(a)).text(s.label || s.value)
                    }
                    o.append(r)
                })), this.rebuild()
            },
            enable: function() {
                this.$select.prop("disabled", !1), this.$button.prop("disabled", !1).removeClass("disabled")
            },
            disable: function() {
                this.$select.prop("disabled", !0), this.$button.prop("disabled", !0).addClass("disabled")
            },
            setOptions: function(e) {
                this.options = this.mergeOptions(e)
            },
            mergeOptions: function(t) {
                return e.extend(!0, {}, this.defaults, this.options, t)
            },
            hasSelectAll: function() {
                return e("li.multiselect-all", this.$ul).length > 0
            },
            updateOptGroups: function() {
                var t = e("li.multiselect-group", this.$ul),
                    i = this.options.selectedClass;
                t.each((function() {
                    var t = e(this).nextUntil("li.multiselect-group").not(".multiselect-filter-hidden").not(".disabled"),
                        n = !0;
                    t.each((function() {
                        e("input", this).prop("checked") || (n = !1)
                    })), i && (n ? e(this).addClass(i) : e(this).removeClass(i)), e("input", this).prop("checked", n)
                }))
            },
            updateSelectAll: function() {
                if (this.hasSelectAll()) {
                    var t = e("li:not(.multiselect-item):not(.multiselect-filter-hidden):not(.multiselect-group):not(.disabled) input:enabled", this.$ul),
                        i = t.length,
                        n = t.filter(":checked").length,
                        o = e("li.multiselect-all", this.$ul),
                        s = o.find("input");
                    n > 0 && n === i ? (s.prop("checked", !0), o.addClass(this.options.selectedClass)) : (s.prop("checked", !1), o.removeClass(this.options.selectedClass))
                }
            },
            updateButtonText: function() {
                var t = this.getSelected();
                this.options.enableHTML ? e(".multiselect .multiselect-selected-text", this.$container).html(this.options.buttonText(t, this.$select)) : e(".multiselect .multiselect-selected-text", this.$container).text(this.options.buttonText(t, this.$select)), e(".multiselect", this.$container).attr("title", this.options.buttonTitle(t, this.$select))
            },
            getSelected: function() {
                return e("option", this.$select).filter(":selected")
            },
            getOptionByValue: function(t) {
                for (var i = e("option", this.$select), n = t.toString(), o = 0; o < i.length; o += 1) {
                    var s = i[o];
                    if (s.value === n) return e(s)
                }
            },
            getInputByValue: function(t) {
                for (var i = e("li input:not(.multiselect-search)", this.$ul), n = t.toString(), o = 0; o < i.length; o += 1) {
                    var s = i[o];
                    if (s.value === n) return e(s)
                }
            },
            updateOriginalOptions: function() {
                this.originalOptions = this.$select.clone()[0].options
            },
            asyncFunction: function(e, t, i) {
                var n = Array.prototype.slice.call(arguments, 3);
                return setTimeout((function() {
                    e.apply(i || window, n)
                }), t)
            },
            setAllSelectedText: function(e) {
                this.options.allSelectedText = e, this.updateButtonText()
            }
        }, e.fn.multiselect = function(t, i, o) {
            return this.each((function() {
                var s = e(this).data("multiselect");
                s || (s = new n(this, "object" == typeof t && t), e(this).data("multiselect", s)), "string" == typeof t && (s[t](i, o), "destroy" === t && e(this).data("multiselect", !1))
            }))
        }, e.fn.multiselect.Constructor = n, e((function() {
            e("select[data-role=multiselect]").multiselect()
        }))
    })),
    function(e) {
        "use strict";

        function t(t) {
            for (var i = e(t); i.length > 0;) {
                var n = i.data("nested-fields.options");
                if (n) return n;
                i = i.parent()
            }
            return null
        }

        function i(e) {
            e.add.bind("click.nested-fields", (function(t) {
                t.preventDefault(), s(null, e)
            }))
        }

        function n(t, i) {
            e(t.itemSelector, i).each((function(e, i) {
                d(i, t)
            }))
        }

        function o(t) {
            var i = new RegExp(t.newItemIndex, "g"),
                n = (new Date).getTime(),
                o = t.itemTemplate.html();
            t.unescapeTemplate && (o = p(o));
            var s = e(o.replace(i, n));
            return s.attr("data-new-record", !0), s.attr("data-record-id", n), d(s, t), s
        }

        function s(e, t) {
            function i() {
                e && e(n), r(t), t.container.append(n)
            }
            var n = o(t);
            return t.skipBefore ? i() : (t.beforeInsert(n, i), t.beforeInsert.length <= 1 && i()), t.skipAfter || t.afterInsert(n), n
        }

        function r(e) {
            u(e).remove()
        }

        function a(t, i) {
            function n() {
                o.attr("data-new-record") ? o.remove() : (o.find("INPUT[name$='[_destroy]']").val("true"), o.hide()), l(i)
            }
            var o = e(t);
            return i.skipBefore ? n() : (i.beforeRemove(o, n), i.beforeRemove.length <= 1 && n()), i.skipAfter || i.afterRemove(o), o
        }

        function l(e) {
            if (0 === c(e).length) {
                var t = e.emptyTemplate.html();
                t && (e.unescapeTemplate && (t = p(t)), e.container.append(t))
            }
        }

        function d(t, i) {
            var n = e(t).find(i.removeSelector),
                o = n.attr("data-confirm") ? "confirm:complete" : "click";
            n.bind(o + ".nested-fields", (function(e, n) {
                return e.preventDefault(), void 0 !== n && !0 !== n || a(t, i), !1
            }))
        }

        function c(e) {
            return e.container.find(e.itemSelector + ":visible")
        }

        function u(e) {
            return e.container.find(e.emptySelector)
        }

        function p(e) {
            var t = document.createElement("div");
            return t.innerHTML = e, 0 === t.childNodes.length ? "" : jQuery.trim(t.childNodes[0].nodeValue)
        }

        function h(e) {
            console && console.log && console.log(e)
        }
        var f = {
                beforeInsert: function(e, t) {
                    t()
                },
                afterInsert: function() {},
                beforeRemove: function(e, t) {
                    t()
                },
                afterRemove: function() {},
                itemTemplateSelector: ".item.template",
                emptyTemplateSelector: ".empty.template",
                containerSelector: ".items, .container",
                itemSelector: ".item",
                emptySelector: ".empty",
                addSelector: ".add",
                removeSelector: ".remove",
                newItemIndex: "new_nested_item",
                unescapeTemplate: !0
            },
            m = {
                init: function(t) {
                    return this.each((function() {
                        var o = e(this);
                        if (o.data("nested-fields.options")) return h("Nested fields already defined for this element. If you want to redefine options, destroy it and init again."), o;
                        (t = e.extend({}, f, t)).itemTemplate = e(t.itemTemplateSelector, o), t.emptyTemplate = e(t.emptyTemplateSelector, o), t.container = e(t.containerSelector, o), t.add = e(t.addSelector, o), o.data("nested-fields.options", t), i(t), n(t, o)
                    }))
                },
                insert: function(i, n) {
                    return s(i, n = e.extend({}, t(this), n))
                },
                remove: function(i, n) {
                    return a(i, n = e.extend({}, t(this), n))
                },
                removeAll: function(i) {
                    i = e.extend({}, t(this), i), e(m.items.apply(this)).each((function(e, t) {
                        m.remove(t, i)
                    }))
                },
                items: function() {
                    return c(t(this))
                },
                destroy: function() {
                    e(this).removeData("nested-fields.options"), e("*", this).unbind(".nested-fields")
                }
            };
        e.fn.nestedFields = function(t) {
            return m[t] ? m[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist on jQuery.nestedFields") : m.init.apply(this, arguments)
        }
    }(jQuery),
    function(e) {
        "use strict";
        var t = "Microsoft Internet Explorer" == window.navigator.appName,
            i = function(t, i) {
                if (this.$element = e(t), this.$input = this.$element.find(":file"), 0 !== this.$input.length) {
                    this.name = this.$input.attr("name") || i.name, this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]'), 0 === this.$hidden.length && (this.$hidden = e('<input type="hidden">').insertBefore(this.$input)), this.$preview = this.$element.find(".fileinput-preview");
                    var n = this.$preview.css("height");
                    "inline" !== this.$preview.css("display") && "0px" !== n && "none" !== n && this.$preview.css("line-height", n), this.original = {
                        exists: this.$element.hasClass("fileinput-exists"),
                        preview: this.$preview.html(),
                        hiddenVal: this.$hidden.val()
                    }, this.listen()
                }
            };
        i.prototype.listen = function() {
            this.$input.on("change.bs.fileinput", e.proxy(this.change, this)), e(this.$input[0].form).on("reset.bs.fileinput", e.proxy(this.reset, this)), this.$element.find('[data-trigger="fileinput"]').on("click.bs.fileinput", e.proxy(this.trigger, this)), this.$element.find('[data-dismiss="fileinput"]').on("click.bs.fileinput", e.proxy(this.clear, this))
        }, i.prototype.change = function(t) {
            var i = void 0 === t.target.files ? t.target && t.target.value ? [{
                name: t.target.value.replace(/^.+\\/, "")
            }] : [] : t.target.files;
            if (t.stopPropagation(), 0 !== i.length) {
                this.$hidden.val(""), this.$hidden.attr("name", ""), this.$input.attr("name", this.name);
                var n = i[0];
                if (this.$preview.length > 0 && (void 0 !== n.type ? n.type.match(/^image\/(gif|png|jpeg)$/) : n.name.match(/\.(gif|png|jpe?g)$/i)) && "undefined" != typeof FileReader) {
                    var o = new FileReader,
                        s = this.$preview,
                        r = this.$element;
                    o.onload = function(t) {
                        var o = e("<img>");
                        o[0].src = t.target.result, i[0].result = t.target.result, r.find(".fileinput-filename").text(n.name), "none" != s.css("max-height") && o.css("max-height", parseInt(s.css("max-height"), 10) - parseInt(s.css("padding-top"), 10) - parseInt(s.css("padding-bottom"), 10) - parseInt(s.css("border-top"), 10) - parseInt(s.css("border-bottom"), 10)), s.html(o), r.addClass("fileinput-exists").removeClass("fileinput-new"), r.trigger("change.bs.fileinput", i)
                    }, o.readAsDataURL(n)
                } else this.$element.find(".fileinput-filename").text(n.name), this.$preview.text(n.name), this.$element.addClass("fileinput-exists").removeClass("fileinput-new"), this.$element.trigger("change.bs.fileinput")
            } else this.clear()
        }, i.prototype.clear = function(e) {
            if (e && e.preventDefault(), this.$hidden.val(""), this.$hidden.attr("name", this.name), this.$input.attr("name", ""), t) {
                var i = this.$input.clone(!0);
                this.$input.after(i), this.$input.remove(), this.$input = i
            } else this.$input.val("");
            this.$preview.html(""), this.$element.find(".fileinput-filename").text(""), this.$element.addClass("fileinput-new").removeClass("fileinput-exists"), void 0 !== e && (this.$input.trigger("change"), this.$element.trigger("clear.bs.fileinput"))
        }, i.prototype.reset = function() {
            this.clear(), this.$hidden.val(this.original.hiddenVal), this.$preview.html(this.original.preview), this.$element.find(".fileinput-filename").text(""), this.original.exists ? this.$element.addClass("fileinput-exists").removeClass("fileinput-new") : this.$element.addClass("fileinput-new").removeClass("fileinput-exists"), this.$element.trigger("reset.bs.fileinput")
        }, i.prototype.trigger = function(e) {
            this.$input.trigger("click"), e.preventDefault()
        };
        var n = e.fn.fileinput;
        e.fn.fileinput = function(t) {
            return this.each((function() {
                var n = e(this),
                    o = n.data("bs.fileinput");
                o || n.data("bs.fileinput", o = new i(this, t)), "string" == typeof t && o[t]()
            }))
        }, e.fn.fileinput.Constructor = i, e.fn.fileinput.noConflict = function() {
            return e.fn.fileinput = n, this
        }, e(document).on("click.fileinput.data-api", '[data-provides="fileinput"]', (function(t) {
            var i = e(this);
            if (!i.data("bs.fileinput")) {
                i.fileinput(i.data());
                var n = e(t.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');
                n.length > 0 && (t.preventDefault(), n.trigger("click.bs.fileinput"))
            }
        }))
    }(window.jQuery),
    function(e) {
        "use strict";

        function t(t, i) {
            this.itemsArray = [], this.$element = e(t), this.$element.hide(), this.isSelect = "SELECT" === t.tagName, this.multiple = this.isSelect && t.hasAttribute("multiple"), this.objectItems = i && i.itemValue, this.placeholderText = t.hasAttribute("placeholder") ? this.$element.attr("placeholder") : "", this.inputSize = Math.max(1, this.placeholderText.length), this.$container = e('<div class="bootstrap-tagsinput"></div>'), this.$input = e('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container), this.$element.after(this.$container);
            var n = (this.inputSize < 3 ? 3 : this.inputSize) + "em";
            this.$input.get(0).style.cssText = "width: " + n + " !important;", this.build(i)
        }

        function i(e, t) {
            if ("function" != typeof e[t]) {
                var i = e[t];
                e[t] = function(e) {
                    return e[i]
                }
            }
        }

        function n(e, t) {
            if ("function" != typeof e[t]) {
                var i = e[t];
                e[t] = function() {
                    return i
                }
            }
        }

        function o(e) {
            return e ? l.text(e).html() : ""
        }

        function s(e) {
            var t = 0;
            if (document.selection) {
                e.focus();
                var i = document.selection.createRange();
                i.moveStart("character", -e.value.length), t = i.text.length
            } else(e.selectionStart || "0" == e.selectionStart) && (t = e.selectionStart);
            return t
        }

        function r(t, i) {
            var n = !1;
            return e.each(i, (function(e, i) {
                if ("number" == typeof i && t.which === i) return n = !0, !1;
                if (t.which === i.which) {
                    var o = !i.hasOwnProperty("altKey") || t.altKey === i.altKey,
                        s = !i.hasOwnProperty("shiftKey") || t.shiftKey === i.shiftKey,
                        r = !i.hasOwnProperty("ctrlKey") || t.ctrlKey === i.ctrlKey;
                    if (o && s && r) return n = !0, !1
                }
            })), n
        }
        var a = {
            tagClass: function() {
                return "label label-info"
            },
            itemValue: function(e) {
                return e ? e.toString() : e
            },
            itemText: function(e) {
                return this.itemValue(e)
            },
            freeInput: !0,
            addOnBlur: !0,
            maxTags: void 0,
            maxChars: void 0,
            confirmKeys: [13, 44],
            onTagExists: function(e, t) {
                t.hide().fadeIn()
            },
            trimValue: !1,
            allowDuplicates: !1
        };
        t.prototype = {
            constructor: t,
            add: function(t, i) {
                var n = this;
                if (!(n.options.maxTags && n.itemsArray.length >= n.options.maxTags || !1 !== t && !t)) {
                    if ("string" == typeof t && n.options.trimValue && (t = e.trim(t)), "object" == typeof t && !n.objectItems) throw "Can't add objects when itemValue option is not set";
                    if (!t.toString().match(/^\s*$/)) {
                        if (n.isSelect && !n.multiple && n.itemsArray.length > 0 && n.remove(n.itemsArray[0]), "string" == typeof t && "INPUT" === this.$element[0].tagName) {
                            var s = t.split(",");
                            if (s.length > 1) {
                                for (var r = 0; r < s.length; r++) this.add(s[r], !0);
                                return void(i || n.pushVal())
                            }
                        }
                        var a = n.options.itemValue(t),
                            l = n.options.itemText(t),
                            d = n.options.tagClass(t),
                            c = e.grep(n.itemsArray, (function(e) {
                                return n.options.itemValue(e) === a
                            }))[0];
                        if (!c || n.options.allowDuplicates) {
                            if (!(n.items().toString().length + t.length + 1 > n.options.maxInputLength)) {
                                var u = e.Event("beforeItemAdd", {
                                    item: t,
                                    cancel: !1
                                });
                                if (n.$element.trigger(u), !u.cancel) {
                                    n.itemsArray.push(t);
                                    var p = e('<span class="tag ' + o(d) + '">' + o(l) + '<span data-role="remove"></span></span>');
                                    if (p.data("item", t), n.findInputWrapper().before(p), p.after(" "), n.isSelect && !e('option[value="' + encodeURIComponent(a) + '"]', n.$element)[0]) {
                                        var h = e("<option selected>" + o(l) + "</option>");
                                        h.data("item", t), h.attr("value", a), n.$element.append(h)
                                    }
                                    i || n.pushVal(), (n.options.maxTags === n.itemsArray.length || n.items().toString().length === n.options.maxInputLength) && n.$container.addClass("bootstrap-tagsinput-max"), n.$element.trigger(e.Event("itemAdded", {
                                        item: t
                                    }))
                                }
                            }
                        } else if (n.options.onTagExists) {
                            var f = e(".tag", n.$container).filter((function() {
                                return e(this).data("item") === c
                            }));
                            n.options.onTagExists(t, f)
                        }
                    }
                }
            },
            remove: function(t, i) {
                var n = this;
                if (n.objectItems && (t = (t = "object" == typeof t ? e.grep(n.itemsArray, (function(e) {
                        return n.options.itemValue(e) == n.options.itemValue(t)
                    })) : e.grep(n.itemsArray, (function(e) {
                        return n.options.itemValue(e) == t
                    })))[t.length - 1]), t) {
                    var o = e.Event("beforeItemRemove", {
                        item: t,
                        cancel: !1
                    });
                    if (n.$element.trigger(o), o.cancel) return;
                    e(".tag", n.$container).filter((function() {
                        return e(this).data("item") === t
                    })).remove(), e("option", n.$element).filter((function() {
                        return e(this).data("item") === t
                    })).remove(), -1 !== e.inArray(t, n.itemsArray) && n.itemsArray.splice(e.inArray(t, n.itemsArray), 1)
                }
                i || n.pushVal(), n.options.maxTags > n.itemsArray.length && n.$container.removeClass("bootstrap-tagsinput-max"), n.$element.trigger(e.Event("itemRemoved", {
                    item: t
                }))
            },
            removeAll: function() {
                var t = this;
                for (e(".tag", t.$container).remove(), e("option", t.$element).remove(); t.itemsArray.length > 0;) t.itemsArray.pop();
                t.pushVal()
            },
            refresh: function() {
                var t = this;
                e(".tag", t.$container).each((function() {
                    var i = e(this),
                        n = i.data("item"),
                        s = t.options.itemValue(n),
                        r = t.options.itemText(n),
                        a = t.options.tagClass(n);
                    (i.attr("class", null), i.addClass("tag " + o(a)), i.contents().filter((function() {
                        return 3 == this.nodeType
                    }))[0].nodeValue = o(r), t.isSelect) && e("option", t.$element).filter((function() {
                        return e(this).data("item") === n
                    })).attr("value", s)
                }))
            },
            items: function() {
                return this.itemsArray
            },
            pushVal: function() {
                var t = this,
                    i = e.map(t.items(), (function(e) {
                        return t.options.itemValue(e).toString()
                    }));
                t.$element.val(i, !0).trigger("change")
            },
            build: function(t) {
                var o = this;
                if (o.options = e.extend({}, a, t), o.objectItems && (o.options.freeInput = !1), i(o.options, "itemValue"), i(o.options, "itemText"), n(o.options, "tagClass"), o.options.typeahead) {
                    var l = o.options.typeahead || {};
                    n(l, "source"), o.$input.typeahead(e.extend({}, l, {
                        source: function(t, i) {
                            function n(e) {
                                for (var t = [], n = 0; n < e.length; n++) {
                                    var r = o.options.itemText(e[n]);
                                    s[r] = e[n], t.push(r)
                                }
                                i(t)
                            }
                            this.map = {};
                            var s = this.map,
                                r = l.source(t);
                            e.isFunction(r.success) ? r.success(n) : e.isFunction(r.then) ? r.then(n) : e.when(r).then(n)
                        },
                        updater: function(e) {
                            o.add(this.map[e])
                        },
                        matcher: function(e) {
                            return -1 !== e.toLowerCase().indexOf(this.query.trim().toLowerCase())
                        },
                        sorter: function(e) {
                            return e.sort()
                        },
                        highlighter: function(e) {
                            var t = new RegExp("(" + this.query + ")", "gi");
                            return e.replace(t, "<strong>$1</strong>")
                        }
                    }))
                }
                if (o.options.typeaheadjs) {
                    var d = o.options.typeaheadjs || {};
                    o.$input.typeahead(null, d).on("typeahead:selected", e.proxy((function(e, t) {
                        o.add(d.valueKey ? t[d.valueKey] : t), o.$input.typeahead("val", "")
                    }), o))
                }
                o.$container.on("click", e.proxy((function() {
                    o.$element.attr("disabled") || o.$input.removeAttr("disabled"), o.$input.focus()
                }), o)), o.options.addOnBlur && o.options.freeInput && o.$input.on("focusout", e.proxy((function() {
                    0 === e(".typeahead, .twitter-typeahead", o.$container).length && (o.add(o.$input.val()), o.$input.val(""))
                }), o)), o.$container.on("keydown", "input", e.proxy((function(t) {
                    var i = e(t.target),
                        n = o.findInputWrapper();
                    if (o.$element.attr("disabled")) o.$input.attr("disabled", "disabled");
                    else {
                        switch (t.which) {
                            case 8:
                                if (0 === s(i[0])) {
                                    var r = n.prev();
                                    r && o.remove(r.data("item"))
                                }
                                break;
                            case 46:
                                if (0 === s(i[0])) {
                                    var a = n.next();
                                    a && o.remove(a.data("item"))
                                }
                                break;
                            case 37:
                                var l = n.prev();
                                0 === i.val().length && l[0] && (l.before(n), i.focus());
                                break;
                            case 39:
                                var d = n.next();
                                0 === i.val().length && d[0] && (d.after(n), i.focus())
                        }
                        var c = i.val().length;
                        Math.ceil(c / 5), i.attr("size", Math.max(this.inputSize, i.val().length))
                    }
                }), o)), o.$container.on("keypress", "input", e.proxy((function(t) {
                    var i = e(t.target);
                    if (o.$element.attr("disabled")) o.$input.attr("disabled", "disabled");
                    else {
                        var n = i.val(),
                            s = o.options.maxChars && n.length >= o.options.maxChars;
                        o.options.freeInput && (r(t, o.options.confirmKeys) || s) && (o.add(s ? n.substr(0, o.options.maxChars) : n), i.val(""), t.preventDefault());
                        var a = i.val().length;
                        Math.ceil(a / 5), i.attr("size", Math.max(this.inputSize, i.val().length))
                    }
                }), o)), o.$container.on("click", "[data-role=remove]", e.proxy((function(t) {
                    o.$element.attr("disabled") || o.remove(e(t.target).closest(".tag").data("item"))
                }), o)), o.options.itemValue === a.itemValue && ("INPUT" === o.$element[0].tagName ? o.add(o.$element.val()) : e("option", o.$element).each((function() {
                    o.add(e(this).attr("value"), !0)
                })))
            },
            destroy: function() {
                var e = this;
                e.$container.off("keypress", "input"), e.$container.off("click", "[role=remove]"), e.$container.remove(), e.$element.removeData("tagsinput"), e.$element.show()
            },
            focus: function() {
                this.$input.focus()
            },
            input: function() {
                return this.$input
            },
            findInputWrapper: function() {
                for (var t = this.$input[0], i = this.$container[0]; t && t.parentNode !== i;) t = t.parentNode;
                return e(t)
            }
        }, e.fn.tagsinput = function(i, n) {
            var o = [];
            return this.each((function() {
                var s = e(this).data("tagsinput");
                if (s)
                    if (i || n) {
                        if (void 0 !== s[i]) {
                            var r = s[i](n);
                            void 0 !== r && o.push(r)
                        }
                    } else o.push(s);
                else s = new t(this, i), e(this).data("tagsinput", s), o.push(s), "SELECT" === this.tagName && e("option", e(this)).attr("selected", "selected"), e(this).val(e(this).val())
            })), "string" == typeof i ? o.length > 1 ? o : o[0] : o
        }, e.fn.tagsinput.Constructor = t;
        var l = e("<div />");
        e((function() {
            e("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput()
        }))
    }(window.jQuery),
    function(e, t, i, n) {
        function o(t, i) {
            this.options = e.extend(!0, {}, s, i), this.input = t, this.$input = e(t), this._defaults = s, this._name = "geocomplete", this.init()
        }
        var s = {
                bounds: !0,
                country: null,
                map: !1,
                details: !1,
                detailsAttribute: "name",
                autoselect: !0,
                location: !1,
                mapOptions: {
                    zoom: 14,
                    scrollwheel: !1,
                    mapTypeId: "roadmap"
                },
                markerOptions: {
                    draggable: !1
                },
                maxZoom: 16,
                types: ["geocode"],
                blur: !1,
                geocodeAfterResult: !1,
                restoreValueAfterBlur: !1
            },
            r = "street_address route intersection political country administrative_area_level_1 administrative_area_level_2 administrative_area_level_3 colloquial_area locality sublocality neighborhood premise subpremise postal_code natural_feature airport park point_of_interest post_box street_number floor room lat lng viewport location formatted_address location_type bounds".split(" "),
            a = "id place_id url website vicinity reference name rating international_phone_number icon formatted_phone_number".split(" ");
        e.extend(o.prototype, {
            init: function() {
                this.initMap(), this.initMarker(), this.initGeocoder(), this.initDetails(), this.initLocation()
            },
            initMap: function() {
                this.options.map && ("function" != typeof this.options.map.setCenter ? (this.map = new google.maps.Map(e(this.options.map)[0], this.options.mapOptions), google.maps.event.addListener(this.map, "click", e.proxy(this.mapClicked, this)), google.maps.event.addListener(this.map, "zoom_changed", e.proxy(this.mapZoomed, this))) : this.map = this.options.map)
            },
            initMarker: function() {
                if (this.map) {
                    var t = e.extend(this.options.markerOptions, {
                        map: this.map
                    });
                    t.disabled || (this.marker = new google.maps.Marker(t), google.maps.event.addListener(this.marker, "dragend", e.proxy(this.markerDragged, this)))
                }
            },
            initGeocoder: function() {
                var t = {
                    types: this.options.types,
                    bounds: !0 === this.options.bounds ? null : this.options.bounds
                };
                this.options.country && (t.componentRestrictions = {
                    country: this.options.country
                }), this.autocomplete = new google.maps.places.Autocomplete(this.input, t), this.geocoder = new google.maps.Geocoder, this.map && !0 === this.options.bounds && this.autocomplete.bindTo("bounds", this.map), google.maps.event.addListener(this.autocomplete, "place_changed", e.proxy(this.placeChanged, this)), this.$input.on("keypress." + this._name, (function(e) {
                    if (13 === e.keyCode) return !1
                })), !0 === this.options.geocodeAfterResult && this.$input.bind("keypress." + this._name, e.proxy((function() {
                    9 != event.keyCode && !0 === this.selected && (this.selected = !1)
                }), this)), this.$input.bind("geocode." + this._name, e.proxy((function() {
                    this.find()
                }), this)), this.$input.bind("geocode:result." + this._name, e.proxy((function() {
                    this.lastInputVal = this.$input.val()
                }), this)), !0 === this.options.blur && this.$input.on("blur." + this._name, e.proxy((function() {
                    !0 === this.options.geocodeAfterResult && !0 === this.selected || (!0 === this.options.restoreValueAfterBlur && !0 === this.selected ? setTimeout(e.proxy(this.restoreLastValue, this), 0) : this.find())
                }), this))
            },
            initDetails: function() {
                function t(e) {
                    o[e] = i.find("[" + n + "=" + e + "]")
                }
                if (this.options.details) {
                    var i = e(this.options.details),
                        n = this.options.detailsAttribute,
                        o = {};
                    e.each(r, (function(e, i) {
                        t(i), t(i + "_short")
                    })), e.each(a, (function(e, i) {
                        t(i)
                    })), this.$details = i, this.details = o
                }
            },
            initLocation: function() {
                var e, t = this.options.location;
                t && ("string" != typeof t ? (t instanceof Array && (e = new google.maps.LatLng(t[0], t[1])), t instanceof google.maps.LatLng && (e = t), e && (this.map && this.map.setCenter(e), this.marker && this.marker.setPosition(e))) : this.find(t))
            },
            destroy: function() {
                this.map && (google.maps.event.clearInstanceListeners(this.map), google.maps.event.clearInstanceListeners(this.marker)), this.autocomplete.unbindAll(), google.maps.event.clearInstanceListeners(this.autocomplete), google.maps.event.clearInstanceListeners(this.input), this.$input.removeData(), this.$input.off(this._name), this.$input.unbind("." + this._name)
            },
            find: function(e) {
                this.geocode({
                    address: e || this.$input.val()
                })
            },
            geocode: function(t) {
                this.options.bounds && !t.bounds && (!0 === this.options.bounds ? t.bounds = this.map && this.map.getBounds() : t.bounds = this.options.bounds), this.options.country && (t.region = this.options.country), this.geocoder.geocode(t, e.proxy(this.handleGeocode, this))
            },
            selectFirstResult: function() {
                var t = "";
                e(".pac-item-selected")[0] && (t = "-selected");
                var i = e(".pac-container:last .pac-item" + t + ":first span:nth-child(2)").text(),
                    n = e(".pac-container:last .pac-item" + t + ":first span:nth-child(3)").text(),
                    o = i;
                return n && (o += " - " + n), this.$input.val(o), o
            },
            restoreLastValue: function() {
                this.lastInputVal && this.$input.val(this.lastInputVal)
            },
            handleGeocode: function(e, t) {
                if (t === google.maps.GeocoderStatus.OK) {
                    var i = e[0];
                    this.$input.val(i.formatted_address), this.update(i), e.length > 1 && this.trigger("geocode:multiple", e)
                } else this.trigger("geocode:error", t)
            },
            trigger: function(e, t) {
                this.$input.trigger(e, [t])
            },
            center: function(e) {
                e.viewport ? (this.map.fitBounds(e.viewport), this.map.getZoom() > this.options.maxZoom && this.map.setZoom(this.options.maxZoom)) : (this.map.setZoom(this.options.maxZoom), this.map.setCenter(e.location)), this.marker && (this.marker.setPosition(e.location), this.marker.setAnimation(this.options.markerOptions.animation))
            },
            update: function(e) {
                this.map && this.center(e.geometry), this.$details && this.fillDetails(e), this.trigger("geocode:result", e)
            },
            fillDetails: function(t) {
                var i = {},
                    n = t.geometry,
                    o = n.viewport,
                    s = n.bounds;
                e.each(t.address_components, (function(t, n) {
                    n.types[0];
                    e.each(n.types, (function(e, t) {
                        i[t] = n.long_name, i[t + "_short"] = n.short_name
                    }))
                })), e.each(a, (function(e, n) {
                    i[n] = t[n]
                })), e.extend(i, {
                    formatted_address: t.formatted_address,
                    location_type: n.location_type || "PLACES",
                    viewport: o,
                    bounds: s,
                    location: n.location,
                    lat: n.location.lat(),
                    lng: n.location.lng()
                }), e.each(this.details, e.proxy((function(e, t) {
                    var n = i[e];
                    this.setDetail(t, n)
                }), this)), this.data = i
            },
            setDetail: function(e, t) {
                t === n ? t = "" : "function" == typeof t.toUrlValue && (t = t.toUrlValue()), e.is(":input") ? e.val(t) : e.text(t)
            },
            markerDragged: function(e) {
                this.trigger("geocode:dragged", e.latLng)
            },
            mapClicked: function(e) {
                this.trigger("geocode:click", e.latLng)
            },
            mapZoomed: function() {
                this.trigger("geocode:zoom", this.map.getZoom())
            },
            resetMarker: function() {
                this.marker.setPosition(this.data.location), this.setDetail(this.details.lat, this.data.location.lat()), this.setDetail(this.details.lng, this.data.location.lng())
            },
            placeChanged: function() {
                var e = this.autocomplete.getPlace();
                if (this.selected = !0, e.geometry) this.update(e);
                else if (this.options.autoselect) {
                    var t = this.selectFirstResult();
                    this.find(t)
                }
            }
        }), e.fn.geocomplete = function(t) {
            var i = "plugin_geocomplete";
            if ("string" == typeof t) {
                var n = e(this).data(i) || e(this).geocomplete().data(i),
                    s = n[t];
                return "function" == typeof s ? (s.apply(n, Array.prototype.slice.call(arguments, 1)), e(this)) : (2 == arguments.length && (s = arguments[1]), s)
            }
            return this.each((function() {
                var n = e.data(this, i);
                n || (n = new o(this, t), e.data(this, i, n))
            }))
        }
    }(jQuery, window, document),
    function() {
        jQuery((function() {
            $("#load-latest-backfill-ajax").length ? $.ajax({
                type: "GET",
                url: "/backfills/latest_jobs.js",
                dataType: "script",
                data: {
                    job_id: $("#load-latest-backfill-ajax").data("job-id")
                }
            }) : $("#load-backfill-ajax").length && $.ajax({
                type: "GET",
                url: "/backfills/jobs.js",
                dataType: "script",
                data: JSON.parse($("[name='backfill_parameters']").val())
            })
        }))
    }.call(this),
    function(e) {
        var t = !1;
        if ("function" == typeof define && define.amd && (define(e), t = !0), "object" == typeof exports && (module.exports = e(), t = !0), !t) {
            var i = window.Cookies,
                n = window.Cookies = e();
            n.noConflict = function() {
                return window.Cookies = i, n
            }
        }
    }((function() {
        function e() {
            for (var e = 0, t = {}; e < arguments.length; e++) {
                var i = arguments[e];
                for (var n in i) t[n] = i[n]
            }
            return t
        }

        function t(i) {
            function n(t, o, s) {
                var r;
                if ("undefined" != typeof document) {
                    if (arguments.length > 1) {
                        if ("number" == typeof(s = e({
                                path: "/"
                            }, n.defaults, s)).expires) {
                            var a = new Date;
                            a.setMilliseconds(a.getMilliseconds() + 864e5 * s.expires), s.expires = a
                        }
                        s.expires = s.expires ? s.expires.toUTCString() : "";
                        try {
                            r = JSON.stringify(o), /^[\{\[]/.test(r) && (o = r)
                        } catch (e) {}
                        o = i.write ? i.write(o, t) : encodeURIComponent(String(o)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = (t = (t = encodeURIComponent(String(t))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape);
                        var l = "";
                        for (var d in s) s[d] && (l += "; " + d, !0 !== s[d] && (l += "=" + s[d]));
                        return document.cookie = t + "=" + o + l
                    }
                    t || (r = {});
                    for (var c = document.cookie ? document.cookie.split("; ") : [], u = /(%[0-9A-Z]{2})+/g, p = 0; p < c.length; p++) {
                        var h = c[p].split("="),
                            f = h.slice(1).join("=");
                        this.json || '"' !== f.charAt(0) || (f = f.slice(1, -1));
                        try {
                            var m = h[0].replace(u, decodeURIComponent);
                            if (f = i.read ? i.read(f, m) : i(f, m) || f.replace(u, decodeURIComponent), this.json) try {
                                f = JSON.parse(f)
                            } catch (e) {}
                            if (t === m) {
                                r = f;
                                break
                            }
                            t || (r[m] = f)
                        } catch (e) {}
                    }
                    return r
                }
            }
            return n.set = n, n.get = function(e) {
                return n.call(n, e)
            }, n.getJSON = function() {
                return n.apply({
                    json: !0
                }, [].slice.call(arguments))
            }, n.defaults = {}, n.remove = function(t, i) {
                n(t, "", e(i, {
                    expires: -1
                }))
            }, n.withConverter = t, n
        }
        return t((function() {}))
    })),
    function() {
        jQuery((function() {
            if ($("#site_notification").length) return $.ajax({
                type: "GET",
                url: "/site_notifications"
            })
        }))
    }.call(this),
    function(e) {
        var t, i = {
            title: "Are you sure?",
            commit: "Confirm",
            commitClass: "btn-danger",
            cancel: "Cancel",
            cancelClass: "btn-default",
            fade: !0,
            verifyClass: "form-control",
            elements: ["a[data-confirm]", "button[data-confirm]", "input[type=submit][data-confirm]"],
            focus: "commit",
            zIndex: 1050,
            modalClass: !1,
            modalCloseContent: "&times;",
            show: !0
        };
        if (window.dataConfirmModal = {
                setDefaults: function(i) {
                    t = e.extend(t, i)
                },
                restoreDefaults: function() {
                    t = e.extend({}, i)
                },
                confirm: function(e) {
                    var t = a(e);
                    t.spawn(), t.on("hidden.bs.modal", (function() {
                        t.remove()
                    })), t.find(".commit").on("click", (function() {
                        e.onConfirm && e.onConfirm.call && e.onConfirm.call(), t.modal("hide")
                    })), t.find(".cancel").on("click", (function() {
                        e.onCancel && e.onCancel.call && e.onCancel.call(), t.modal("hide")
                    }))
                }
            }, dataConfirmModal.restoreDefaults(), null == e.fn.modal) throw new Error("The bootstrap modal plugin does not appear to be loaded.");
        if (null == e.fn.modal.Constructor) throw new Error("The bootstrap modal plugin does not have a Constructor ?!?");
        if (null == e.fn.modal.Constructor.VERSION) throw new Error("The bootstrap modal plugin does not have its version defined ?!?");
        var n = e.fn.modal.Constructor.VERSION,
            o = n.match(/^(\d)\./);
        if (!o) throw new Error("Cannot identify Bootstrap version. Version string: " + n);
        var s = parseInt(o[1]);
        if (3 != s && 4 != s) throw new Error("Unsupported bootstrap version: " + s + ". data-confirm-modal supports version 3 and 4.");
        var r = function(e) {
                var t = {
                        title: e.data("title") || e.attr("title") || e.data("original-title"),
                        text: e.data("confirm"),
                        focus: e.data("focus"),
                        method: e.data("method"),
                        modalClass: e.data("modal-class"),
                        modalCloseContent: e.data("modal-close-content"),
                        commit: e.data("commit"),
                        commitClass: e.data("commit-class"),
                        cancel: e.data("cancel"),
                        cancelClass: e.data("cancel-class"),
                        remote: e.data("remote"),
                        verify: e.data("verify"),
                        verifyRegexp: e.data("verify-regexp"),
                        verifyLabel: e.data("verify-text"),
                        verifyRegexpCaseInsensitive: e.data("verify-regexp-caseinsensitive"),
                        backdrop: e.data("backdrop"),
                        keyboard: e.data("keyboard"),
                        show: e.data("show")
                    },
                    i = a(t);
                return i.find(".commit").on("click", (function() {
                    e.get(0).click(), i.modal("hide")
                })), i
            },
            a = function(i) {
                var n, o = "confirm-modal-" + String(Math.random()).slice(2, -1),
                    r = t.fade ? "fade" : "",
                    a = i.modalClass ? i.modalClass : t.modalClass,
                    l = '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">' + (i.modalCloseContent ? i.modalCloseContent : t.modalCloseContent) + "</button>",
                    d = '<h5 id="' + o + 'Label" class="modal-title"></h5> ';
                switch (s) {
                    case 3:
                        n = l + d;
                        break;
                    case 4:
                        n = d + l
                }
                var c, u, p = e('<div id="' + o + '" class="modal ' + a + " " + r + '" tabindex="-1" role="dialog" aria-labelledby="' + o + 'Label" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">' + n + '</div><div class="modal-body"></div><div class="modal-footer"><button class="btn cancel" data-dismiss="modal" aria-hidden="true"></button><button class="btn commit"></button></div></div></div></div>');
                c = u = t.zIndex, e(".modal.in").not("#" + o).each((function() {
                    (u = parseInt(e(this).css("z-index"), 10)) > c && (c = u)
                })), p.css("z-index", parseInt(c) + 1), p.find(".modal-title").text(i.title || t.title);
                var h = p.find(".modal-body");
                e.each((i.text || "").split(/\n{2}/), (function(t, i) {
                    h.append(e("<p/>").html(i))
                }));
                var f = p.find(".commit");
                f.text(i.commit || t.commit), f.addClass(i.commitClass || t.commitClass);
                var m, v = p.find(".cancel");
                if (v.text(i.cancel || t.cancel), v.addClass(i.cancelClass || t.cancelClass), i.remote && f.attr("data-dismiss", "modal"), i.verify || i.verifyRegexp) {
                    var g;
                    if (f.prop("disabled", !0), i.verifyRegexp) {
                        var y = i.verifyRegexpCaseInsensitive,
                            b = i.verifyRegexp,
                            w = new RegExp(b, y ? "i" : "");
                        g = function(e) {
                            return e.match(w)
                        }
                    } else g = function(e) {
                        return i.verify == e
                    };
                    var x = e("<input/>", {
                        type: "text",
                        class: t.verifyClass
                    }).on("keyup", (function() {
                        f.prop("disabled", !g(e(this).val()))
                    }));
                    p.on("shown.bs.modal", (function() {
                        x.focus()
                    })), p.on("hidden.bs.modal", (function() {
                        x.val("").trigger("keyup")
                    })), i.verifyLabel && h.append(e("<p>", {
                        text: i.verifyLabel
                    })), h.append(x)
                }
                return m = i.focus ? i.focus : "delete" == i.method ? "cancel" : t.focus, m = p.find("." + m), p.on("shown.bs.modal", (function() {
                    m.focus()
                })), e("body").append(p), p.spawn = function() {
                    return p.modal(e.extend({}, {
                        backdrop: i.backdrop,
                        keyboard: i.keyboard,
                        show: i.show
                    }))
                }, p
            };
        if (e.fn.getConfirmModal = function() {
                var t = e(this),
                    i = t.data("confirm-modal");
                return i || (i = r(t), t.data("confirm-modal", i)), i
            }, e.fn.confirmModal = function() {
                var t = e(this).getConfirmModal();
                return t.spawn(), t
            }, window.Rails || e.rails) {
            var l = window.confirm;
            e(document).delegate(t.elements.join(", "), "confirm", (function() {
                var t = e(this).getConfirmModal();
                return t.is(":visible") ? (window.confirm = function() {
                    return !0
                }, t.one("hidden.bs.modal", (function() {
                    window.confirm = l
                })), !0) : (t.spawn(), !1)
            }))
        }
    }(jQuery);
var trustArcLevels = {
    NO_PREFERENCE: 0,
    REQUIRED: 1,
    FUNCTIONAL: 2,
    ADVERTISING: 3
};
window.trustArc = window.trustArc || {}, trustArc.loaded = !1, trustArc.using_cma = !1, trustArc.registry = trustArc.registry || {}, trustArc.disabled = !1, trustArc.implicit = trustArcLevels.REQUIRED,
    function() {
        window.track_click = function(e) {
            return $.ajax({
                type: "POST",
                url: "/job_activities/js_track.js",
                data: {
                    data: e
                }
            })
        }, window.track_links = function(e) {
            return $(e).on("click", (function() {
                return track_click($(this).data("track"))
            }))
        }
    }.call(this);