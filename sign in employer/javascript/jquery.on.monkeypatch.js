/iPad|iPhone|iPod/g.test(navigator.userAgent) && (jQuery.fn._on = jQuery.fn.on, jQuery.fn.on = function(n, e) {
    return "mouseover" === n ? this : jQuery.fn._on.apply(this, arguments)
});