! function(k, t) {
    t = t || {};
    var e = k(document);
    if (!e.data("__mailcheck_setup")) {
        e.data("__mailcheck_setup", 1), k.fn.setNativeValue = function(e) {
            var a = this[0],
                t = Object.getOwnPropertyDescriptor(a, "value"),
                t = t ? t.set : null,
                i = Object.getPrototypeOf(a),
                i = Object.getOwnPropertyDescriptor(i, "value"),
                i = i ? i.set : null;
            return t && t !== i ? i.call(a, e) : t ? t.call(a, e) : a.value = e, a.dispatchEvent(new Event("input", {
                bubbles: !0
            })), this
        };

        function _(e) {
            return i.text(e).html()
        }
        for (var a, m = "mailcheck_hint", f = "." + m, v = /.+@.+\./, i = k("<div/>"), c = {
                a: /[qwsz]/i,
                b: /[vghn]/i,
                c: /[xdfv]/i,
                d: /[serfcx]/i,
                e: /[wsdr43]/i,
                f: /[rtgvcd]/i,
                g: /[ftyhbv]/i,
                h: /[gyujnb]/i,
                i: /[ujko98]/i,
                j: /[uikmnh]/i,
                k: /[jiolm]/i,
                l: /[kop\.]/i,
                m: /[njk]/i,
                n: /[bhjm]/i,
                o: /[iklp09]/i,
                p: /[ol0\-]/i,
                q: /[asw21]/i,
                r: /[edft54]/i,
                s: /[wedxza]/i,
                t: /[rfgy65]/i,
                u: /[yhji87]/i,
                v: /[cfgb]/i,
                w: /[qase32]/i,
                x: /[zsdc]/i,
                y: /[tghu76]/i,
                z: /[asx]/i,
                0: /[9op\-]/i,
                1: /[q2]/i,
                2: /[1qw3]/i,
                3: /[2we4]/i,
                4: /[3er5]/i,
                5: /[4rt6]/i,
                6: /[5ty7]/i,
                7: /[6yu8]/i,
                8: /[7ui9]/i,
                9: /[8io0]/i,
                ".": /[l]/i,
                "-": /[0p]/i
            }, h = t.util.damerauLevenshtein({
                substitute: function(e, a) {
                    return c[e].test(a) ? .5 : 1.5
                },
                transpose: function(e, a) {
                    return .5
                }
            }, !0), u = (t.util.damerauLevenshtein(), {
                skipregexes: [{
                    type: "skip",
                    search: "^(((me|mail|twc|y7mail|email|kw|zoho|adp|alku|ewmi|loves)\\.com)|((yahoo|hotmail|live|aol|outlook|ymail)\\.(fr|es|it|de|in|se|ie|nl|gr|ro|co\\.(uk|in|jp|nz|id|th|za|kr)|com\\.(hk|sg|au|ph|br|mx|ar|pt|tw|zw|pf|tr|pb|ve|pg))))$"
                }],
                regexes: [{
                    search: "^([^\\.]+)$",
                    replace: "$1.com"
                }, {
                    search: "(.+?)\\.[e3wsdr][desxcfr][uyhji]$",
                    replace: "$1.edu"
                }, {
                    search: "(.+?)\\.cm$",
                    replace: "$1.com"
                }, {
                    search: "(.+?)\\.ccom$",
                    replace: "$1.com"
                }, {
                    search: "(.+?)\\.?c\\.om$",
                    replace: "$1.com"
                }, {
                    search: "(.+)\\.(coml?|net|edu|org)((\\.(com|net|edu|org))|[^\\.]+)$",
                    replace: "$1.$2"
                }, {
                    search: "(.+)\\.[^c]o\\.uk$",
                    replace: "$1.co.uk"
                }, {
                    search: "(.+)\\.[cxdfv][oiklp][mnjk]$",
                    replace: "$1.com"
                }, {
                    search: "^([0-9]+)\\.?((gmail\\.com|yahoo\\..+|hotmail\\..+))$",
                    replace: "$1@$2",
                    stop: !0
                }],
                levenshteins: ["gmail.com", "googlemail.com", "yahoo.com", "hotmail.com", "icloud.com", "aol.com", "outlook.com", "live.com", "comcast.net", "ymail.com", "att.net", "msn.com", "sbcglobal.net", "verizon.net", "cox.net", "bellsouth.net", "rocketmail.com", "btinternet.com", "aim.com", "optonline.net", "mac.com", "netzero.com", "netzero.net", "netscape.com", "netscape.net", "frontier.com", "charter.net", "yahoo.co.uk", "hotmail.co.uk", "yahoo.ca", "yahoo.fr", "live.ca", "hotmail.ca", "sky.com", "yahoo.es", "yahoo.co.in"]
            }), o = 0, s = u.regexes.length; o < s; o++) u.regexes[o].regex = new RegExp(u.regexes[o].search);
        for (o = 0, s = u.skipregexes.length; o < s; o++) u.skipregexes[o].regex = new RegExp(u.skipregexes[o].search);
        for (var p = [], o = 0, s = u.levenshteins.length; o < s; o++) a = u.levenshteins[o], p.push(a.split(".").shift());

        function y(e, a) {
            var t = {
                    domain: e = e.toLowerCase(),
                    skip: !1,
                    fixes: []
                },
                i = t.domain;
            if (!a)
                for (var c = 0, o = u.skipregexes.length; c < o; c++)
                    if (u.skipregexes[c].regex.test(i)) {
                        t.skip = !0;
                        break
                    }
            if (!t.skip) {
                for (var s, c = 0, o = u.regexes.length; c < o; c++)
                    if (u.regexes[c].regex.test(i) && (s = i.replace(u.regexes[c].regex, u.regexes[c].replace), i !== s) && (t.hardReplacement ? t.hardReplacement.push(i) : t.hardReplacement = [i], i = s, t.hard = !0, t.replacement = s, t.stop = u.regexes[c].stop, t.fixes.push(u.regexes[c].search), t.stop)) return t;
                for (var l, n, i = t.hard ? t.replacement : t.domain, r = 1 / 0, c = 0, o = u.levenshteins.length; c < o && (n = u.levenshteins[c], !((d = h(n, i)) < r && (l = n, 0 === (r = d)))); c++);
                if (t.distance = r, t.levenshteinReplacement = l, 0 !== r && r < 2.5 && (t.levenshtein = !0, t.replacement = l, t.fixes.push(l)), 0 !== r && !t.replacement)
                    for (var m, d, c = 0, o = p.length; c < o; c++)
                        if (m = p[c], d = u.levenshteins[c], -1 !== i.indexOf(m) && h(d, i) < 4) {
                            t.replacement = u.levenshteins[c], t.levpart = !0, t.levpartMatched = m, t.fixes.push(m);
                            break
                        }
            }
            return t
        }

        function l() {
            t.mailcheck.softInit();
            try {
                var e = t.page.model.hard_mailcheck_event || !1,
                    a = t.page.model.do_hard_mailcheck || !1;
                (a || e) && t.mailcheck.hardInit(a)
            } catch (e) {}
        }
        t.mailcheck = {
            levenshtein: h,
            softInit: function() {
                var o = "mailcheck_showing",
                    s = "{{address}}",
                    l = "Did you mean <strong>{{address}}</strong>?",
                    n = "Yes",
                    r = "No";
                try {
                    s = t.page.model.email_suggestion_template_variable || s, l = t.page.model.email_suggestion_template || l, n = t.page.model.email_suggestion_yes || n, r = t.page.model.email_suggestion_no || r
                } catch (e) {}
                e.delegate('input[type="email"]', "keyup input", function() {
                    var i = k(this),
                        e = i.val(),
                        c = i.data("mailcheck_hint"),
                        a = (c || (c = k("<div/>").addClass(m).attr("aria-live", "polite").insertAfter(i).hide().data("mailcheck_input", i), i.data("mailcheck_hint", c)), clearTimeout(c.data("mailcheck_timeout")), setTimeout(function() {
                            if (c.stop().fadeOut(150, function() {
                                    i.removeClass(o)
                                }), !e.match(v)) return !0;
                            i.mailcheck({
                                suggested: function(e, a) {
                                    var a = a.address + "@" + a.domain,
                                        t = l.replace(s, _(a).replace(/(.{15})/g, "$1&shy;")) + '<span class="mailcheck_actions"><button type="button" class="mailcheck_action mailcheck_yes">' + n + '</button><button type="button" class="mailcheck_action mailcheck_no">' + r + "</button></span>";
                                    c.stop().html(t).show().animate({
                                        opacity: 1
                                    }, 200).data("mailcheck_suggestion", a), i.addClass(o)
                                }
                            })
                        }, 200));
                    c.data("mailcheck_timeout", a)
                }).delegate(f + " .mailcheck_yes", "click", function() {
                    var e = k(this).closest(f);
                    try {
                        k.log_event("email_recommendation_click", {
                            suggester: "soft",
                            field: "yes",
                            fixes: "mailcheck"
                        })
                    } catch (e) {}
                    e.data("mailcheck_input").setNativeValue(e.data("mailcheck_suggestion")).focus(), e.stop().fadeOut(150, function() {
                        e.data("mailcheck_input").removeClass(o)
                    })
                }).delegate(f + " .mailcheck_no", "click", function() {
                    var e = k(this).closest(f);
                    try {
                        k.log_event("email_recommendation_click", {
                            suggester: "soft",
                            field: "no",
                            fixes: "mailcheck"
                        })
                    } catch (e) {}
                    e.data("mailcheck_input").focus();
                    e = k(this).closest(f).stop().fadeOut(150, function() {
                        e.data("mailcheck_input").removeClass(o)
                    })
                })
            },
            hardInit: function(i) {
                var c = "Your email address may have been typed incorrectly. Did you mean <strong>{{address}}</strong>?",
                    o = "Yes, use @{{suggested_domain}}",
                    s = "No, use @{{domain}}";
                try {
                    c = t.page.model.email_suggestion_modal || c, o = t.page.model.email_suggestion_yes_modal || o, s = t.page.model.email_suggestion_no_modal || s
                } catch (e) {}

                function a(e) {
                    var a = k(this),
                        t = a.val();
                    if (g || !t.match(v) || a.data("__mailcheck_hard_check") === t) g = !1;
                    else if (a.data("__mailcheck_hard_check", t), u = function(e) {
                            var a = e.split("@"),
                                t = a.pop(),
                                t = y(t);
                            if ((l = t).replacement) {
                                a = a.join("@"), t = t.replacement;
                                if (-1 !== t.indexOf("@") ? a += t : a += "@" + t, a !== e) return a
                            }
                            return null
                        }(t)) {
                        try {
                            k.log_event("email_recommendation_could_show", {
                                suggester: "hard",
                                fixes: JSON.stringify(l.fixes)
                            })
                        } catch (e) {}
                        if (i) {
                            p = a, m.html(o.replace("{{suggested_domain}}", _(u.split("@").pop()).replace(/(.{15})/g, "$1&shy;"))), d.html(s.replace("{{domain}}", _(t.split("@").pop()).replace(/(.{15})/g, "$1&shy;"))), h.html(c.replace("{{address}}", _(u).replace(/(.{15})/g, "$1&shy;"))), k(document.body).addClass(n), r.focus();
                            try {
                                k.log_event("email_recommendation_shown", {
                                    suggester: "hard",
                                    fixes: JSON.stringify(l.fixes)
                                })
                            } catch (e) {}
                            13 === e.which && e.preventDefault()
                        }
                    }
                }
                var l, n = "mailcheck_modal-open",
                    e = k('<div class="mailcheck_modal_wrapper">        <div class="mailcheck_modal-backdrop"></div>        <div class="mailcheck_modal" tabindex="-1" role="dialog">          <div class="mailcheck_modal-dialog" role="document">            <div class="mailcheck_modal-content">              <div class="mailcheck_modal-header">                <h5 class="mailcheck_modal-title">Please Check Your Email Address</h5>                <button type="button" class="mailcheck_modal-close" data-dismiss="modal" aria-label="Close">                  <span aria-hidden="true">&times;</span>                </button>              </div>              <div class="mailcheck_modal-body">                <p class="mailcheck_modal_suggestion">Your email address may have been typed incorrectly. Did you mean <strong>kiefer.sutherland@thelostboys.co.uk</strong>?</p>              </div>              <div class="mailcheck_modal-footer">                <button type="button" class="mailcheck_modal_yes">Yes, use @thelostboys.co.uk</button>                <button type="button" class="mailcheck_modal_no">No, use @thelostboys.fo.uk</button>              </div>            </div>          </div>        </div>      </div>'),
                    r = e.find(".mailcheck_modal"),
                    m = e.find(".mailcheck_modal_yes"),
                    d = e.find(".mailcheck_modal_no"),
                    h = e.find(".mailcheck_modal_suggestion"),
                    u = (e.appendTo(document.body), null),
                    p = null,
                    g = !1;
                k(document).delegate('input[type="email"]', "blur", a).delegate('input[type="email"]', "keydown", function(e) {
                    13 == e.which && a.call(this, e)
                }).delegate('input[type="email"]', "keyup input", function() {}).delegate(f + " .mailcheck_yes, " + f + " .mailcheck_no", "mousedown", function() {
                    g = !0
                }).delegate(".mailcheck_modal_yes", "click", function() {
                    try {
                        k.log_event("email_recommendation_click", {
                            suggester: "hard",
                            field: "yes",
                            fixes: JSON.stringify(l.fixes)
                        })
                    } catch (e) {}
                    k(document.body).removeClass(n), p.setNativeValue(u).trigger("input change").focus()
                }).delegate(".mailcheck_modal-close, .mailcheck_modal_no", "click", function() {
                    try {
                        k.log_event("email_recommendation_click", {
                            suggester: "hard",
                            field: "no",
                            fixes: JSON.stringify(l.fixes)
                        })
                    } catch (e) {}
                    k(document.body).removeClass(n), p.focus()
                })
            },
            hardCheck: y
        };
        document.body ? l() : k(l)
    }
}(window.jQuery, window.zr = window.zr || {});