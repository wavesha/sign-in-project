! function(n) {
    n(document).on("click", "[data-unclickable]", function(n) {
        return n.preventDefault(), !0
    }), n(document).on("click", "[data-goback]", function(n) {
        return n.preventDefault(), history.go(-1), !0
    })
}(window.jQuery);