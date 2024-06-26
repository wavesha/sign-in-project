! function() {
    "use strict";
    $.validator.addMethod("noSpecialChars", function(F, u) {
        return this.optional(u) || /^[a-z0-9\-]+$/i.test(F)
    }, "Enter only letters, numbers or dashes"), $.validator.addMethod("hexColor", function(F, u) {
        return this.optional(u) || /^#[a-f0-9]{6}$/i.test(F)
    }, "Enter a 6-digit hex color, like #333333"), $.validator.addMethod("complete_url", function(F, u) {
        return 0 === F.length || (/^(https?|ftp):\/\//i.test(F) || (F = "http://" + F, $(u).val(F)), /^(https?|ftp):\/\/(((([a-z0-9]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(F))
    }), $.validator.addMethod("pwcheck", function(F) {
        return !/^1+$|^123456$|^qwerty$|^abcdef$|^admin$|^password/.test(F)
    }), $.validator.addMethod("validApplyUrl", function(F, u) {
        return this.optional(u) || !/https?:\/\/([^\/]*\.)?ziprecruiter\.com\//.test(F) && /^https?:\/\/(hire\.jobvite\.com\/j\/|[^\/]+\/.*[0-9])/.test(F)
    }), $.validator.addMethod("ckeditorminlength", function(F, u, t) {
        var u = $(u),
            a = (CKEDITOR.instances[u.attr("name")].updateElement(), u.val()),
            a = jQuery(a).text().length >= t;
        return a || $("html, body").animate({
            scrollTop: u.offset().top
        }, 100), a
    }, jQuery.validator.format("Please enter at least {0} characters")), $.validator.addMethod("zrPhone", function() {
        return !0
    }, "Invalid phone number format")
}();