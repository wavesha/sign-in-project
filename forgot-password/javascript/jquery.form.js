! function(y) {
    function T() {
        var e;
        y.fn.ajaxSubmit.debug && (e = "[jquery.form] " + Array.prototype.join.call(arguments, ""), window.console && window.console.log ? window.console.log(e) : window.opera && window.opera.postError && window.opera.postError(e))
    }
    y.fn.ajaxSubmit = function(b) {
        if (this.length) {
            "function" == typeof b && (b = {
                success: b
            });
            var e = this.attr("action"),
                e = "string" == typeof e ? y.trim(e) : "",
                e = (e = (e = e && (e.match(/^([^#]+)/) || [])[1]) || window.location.href || "", b = y.extend(!0, {
                    url: e,
                    type: this[0].getAttribute("method") || "GET",
                    iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
                }, b), {});
            if (this.trigger("form-pre-serialize", [this, b, e]), e.veto) T("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
            else if (b.beforeSerialize && !1 === b.beforeSerialize(this, b)) T("ajaxSubmit: submit aborted via beforeSerialize callback");
            else {
                var t, r, x, i, a, n, o = this.formToArray(b.semantic);
                if (b.data)
                    for (t in b.extraData = b.data, b.data)
                        if (b.data[t] instanceof Array)
                            for (var s in b.data[t]) o.push({
                                name: t,
                                value: b.data[t][s]
                            });
                        else r = b.data[t], r = y.isFunction(r) ? r() : r, o.push({
                            name: t,
                            value: r
                        });
                b.beforeSubmit && !1 === b.beforeSubmit(o, this, b) ? T("ajaxSubmit: submit aborted via beforeSubmit callback") : (this.trigger("form-submit-validate", [o, this, b, e]), e.veto ? T("ajaxSubmit: submit vetoed via form-submit-validate trigger") : (e = y.param(o), "GET" == b.type.toUpperCase() ? (b.url += (0 <= b.url.indexOf("?") ? "&" : "?") + e, b.data = null) : b.data = e, x = this, i = [], b.resetForm && i.push(function() {
                    x.resetForm()
                }), b.clearForm && i.push(function() {
                    x.clearForm()
                }), !b.dataType && b.target ? (a = b.success || function() {}, i.push(function(e) {
                    var t = b.replaceTarget ? "replaceWith" : "html";
                    y(b.target)[t](e).each(a, arguments)
                })) : b.success && i.push(b.success), b.success = function(e, t, r) {
                    for (var a = b.context || b, n = 0, o = i.length; n < o; n++) i[n].apply(a, [e, t, r || x, x])
                }, e = 0 < y("input:file", this).length, n = "multipart/form-data", n = x.attr("enctype") == n || x.attr("encoding") == n, !1 !== b.iframe && (e || b.iframe || n) ? b.closeKeepAlive ? y.get(b.closeKeepAlive, l) : l() : y.ajax(b), this.trigger("form-submit-notify", [this, b])))
            }
        } else T("ajaxSubmit: skipping submit process - no element selected");
        return this;

        function l() {
            var s, n, l, c, u, f, m, e, t, d, p, h, o, v, i = x[0];

            function r() {
                var e = x.attr("target"),
                    t = x.attr("action"),
                    r = (i.setAttribute("target", n), "POST" != i.getAttribute("method") && i.setAttribute("method", "POST"), i.getAttribute("action") != s.url && i.setAttribute("action", s.url), s.skipEncodingOverride || x.attr({
                        encoding: "multipart/form-data",
                        enctype: "multipart/form-data"
                    }), s.timeout && setTimeout(function() {
                        m = !0, g()
                    }, s.timeout), []);
                try {
                    if (s.extraData)
                        for (var a in s.extraData) r.push(y('<input type="hidden" name="' + a + '" value="' + s.extraData[a] + '" />').appendTo(i)[0]);
                    l.appendTo("body"), c.attachEvent ? c.attachEvent("onload", g) : c.addEventListener("load", g, !1), i.submit()
                } finally {
                    i.setAttribute("action", t), e ? i.setAttribute("target", e) : x.removeAttr("target"), y(r).remove()
                }
            }

            function g() {
                if (!u.aborted) {
                    var e = c.contentWindow ? c.contentWindow.document : c.contentDocument || c.document;
                    if (e && e.location.href != s.iframeSrc) {
                        c.detachEvent ? c.detachEvent("onload", g) : c.removeEventListener("load", g, !1);
                        var t = !0;
                        try {
                            if (m) throw "timeout";
                            var r = "xml" == s.dataType || e.XMLDocument || y.isXMLDoc(e);
                            if (T("isXml=" + r), !r && window.opera && (null == e.body || "" == e.body.innerHTML) && --p) return T("requeing onLoad callback, DOM not available"), void setTimeout(g, 250);
                            u.responseText = e.body ? e.body.innerHTML : e.documentElement ? e.documentElement.innerHTML : null, u.responseXML = e.XMLDocument || e, u.getResponseHeader = function(e) {
                                return {
                                    "content-type": s.dataType
                                }[e]
                            };
                            var a, n, o, i = /(json|script)/.test(s.dataType);
                            i || s.textarea ? (a = e.getElementsByTagName("textarea")[0]) ? u.responseText = a.value : i && (n = e.getElementsByTagName("pre")[0], o = e.getElementsByTagName("body")[0], n ? u.responseText = n.textContent : o && (u.responseText = o.innerHTML)) : "xml" != s.dataType || u.responseXML || null == u.responseText || (u.responseXML = h(u.responseText)), d = v(u, s.dataType, s)
                        } catch (e) {
                            T("error caught:", e), t = !1, u.error = e, s.error && s.error.call(s.context, u, "error", e), f && y.event.trigger("ajaxError", [u, s, e])
                        }
                        u.aborted && (T("upload aborted"), t = !1), t && (s.success && s.success.call(s.context, d, "success", u), f) && y.event.trigger("ajaxSuccess", [u, s]), f && y.event.trigger("ajaxComplete", [u, s]), f && !--y.active && y.event.trigger("ajaxStop"), s.complete && s.complete.call(s.context, u, t ? "success" : "error"), setTimeout(function() {
                            l.removeData("form-plugin-onload"), l.remove(), u.responseXML = null
                        }, 100)
                    }
                }
            }
            y(":input[name=submit],:input[id=submit]", i).length ? alert('Error: Form elements must not have name or id of "submit".') : ((s = y.extend(!0, {}, y.ajaxSettings, b)).context = s.context || s, n = "jqFormIO" + (new Date).getTime(), l = y('<iframe id="' + n + '" name="' + n + '" src="' + s.iframeSrc + '" />'), c = l[0], l.css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            }), u = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function() {},
                getResponseHeader: function() {},
                setRequestHeader: function() {},
                abort: function() {
                    T("aborting upload...");
                    var e = "aborted";
                    this.aborted = 1, l.attr("src", s.iframeSrc), u.error = e, s.error && s.error.call(s.context, u, "error", e), f && y.event.trigger("ajaxError", [u, s, e]), s.complete && s.complete.call(s.context, u, "error")
                }
            }, (f = s.global) && !y.active++ && y.event.trigger("ajaxStart"), f && y.event.trigger("ajaxSend", [u, s]), s.beforeSend && !1 === s.beforeSend.call(s.context, u, s) ? s.global && y.active-- : u.aborted || (m = 0, (e = i.clk) && (t = e.name) && !e.disabled && (s.extraData = s.extraData || {}, s.extraData[t] = e.value, "image" == e.type) && (s.extraData[t + ".x"] = i.clk_x, s.extraData[t + ".y"] = i.clk_y), s.forceSync ? r() : setTimeout(r, 10), p = 50, h = y.parseXML || function(e, t) {
                return window.ActiveXObject ? ((t = new ActiveXObject("Microsoft.XMLDOM")).async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" != t.documentElement.nodeName ? t : null
            }, o = y.parseJSON || function(e) {
                return window.eval("(" + e + ")")
            }, v = function(e, t, r) {
                var a = e.getResponseHeader("content-type") || "",
                    n = "xml" === t || !t && 0 <= a.indexOf("xml"),
                    e = n ? e.responseXML : e.responseText;
                return n && "parsererror" === e.documentElement.nodeName && y.error && y.error("parsererror"), "string" == typeof(e = r && r.dataFilter ? r.dataFilter(e, t) : e) && ("json" === t || !t && 0 <= a.indexOf("json") ? e = o(e) : ("script" === t || !t && 0 <= a.indexOf("javascript")) && y.globalEval(e)), e
            }))
        }
    }, y.fn.ajaxForm = function(t) {
        var e;
        return 0 === this.length ? (e = {
            s: this.selector,
            c: this.context
        }, !y.isReady && e.s ? (T("DOM not ready, queuing ajaxForm"), y(function() {
            y(e.s, e.c).ajaxForm(t)
        })) : T("terminating; zero elements found by selector" + (y.isReady ? "" : " (DOM not ready)")), this) : this.ajaxFormUnbind().bind("submit.form-plugin", function(e) {
            e.isDefaultPrevented() || (e.preventDefault(), y(this).ajaxSubmit(t))
        }).bind("click.form-plugin", function(e) {
            var t = e.target,
                r = y(t);
            if (!r.is(":submit,input:image")) {
                var a = r.closest(":submit");
                if (0 == a.length) return;
                t = a[0]
            }
            var n = this;
            "image" == (n.clk = t).type && (null != e.offsetX ? (n.clk_x = e.offsetX, n.clk_y = e.offsetY) : "function" == typeof y.fn.offset ? (a = r.offset(), n.clk_x = e.pageX - a.left, n.clk_y = e.pageY - a.top) : (n.clk_x = e.pageX - t.offsetLeft, n.clk_y = e.pageY - t.offsetTop)), setTimeout(function() {
                n.clk = n.clk_x = n.clk_y = null
            }, 100)
        })
    }, y.fn.ajaxFormUnbind = function() {
        return this.unbind("submit.form-plugin click.form-plugin")
    }, y.fn.formToArray = function(e) {
        var t = [];
        if (0 !== this.length) {
            var r = this[0],
                a = e ? r.getElementsByTagName("*") : r.elements;
            if (a) {
                for (var n, o, i, s, l, c, u, f = 0, m = a.length; f < m; f++)
                    if (u = (i = a[f]).name)
                        if (e && r.clk && "image" == i.type) i.disabled || r.clk != i || (t.push({
                            name: u,
                            value: y(i).val()
                        }), t.push({
                            name: u + ".x",
                            value: r.clk_x
                        }, {
                            name: u + ".y",
                            value: r.clk_y
                        }));
                        else if ((o = y.fieldValue(i, !0)) && o.constructor == Array)
                    for (n = 0, s = o.length; n < s; n++) t.push({
                        name: u,
                        value: o[n]
                    });
                else null != o && t.push({
                    name: u,
                    value: o
                });
                !e && r.clk && (u = (c = (l = y(r.clk))[0]).name) && !c.disabled && "image" == c.type && (t.push({
                    name: u,
                    value: l.val()
                }), t.push({
                    name: u + ".x",
                    value: r.clk_x
                }, {
                    name: u + ".y",
                    value: r.clk_y
                }))
            }
        }
        return t
    }, y.fn.formSerialize = function(e) {
        return y.param(this.formToArray(e))
    }, y.fn.fieldSerialize = function(n) {
        var o = [];
        return this.each(function() {
            var e = this.name;
            if (e) {
                var t = y.fieldValue(this, n);
                if (t && t.constructor == Array)
                    for (var r = 0, a = t.length; r < a; r++) o.push({
                        name: e,
                        value: t[r]
                    });
                else null != t && o.push({
                    name: this.name,
                    value: t
                })
            }
        }), y.param(o)
    }, y.fn.fieldValue = function(e) {
        for (var t = [], r = 0, a = this.length; r < a; r++) {
            var n = this[r],
                n = y.fieldValue(n, e);
            null == n || n.constructor == Array && !n.length || (n.constructor == Array ? y.merge(t, n) : t.push(n))
        }
        return t
    }, y.fieldValue = function(e, t) {
        var r = e.name,
            a = e.type,
            n = e.tagName.toLowerCase();
        if ((t = void 0 === t ? !0 : t) && (!r || e.disabled || "reset" == a || "button" == a || ("checkbox" == a || "radio" == a) && !e.checked || ("submit" == a || "image" == a) && e.form && e.form.clk != e || "select" == n && -1 == e.selectedIndex)) return null;
        if ("select" != n) return y(e).val();
        t = e.selectedIndex;
        if (t < 0) return null;
        for (var o = [], i = e.options, s = "select-one" == a, l = s ? t + 1 : i.length, c = s ? t : 0; c < l; c++) {
            var u = i[c];
            if (u.selected) {
                var f = (f = u.value) || (u.attributes && u.attributes.value && !u.attributes.value.specified ? u.text : u.value);
                if (s) return f;
                o.push(f)
            }
        }
        return o
    }, y.fn.clearForm = function() {
        return this.each(function() {
            y("input,select,textarea", this).clearFields()
        })
    }, y.fn.clearFields = y.fn.clearInputs = function() {
        return this.each(function() {
            var e = this.type,
                t = this.tagName.toLowerCase();
            "text" == e || "password" == e || "textarea" == t ? this.value = "" : "checkbox" == e || "radio" == e ? this.checked = !1 : "select" == t && (this.selectedIndex = -1)
        })
    }, y.fn.resetForm = function() {
        return this.each(function() {
            "function" != typeof this.reset && ("object" != typeof this.reset || this.reset.nodeType) || this.reset()
        })
    }, y.fn.enable = function(e) {
        return void 0 === e && (e = !0), this.each(function() {
            this.disabled = !e
        })
    }, y.fn.selected = function(t) {
        return void 0 === t && (t = !0), this.each(function() {
            var e = this.type;
            "checkbox" == e || "radio" == e ? this.checked = t : "option" == this.tagName.toLowerCase() && (e = y(this).parent("select"), t && e[0] && "select-one" == e[0].type && e.find("option").selected(!1), this.selected = t)
        })
    }
}(jQuery);