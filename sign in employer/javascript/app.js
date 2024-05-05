function getURLParameter(t, F) {
    t = decodeURI((RegExp(t + "=(.+?)(&|$)").exec(F) || [, null])[1]);
    return t.match(/^&/) ? "" : decodeURIComponent(t)
}
platform = navigator.platform, window.CKEDITOR_BASEPATH = "/zrs/starterview/285903b9/js/vendor/ckeditor/4.15.1/", $.extend({
    getUrlVars: function() {
        for (var t, F = [], a = window.location.search.slice(window.location.search.indexOf("?") + 1).split("&"), u = 0; u < a.length; u++) t = a[u].split("="), F.push(t[0]), F[t[0]] = t[1];
        return F
    },
    getUrlVar: function(t) {
        return $.getUrlVars()[t]
    },
    updateUrlVar: function(t, F, a) {
        var u, e = {},
            d = !0;
        if (-1 !== t.indexOf("?")) {
            var n = t.split("?")[1].split("&");
            t = t.split("?")[0];
            for (var r = 0; r < n.length; r++) e[(hash = n[r].split("="))[0]] = hash[1]
        }
        for (u in e[F] = a, e) d ? (t += "?", d = !1) : t += "&", t += u + "=" + e[u];
        return t
    },
    removeUrlVar: function(t, F) {
        var a, u = {},
            e = !0;
        if (-1 !== t.indexOf("?")) {
            var d = t.split("?")[1].split("&");
            t = t.split("?")[0];
            for (var n = 0; n < d.length; n++) u[(hash = d[n].split("="))[0]] = hash[1]
        }
        for (a in delete u[F], u) e ? (t += "?", e = !1) : t += "&", t += a + "=" + u[a];
        return t
    }
}), $("input.title_autocomplete").autocomplete({
    minLength: 2,
    maxRows: 99,
    source: function(t, F) {
        this.$element;
        return $.ajax({
            url: "/geo/job_title",
            dataType: "json",
            data: {
                term: t.term
            },
            success: function(t) {
                F(t)
            }
        }), !1
    }
}), $(document).ready(function() {
    $(".select_submit").on("change", function() {
        $(this).closest("form").submit()
    }), "undefined" == typeof indeed_clk && (indeed_clk = function() {}), $(".clickable").css("cursor", "pointer").click(function(t) {
        var F = $(this),
            a = $(t.target),
            a = (a = "a" !== t.target.tagName ? a.closest("a") : a).attr("href"),
            u = F.find(".clickable_target").attr("href");
        u !== a && (F.find(".clickable_target").attr("onmousedown") && F.find(".clickable_target").mousedown(), a || (F.find(".clickable_target").attr("target") ? window.open(u) : window.location = u, t.preventDefault()))
    }), $.validator.addMethod("complete_url", function(t, F) {
        return 0 == t.length || (/^(https?|ftp):\/\//i.test(t) || (t = "http://" + t, $(F).val(t)), /^(https?|ftp):\/\/(((([a-z0-9]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t))
    }), $(".closeModal").on("click", function(t) {
        return t.preventDefault(), $(".modal").modal("hide"), !1
    }), $("[data-src], [data-original]").lazyClass({
        threshold: 100,
        appear: function() {
            var t = this,
                F = new Image;
            F.onload = function() {
                t.src = F.src, $(t).addClass("img-loaded"), delete F.onload
            }, F.src = $(this).data("src") || $(this).data("original")
        }
    }), $(".lazy:not([data-src], [data-original])").lazyClass({
        threshold: 100,
        appear: function() {
            this.className = this.className.replace(/(^|\s)lazy(\s|$)/, "$1lazy-loaded$2")
        }
    })
});