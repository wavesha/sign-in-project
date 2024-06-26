var Mailcheck = {
    domainThreshold: 2,
    secondLevelThreshold: 2,
    topLevelThreshold: 2,
    defaultDomains: ["msn.com", "bellsouth.net", "telus.net", "comcast.net", "optusnet.com.au", "earthlink.net", "qq.com", "sky.com", "icloud.com", "mac.com", "sympatico.ca", "googlemail.com", "att.net", "xtra.co.nz", "web.de", "cox.net", "gmail.com", "ymail.com", "aim.com", "rogers.com", "verizon.net", "rocketmail.com", "google.com", "optonline.net", "sbcglobal.net", "aol.com", "me.com", "btinternet.com", "charter.net", "shaw.ca"],
    defaultSecondLevelDomains: ["yahoo", "hotmail", "mail", "live", "outlook", "gmx"],
    defaultTopLevelDomains: ["com", "com.au", "com.tw", "ca", "co.nz", "co.uk", "de", "fr", "it", "ru", "net", "org", "edu", "gov", "jp", "nl", "kr", "se", "eu", "ie", "co.il", "us", "at", "be", "dk", "hk", "es", "gr", "ch", "no", "cz", "in", "net", "net.au", "info", "biz", "mil", "co.jp", "sg", "hu", "uk"],
    run: function(e) {
        e.domains = e.domains || Mailcheck.defaultDomains, e.secondLevelDomains = e.secondLevelDomains || Mailcheck.defaultSecondLevelDomains, e.topLevelDomains = e.topLevelDomains || Mailcheck.defaultTopLevelDomains, e.distanceFunction = e.distanceFunction || Mailcheck.sift3Distance;

        function n(e) {
            return e
        }
        var o = e.suggested || n,
            t = e.empty || n,
            e = Mailcheck.suggest(Mailcheck.encodeEmail(e.email), e.domains, e.secondLevelDomains, e.topLevelDomains, e.distanceFunction);
        return e ? o(e) : t()
    },
    suggest: function(e, n, o, t, i) {
        e = e.toLowerCase();
        e = this.splitEmail(e);
        if (!o || !t || -1 === o.indexOf(e.secondLevelDomain) || -1 === t.indexOf(e.topLevelDomain)) {
            if (n = this.findClosestDomain(e.domain, n, i, this.domainThreshold)) return n != e.domain && {
                address: e.address,
                domain: n,
                full: e.address + "@" + n
            };
            o = this.findClosestDomain(e.secondLevelDomain, o, i, this.secondLevelThreshold), t = this.findClosestDomain(e.topLevelDomain, t, i, this.topLevelThreshold);
            if (e.domain) {
                n = e.domain, i = !1;
                if (o && o != e.secondLevelDomain && (n = n.replace(e.secondLevelDomain, o), i = !0), t && t != e.topLevelDomain && (n = n.replace(new RegExp(e.topLevelDomain + "$"), t), i = !0), 1 == i) return {
                    address: e.address,
                    domain: n,
                    full: e.address + "@" + n
                }
            }
        }
        return !1
    },
    findClosestDomain: function(e, n, o, t) {
        t = t || this.topLevelThreshold;
        var i, l = 1 / 0,
            a = null;
        if (!e || !n) return !1;
        o = o || this.sift3Distance;
        for (var c = 0; c < n.length; c++) {
            if (e === n[c]) return e;
            (i = o(e, n[c])) < l && (l = i, a = n[c])
        }
        return l <= t && null !== a && a
    },
    sift3Distance: function(e, n) {
        if (null == e || 0 === e.length) return null == n || 0 === n.length ? 0 : n.length;
        if (null == n || 0 === n.length) return e.length;
        for (var o = 0, t = 0, i = 0, l = 0; o + t < e.length && o + i < n.length;) {
            if (e.charAt(o + t) == n.charAt(o + i)) l++;
            else
                for (var t = 0, i = 0, a = 0; a < 5; a++) {
                    if (o + a < e.length && e.charAt(o + a) == n.charAt(o)) {
                        t = a;
                        break
                    }
                    if (o + a < n.length && e.charAt(o) == n.charAt(o + a)) {
                        i = a;
                        break
                    }
                }
            o++
        }
        return (e.length + n.length) / 2 - l
    },
    splitEmail: function(e) {
        var n = e.trim().split("@");
        if (n.length < 2) return !1;
        for (var o = 0; o < n.length; o++)
            if ("" === n[o]) return !1;
        var e = n.pop(),
            t = e.split("."),
            i = "",
            l = "";
        if (0 == t.length) return !1;
        if (1 == t.length) l = t[0];
        else {
            for (i = t[0], o = 1; o < t.length; o++) l += t[o] + ".";
            l = l.substring(0, l.length - 1)
        }
        return {
            topLevelDomain: l,
            secondLevelDomain: i,
            domain: e,
            address: n.join("@")
        }
    },
    encodeEmail: function(e) {
        return encodeURI(e).replace("%20", " ").replace("%25", "%").replace("%5E", "^").replace("%60", "`").replace("%7B", "{").replace("%7C", "|").replace("%7D", "}")
    }
};
"undefined" != typeof module && module.exports && (module.exports = Mailcheck), "function" == typeof define && define.amd && define("mailcheck", [], function() {
    return Mailcheck
}), "undefined" != typeof window && window.jQuery && (jQuery.fn.mailcheck = function(e) {
    var n, o, t = this;
    e.suggested && (n = e.suggested, e.suggested = function(e) {
        n(t, e)
    }), e.empty && (o = e.empty, e.empty = function() {
        o.call(null, t)
    }), e.email = this.val(), Mailcheck.run(e)
});