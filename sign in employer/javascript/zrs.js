! function() {
    var t = $(document),
        e = "delay-hiding";
    t.on("click", "[data-close]", function() {
        var t = $(this).closest('[data-thing="' + $(this).data("close") + '"]');
        t.addClass(e), setTimeout(function() {
            t.hide().removeClass(e).trigger("close")
        }, 500)
    })
}(window.jQuery);