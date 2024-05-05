! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).DOMPurify = t()
}(this, function() {
    "use strict";

    function He(e) {
        return (He = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        })(e)
    }

    function o(e, t) {
        return (o = Object.setPrototypeOf || function(e, t) {
            return e.__proto__ = t, e
        })(e, t)
    }

    function r(e, t, n) {
        return (r = function() {
            if ("undefined" != typeof Reflect && Reflect.construct && !Reflect.construct.sham) {
                if ("function" == typeof Proxy) return 1;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 1
                } catch (e) {}
            }
        }() ? Reflect.construct : function(e, t, n) {
            var r = [null];
            r.push.apply(r, t);
            t = new(Function.bind.apply(e, r));
            return n && o(t, n.prototype), t
        }).apply(null, arguments)
    }

    function Ue(e) {
        return function(e) {
            if (Array.isArray(e)) return a(e)
        }(e) || function(e) {
            if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
        }(e) || function(e, t) {
            var n;
            if (e) return "string" == typeof e ? a(e, t) : "Map" === (n = "Object" === (n = Object.prototype.toString.call(e).slice(8, -1)) && e.constructor ? e.constructor.name : n) || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? a(e, t) : void 0
        }(e) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }

    function a(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
    }
    var i, l = Object.hasOwnProperty,
        c = Object.setPrototypeOf,
        s = Object.isFrozen,
        u = Object.getPrototypeOf,
        m = Object.getOwnPropertyDescriptor,
        ze = Object.freeze,
        e = Object.seal,
        f = Object.create,
        t = "undefined" != typeof Reflect && Reflect,
        p = (p = t.apply) || function(e, t, n) {
            return e.apply(t, n)
        },
        ze = ze || function(e) {
            return e
        },
        e = e || function(e) {
            return e
        },
        d = (d = t.construct) || function(e, t) {
            return r(e, Ue(t))
        },
        ot = h(Array.prototype.forEach),
        je = h(Array.prototype.pop),
        Be = h(Array.prototype.push),
        Pe = h(String.prototype.toLowerCase),
        at = h(String.prototype.match),
        Ge = h(String.prototype.replace),
        it = h(String.prototype.indexOf),
        lt = h(String.prototype.trim),
        We = h(RegExp.prototype.test),
        qe = (i = TypeError, function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            return d(i, t)
        });

    function h(o) {
        return function(e) {
            for (var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
            return p(o, e, n)
        }
    }

    function Ye(e, t, n) {
        n = n || Pe, c && c(e, null);
        for (var r = t.length; r--;) {
            var o, a = t[r];
            "string" == typeof a && (o = n(a)) !== a && (s(t) || (t[r] = o), a = o), e[a] = !0
        }
        return e
    }

    function Ke(e) {
        var t, n = f(null);
        for (t in e) p(l, e, [t]) && (n[t] = e[t]);
        return n
    }

    function Ve(e, t) {
        for (; null !== e;) {
            var n = m(e, t);
            if (n) {
                if (n.get) return h(n.get);
                if ("function" == typeof n.value) return h(n.value)
            }
            e = u(e)
        }
        return function(e) {
            return console.warn("fallback value for", e), null
        }
    }
    var $e = ze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]),
        Xe = ze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]),
        Ze = ze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]),
        ct = ze(["animate", "color-profile", "cursor", "discard", "fedropshadow", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]),
        Je = ze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover"]),
        st = ze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]),
        Qe = ze(["#text"]),
        et = ze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"]),
        tt = ze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]),
        nt = ze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]),
        rt = ze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]),
        ut = e(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
        mt = e(/<%[\w\W]*|[\w\W]*%>/gm),
        ft = e(/^data-[\-\w.\u00B7-\uFFFF]/),
        pt = e(/^aria-[\-\w]+$/),
        dt = e(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),
        ht = e(/^(?:\w+script|data):/i),
        gt = e(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
        yt = e(/^html$/i);
    return function F(e) {
        var l = 0 < arguments.length && void 0 !== e ? e : "undefined" == typeof window ? null : window,
            s = function(e) {
                return F(e)
            };
        if (s.version = "2.4.0", s.removed = [], l && l.document && 9 === l.document.nodeType) {
            var c = l.document,
                o = l.document,
                H = l.DocumentFragment,
                e = l.HTMLTemplateElement,
                u = l.Node,
                U = l.Element,
                t = l.NodeFilter,
                z = void 0 === (n = l.NamedNodeMap) ? l.NamedNodeMap || l.MozNamedAttrMap : n,
                j = l.HTMLFormElement,
                B = l.DOMParser,
                m = l.trustedTypes,
                P = Ve(n = U.prototype, "cloneNode"),
                G = Ve(n, "nextSibling"),
                W = Ve(n, "childNodes"),
                f = Ve(n, "parentNode"),
                p = ("function" == typeof e && (n = o.createElement("template")).content && n.content.ownerDocument && (o = n.content.ownerDocument), function(e, t) {
                    if ("object" !== He(e) || "function" != typeof e.createPolicy) return null;
                    var n = null,
                        r = "data-tt-policy-suffix",
                        t = "dompurify" + ((n = t.currentScript && t.currentScript.hasAttribute(r) ? t.currentScript.getAttribute(r) : n) ? "#" + n : "");
                    try {
                        return e.createPolicy(t, {
                            createHTML: function(e) {
                                return e
                            },
                            createScriptURL: function(e) {
                                return e
                            }
                        })
                    } catch (e) {
                        return console.warn("TrustedTypes policy " + t + " could not be created."), null
                    }
                }(m, c)),
                q = p ? p.createHTML("") : "",
                e = o,
                a = e.implementation,
                Y = e.createNodeIterator,
                K = e.createDocumentFragment,
                V = e.getElementsByTagName,
                $ = c.importNode,
                n = {};
            try {
                n = Ke(o).documentMode ? o.documentMode : {}
            } catch (e) {}
            var X, i, d, r = {},
                h = (s.isSupported = "function" == typeof f && a && void 0 !== a.createHTMLDocument && 9 !== n, ut),
                g = mt,
                Z = ft,
                J = pt,
                Q = ht,
                ee = gt,
                te = dt,
                y = null,
                ne = Ye({}, [].concat(Ue($e), Ue(Xe), Ue(Ze), Ue(Je), Ue(Qe))),
                b = null,
                re = Ye({}, [].concat(Ue(et), Ue(tt), Ue(nt), Ue(rt))),
                T = Object.seal(Object.create(null, {
                    tagNameCheck: {
                        writable: !0,
                        configurable: !1,
                        enumerable: !0,
                        value: null
                    },
                    attributeNameCheck: {
                        writable: !0,
                        configurable: !1,
                        enumerable: !0,
                        value: null
                    },
                    allowCustomizedBuiltInElements: {
                        writable: !0,
                        configurable: !1,
                        enumerable: !0,
                        value: !1
                    }
                })),
                N = null,
                oe = null,
                ae = !0,
                ie = !0,
                le = !1,
                v = !1,
                A = !1,
                ce = !1,
                se = !1,
                E = !1,
                w = !1,
                S = !1,
                ue = !0,
                me = !1,
                fe = "user-content-",
                pe = !0,
                k = !1,
                _ = {},
                x = null,
                de = Ye({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]),
                he = null,
                ge = Ye({}, ["audio", "video", "img", "source", "image", "track"]),
                ye = null,
                be = Ye({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]),
                Te = "http://www.w3.org/1998/Math/MathML",
                Ne = "http://www.w3.org/2000/svg",
                O = "http://www.w3.org/1999/xhtml",
                D = O,
                ve = ["application/xhtml+xml", "text/html"],
                R = null,
                Ae = o.createElement("form"),
                Ee = function(e) {
                    return e instanceof RegExp || e instanceof Function
                },
                we = function(e) {
                    R && R === e || (e = Ke(e = e && "object" === He(e) ? e : {}), i = i = -1 === ve.indexOf(e.PARSER_MEDIA_TYPE) ? "text/html" : e.PARSER_MEDIA_TYPE, d = "application/xhtml+xml" === i ? function(e) {
                        return e
                    } : Pe, y = "ALLOWED_TAGS" in e ? Ye({}, e.ALLOWED_TAGS, d) : ne, b = "ALLOWED_ATTR" in e ? Ye({}, e.ALLOWED_ATTR, d) : re, ye = "ADD_URI_SAFE_ATTR" in e ? Ye(Ke(be), e.ADD_URI_SAFE_ATTR, d) : be, he = "ADD_DATA_URI_TAGS" in e ? Ye(Ke(ge), e.ADD_DATA_URI_TAGS, d) : ge, x = "FORBID_CONTENTS" in e ? Ye({}, e.FORBID_CONTENTS, d) : de, N = "FORBID_TAGS" in e ? Ye({}, e.FORBID_TAGS, d) : {}, oe = "FORBID_ATTR" in e ? Ye({}, e.FORBID_ATTR, d) : {}, _ = "USE_PROFILES" in e && e.USE_PROFILES, ae = !1 !== e.ALLOW_ARIA_ATTR, ie = !1 !== e.ALLOW_DATA_ATTR, le = e.ALLOW_UNKNOWN_PROTOCOLS || !1, v = e.SAFE_FOR_TEMPLATES || !1, A = e.WHOLE_DOCUMENT || !1, E = e.RETURN_DOM || !1, w = e.RETURN_DOM_FRAGMENT || !1, S = e.RETURN_TRUSTED_TYPE || !1, se = e.FORCE_BODY || !1, ue = !1 !== e.SANITIZE_DOM, me = e.SANITIZE_NAMED_PROPS || !1, pe = !1 !== e.KEEP_CONTENT, k = e.IN_PLACE || !1, te = e.ALLOWED_URI_REGEXP || te, D = e.NAMESPACE || O, e.CUSTOM_ELEMENT_HANDLING && Ee(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (T.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck), e.CUSTOM_ELEMENT_HANDLING && Ee(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (T.attributeNameCheck = e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), e.CUSTOM_ELEMENT_HANDLING && "boolean" == typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (T.allowCustomizedBuiltInElements = e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), v && (ie = !1), w && (E = !0), _ && (y = Ye({}, Ue(Qe)), b = [], !0 === _.html && (Ye(y, $e), Ye(b, et)), !0 === _.svg && (Ye(y, Xe), Ye(b, tt), Ye(b, rt)), !0 === _.svgFilters && (Ye(y, Ze), Ye(b, tt), Ye(b, rt)), !0 === _.mathMl) && (Ye(y, Je), Ye(b, nt), Ye(b, rt)), e.ADD_TAGS && Ye(y = y === ne ? Ke(y) : y, e.ADD_TAGS, d), e.ADD_ATTR && Ye(b = b === re ? Ke(b) : b, e.ADD_ATTR, d), e.ADD_URI_SAFE_ATTR && Ye(ye, e.ADD_URI_SAFE_ATTR, d), e.FORBID_CONTENTS && Ye(x = x === de ? Ke(x) : x, e.FORBID_CONTENTS, d), pe && (y["#text"] = !0), A && Ye(y, ["html", "head", "body"]), y.table && (Ye(y, ["tbody"]), delete N.tbody), ze && ze(e), R = e)
                },
                Se = Ye({}, ["mi", "mo", "mn", "ms", "mtext"]),
                ke = Ye({}, ["foreignobject", "desc", "title", "annotation-xml"]),
                _e = Ye({}, ["title", "style", "font", "a", "script"]),
                M = Ye({}, Xe),
                xe = (Ye(M, Ze), Ye(M, ct), Ye({}, Je)),
                L = (Ye(xe, st), function(t) {
                    Be(s.removed, {
                        element: t
                    });
                    try {
                        t.parentNode.removeChild(t)
                    } catch (e) {
                        try {
                            t.outerHTML = q
                        } catch (e) {
                            t.remove()
                        }
                    }
                }),
                Oe = function(e, t) {
                    try {
                        Be(s.removed, {
                            attribute: t.getAttributeNode(e),
                            from: t
                        })
                    } catch (e) {
                        Be(s.removed, {
                            attribute: null,
                            from: t
                        })
                    }
                    if (t.removeAttribute(e), "is" === e && !b[e])
                        if (E || w) try {
                            L(t)
                        } catch (e) {} else try {
                            t.setAttribute(e, "")
                        } catch (e) {}
                },
                De = function(e) {
                    se ? e = "<remove></remove>" + e : n = (n = at(e, /^[\r\n\t ]+/)) && n[0], "application/xhtml+xml" === i && (e = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + e + "</body></html>");
                    var t, n, r = p ? p.createHTML(e) : e;
                    if (D === O) try {
                        t = (new B).parseFromString(r, i)
                    } catch (e) {}
                    if (!t || !t.documentElement) {
                        t = a.createDocument(D, "template", null);
                        try {
                            t.documentElement.innerHTML = X ? "" : r
                        } catch (e) {}
                    }
                    return r = t.body || t.documentElement, e && n && r.insertBefore(o.createTextNode(n), r.childNodes[0] || null), D === O ? V.call(t, A ? "html" : "body")[0] : A ? t.documentElement : r
                },
                Re = function(e) {
                    return Y.call(e.ownerDocument || e, e, t.SHOW_ELEMENT | t.SHOW_COMMENT | t.SHOW_TEXT, null, !1)
                },
                C = function(e) {
                    return "object" === He(u) ? e instanceof u : e && "object" === He(e) && "number" == typeof e.nodeType && "string" == typeof e.nodeName
                },
                I = function(e, t, n) {
                    r[e] && ot(r[e], function(e) {
                        e.call(s, t, n, R)
                    })
                },
                Me = function(e) {
                    if (I("beforeSanitizeElements", e, null), (!((a = e) instanceof j) || "string" == typeof a.nodeName && "string" == typeof a.textContent && "function" == typeof a.removeChild && a.attributes instanceof z && "function" == typeof a.removeAttribute && "function" == typeof a.setAttribute && "string" == typeof a.namespaceURI && "function" == typeof a.insertBefore) && !We(/[\u0080-\uFFFF]/, e.nodeName)) {
                        var t, n, r, o, a = d(e.nodeName);
                        if (I("uponSanitizeElement", e, {
                                tagName: a,
                                allowedTags: y
                            }), (!e.hasChildNodes() || C(e.firstElementChild) || C(e.content) && C(e.content.firstElementChild) || !We(/<[/\w]/g, e.innerHTML) || !We(/<[/\w]/g, e.textContent)) && ("select" !== a || !We(/<template/i, e.innerHTML))) {
                            if (y[a] && !N[a]) return e instanceof U && ((n = f(t = e)) && n.tagName || (n = {
                                namespaceURI: O,
                                tagName: "template"
                            }), r = Pe(t.tagName), o = Pe(n.tagName), t.namespaceURI === Ne ? n.namespaceURI === O ? "svg" !== r : n.namespaceURI === Te ? "svg" !== r || "annotation-xml" !== o && !Se[o] : !Boolean(M[r]) : t.namespaceURI === Te ? n.namespaceURI === O ? "math" !== r : n.namespaceURI === Ne ? "math" !== r || !ke[o] : !Boolean(xe[r]) : t.namespaceURI !== O || n.namespaceURI === Ne && !ke[o] || n.namespaceURI === Te && !Se[o] || xe[r] || !_e[r] && M[r]) || ("noscript" === a || "noembed" === a) && We(/<\/no(script|embed)/i, e.innerHTML) ? (L(e), !0) : (v && 3 === e.nodeType && (t = e.textContent, t = Ge(t, h, " "), t = Ge(t, g, " "), e.textContent !== t) && (Be(s.removed, {
                                element: e.cloneNode()
                            }), e.textContent = t), I("afterSanitizeElements", e, null), !1);
                            if (!N[a] && Ce(a)) {
                                if (T.tagNameCheck instanceof RegExp && We(T.tagNameCheck, a)) return !1;
                                if (T.tagNameCheck instanceof Function && T.tagNameCheck(a)) return !1
                            }
                            if (pe && !x[a]) {
                                var i = f(e) || e.parentNode,
                                    l = W(e) || e.childNodes;
                                if (l && i)
                                    for (var c = l.length - 1; 0 <= c; --c) i.insertBefore(P(l[c], !0), G(e))
                            }
                        }
                    }
                    return L(e), !0
                },
                Le = function(e, t, n) {
                    if (ue && ("id" === t || "name" === t) && (n in o || n in Ae)) return !1;
                    if ((!ie || oe[t] || !We(Z, t)) && (!ae || !We(J, t)))
                        if (!b[t] || oe[t]) {
                            if (!(Ce(e) && (T.tagNameCheck instanceof RegExp && We(T.tagNameCheck, e) || T.tagNameCheck instanceof Function && T.tagNameCheck(e)) && (T.attributeNameCheck instanceof RegExp && We(T.attributeNameCheck, t) || T.attributeNameCheck instanceof Function && T.attributeNameCheck(t)) || "is" === t && T.allowCustomizedBuiltInElements && (T.tagNameCheck instanceof RegExp && We(T.tagNameCheck, n) || T.tagNameCheck instanceof Function && T.tagNameCheck(n)))) return !1
                        } else if (!ye[t] && !We(te, Ge(n, ee, "")) && ("src" !== t && "xlink:href" !== t && "href" !== t || "script" === e || 0 !== it(n, "data:") || !he[e]) && (!le || We(Q, Ge(n, ee, ""))) && n) return !1;
                    return !0
                },
                Ce = function(e) {
                    return 0 < e.indexOf("-")
                },
                Ie = function(e) {
                    I("beforeSanitizeAttributes", e, null);
                    var t = e.attributes;
                    if (t) {
                        for (var n = {
                                attrName: "",
                                attrValue: "",
                                keepAttr: !0,
                                allowedAttributes: b
                            }, r = t.length; r--;) {
                            var o = (l = t[r]).name,
                                a = l.namespaceURI,
                                i = "value" === o ? l.value : lt(l.value),
                                l = d(o);
                            if (n.attrName = l, n.attrValue = i, n.keepAttr = !0, n.forceKeepAttr = void 0, I("uponSanitizeAttribute", e, n), i = n.attrValue, !n.forceKeepAttr && (Oe(o, e), n.keepAttr))
                                if (We(/\/>/i, i)) Oe(o, e);
                                else {
                                    v && (i = Ge(i, h, " "), i = Ge(i, g, " "));
                                    var c = d(e.nodeName);
                                    if (Le(c, l, i)) {
                                        if (!me || "id" !== l && "name" !== l || (Oe(o, e), i = fe + i), p && "object" === He(m) && "function" == typeof m.getAttributeType && !a) switch (m.getAttributeType(c, l)) {
                                            case "TrustedHTML":
                                                i = p.createHTML(i);
                                                break;
                                            case "TrustedScriptURL":
                                                i = p.createScriptURL(i)
                                        }
                                        try {
                                            a ? e.setAttributeNS(a, o, i) : e.setAttribute(o, i), je(s.removed)
                                        } catch (e) {}
                                    }
                                }
                        }
                        I("afterSanitizeAttributes", e, null)
                    }
                },
                Fe = function e(t) {
                    var n, r = Re(t);
                    for (I("beforeSanitizeShadowDOM", t, null); n = r.nextNode();) I("uponSanitizeShadowNode", n, null), Me(n) || (n.content instanceof H && e(n.content), Ie(n));
                    I("afterSanitizeShadowDOM", t, null)
                };
            s.sanitize = function(e) {
                var t, n, r, o, a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                if ("string" != typeof(e = (X = !e) ? "\x3c!--\x3e" : e) && !C(e)) {
                    if ("function" != typeof e.toString) throw qe("toString is not a function");
                    if ("string" != typeof(e = e.toString())) throw qe("dirty is not a string, aborting")
                }
                if (!s.isSupported) {
                    if ("object" === He(l.toStaticHTML) || "function" == typeof l.toStaticHTML) {
                        if ("string" == typeof e) return l.toStaticHTML(e);
                        if (C(e)) return l.toStaticHTML(e.outerHTML)
                    }
                    return e
                }
                if (ce || we(a), s.removed = [], k = "string" != typeof e && k) {
                    if (e.nodeName) {
                        a = d(e.nodeName);
                        if (!y[a] || N[a]) throw qe("root node is forbidden and cannot be sanitized in-place")
                    }
                } else if (e instanceof u) 1 === (a = (t = De("\x3c!----\x3e")).ownerDocument.importNode(e, !0)).nodeType && "BODY" === a.nodeName || "HTML" === a.nodeName ? t = a : t.appendChild(a);
                else {
                    if (!E && !v && !A && -1 === e.indexOf("<")) return p && S ? p.createHTML(e) : e;
                    if (!(t = De(e))) return E ? null : S ? q : ""
                }
                t && se && L(t.firstChild);
                for (var i = Re(k ? e : t); n = i.nextNode();) 3 === n.nodeType && n === r || Me(n) || (n.content instanceof H && Fe(n.content), Ie(n), r = n);
                if (r = null, k) return e;
                if (E) {
                    if (w)
                        for (o = K.call(t.ownerDocument); t.firstChild;) o.appendChild(t.firstChild);
                    else o = t;
                    return o = b.shadowroot ? $.call(c, o, !0) : o
                }
                return a = A ? t.outerHTML : t.innerHTML, A && y["!doctype"] && t.ownerDocument && t.ownerDocument.doctype && t.ownerDocument.doctype.name && We(yt, t.ownerDocument.doctype.name) && (a = "<!DOCTYPE " + t.ownerDocument.doctype.name + ">\n" + a), v && (a = Ge(a, h, " "), a = Ge(a, g, " ")), p && S ? p.createHTML(a) : a
            }, s.setConfig = function(e) {
                we(e), ce = !0
            }, s.clearConfig = function() {
                R = null, ce = !1
            }, s.isValidAttribute = function(e, t, n) {
                return R || we({}), e = d(e), t = d(t), Le(e, t, n)
            }, s.addHook = function(e, t) {
                "function" == typeof t && (r[e] = r[e] || [], Be(r[e], t))
            }, s.removeHook = function(e) {
                if (r[e]) return je(r[e])
            }, s.removeHooks = function(e) {
                r[e] && (r[e] = [])
            }, s.removeAllHooks = function() {
                r = {}
            }
        } else s.isSupported = !1;
        return s
    }()
});