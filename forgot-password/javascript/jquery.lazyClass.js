! function(o) {
    function t() {
        var e;
        s && (e = (window.innerHeight || n.height()) + n.scrollTop(), s.each(function() {
            var t = "SCRIPT" == this.tagName ? o(this).parent() : o(this),
                i = o(this).data("settings"),
                n = t.offset();
            0 === n.top && 0 === n.left && t.is(":hidden") || e > n.top - i.threshold && (s = s.not(this), i.appear && i.appear.call(this, i), setTimeout(function() {
                t.addClass("lazy-loaded")
            }, 0))
        }))
    }
    var i, n = o(window),
        s = null;
    n.bind("scroll resize", function() {
        clearTimeout(i), i = setTimeout(function() {
            t()
        }, 0)
    }), o(function() {
        setTimeout(function() {
            t()
        }, 0)
    }), o.fn.lazyClass = function(t) {
        s = s ? s.add(this) : this;
        var i = {
            threshold: 0,
            appear: null
        };
        return null != t && o.extend(i, t), this.each(function() {
            o(this).data("settings", i)
        }), this
    }
}(window.jQuery || window.Zepto || window.$);