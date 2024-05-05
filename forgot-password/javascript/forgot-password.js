! function(o) {
    "use strict";
    o(function() {
        var e = zr.page.model.set_password_prompt_source,
            e = (e && o.log_event("page_view", {
                source_page: e,
                mixpanel_page_type: "Forgot Password"
            }), o('input[type="email"]:first').focus(), o("#forgot_password").floatLabels(), o("#forgot_password").validate({
                rules: {
                    email: {
                        required: !0,
                        email: !0
                    }
                },
                messages: {
                    email: "Please enter your kaziyako hub account email address."
                }
            }), o("#forgot_password").submit(function() {
                o.log_event("button_click", {
                    field: "reset_password"
                })
            }), zr.page.model.realm);
        e && o("#forgot_pw_realm").val(e)
    })
}(window.jQuery);