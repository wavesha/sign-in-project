! function(n) {
    n.util = n.util || {}, n.util.damerauLevenshtein = function(e, a) {
        var c, o, f, b;
        switch (!1 !== a && (a = !0), typeof(e = e || {}).insert) {
            case "function":
                c = e.insert;
                break;
            case "number":
                c = function(n) {
                    return e.insert
                };
                break;
            default:
                c = function(n) {
                    return 1
                }
        }
        switch (typeof e.remove) {
            case "function":
                o = e.remove;
                break;
            case "number":
                o = function(n) {
                    return e.remove
                };
                break;
            default:
                o = function(n) {
                    return 1
                }
        }
        switch (typeof e.substitute) {
            case "function":
                f = e.substitute;
                break;
            case "number":
                f = function(n, t) {
                    return e.substitute
                };
                break;
            default:
                f = function(n, t) {
                    return 1
                }
        }
        switch (typeof e.transpose) {
            case "function":
                b = e.transpose;
                break;
            case "number":
                b = function(n, t) {
                    return e.transpose
                };
                break;
            default:
                b = function(n, t) {
                    return 1
                }
        }
        return function(r, i) {
            var s = [];
            return r === i ? 0 : ((r = r.split("")).unshift(null), (i = i.split("")).unshift(null), r.forEach(function(e, u) {
                s[u] || (s[u] = []), i.forEach(function(n, t) {
                    0 === u && 0 === t ? s[u][t] = 0 : 0 === u ? s[u][t] = s[u][t - 1] + c(n) : 0 === t ? s[u][t] = s[u - 1][t] + o(e) : (s[u][t] = Math.min(s[u - 1][t] + o(e), s[u][t - 1] + c(n), s[u - 1][t - 1] + (e === n ? 0 : f(e, n))), a && 1 < u && 1 < t && r[u - 1] === n && e === i[t - 1] && (s[u][t] = Math.min(s[u][t], s[u - 2][t - 2] + (e === n ? 0 : b(e, r[u - 1])))))
                })
            }), s[r.length - 1][i.length - 1])
        }
    }
}(window.zr = window.zr || {});