! function() {
    "use strict";
    var i;
    (i = jQuery)(function() {
        window.ajax_init(i("body")), i(".modal .btn-primary").on("click", function() {
            return i(this).closest(".modal").find("form").submit()
        }), i(".toggle_job_save").on("click", function(t) {
            t.preventDefault();
            var a = i(this),
                t = {
                    href: a.attr("href"),
                    job_name: a.attr("data-job_name"),
                    company: a.attr("data-company"),
                    source: a.attr("data-source"),
                    job_location: a.attr("data-job_location"),
                    job_url: a.attr("data-job_url"),
                    posted_time: a.attr("data-posted_time"),
                    placement: a.attr("data-placement"),
                    modal: a.attr("data-modal"),
                    quiz_id: a.attr("data-quiz_id"),
                    listing_key: a.attr("data-listing_key"),
                    archive: a.attr("data-archive")
                };
            i.ajax({
                type: "POST",
                url: t.href,
                dataType: "json",
                data: t,
                beforeSend: function() {
                    a.attr("disabled", !0)
                },
                success: function(t) {
                    0 === t.action_state ? (a.attr("data-original-title", "Unsave job"), a.find("i:first").addClass("selected"), 0 < a.find("span:first").text().length && a.find("span:first").text("Saved")) : (a.attr("data-original-title", "Save job for later"), a.find("i:first").removeClass("selected"), 0 < a.find("span:first").text().length && a.find("span:first").text("Save")), window.parseAjaxResponse(t)
                },
                error: function() {
                    jAlert("There was an error processing your request, please try again later.", "error")
                },
                complete: function() {
                    a.attr("disabled", !1)
                }
            })
        }), i("input#register_and_save_job").on("click", function() {
            i(this).closest(".modal").find("form").submit()
        }), i(".ajax_modal_link").on("click", function(t) {
            return t.preventDefault(), i.get(i(this).attr("href"), {
                ajax: 1,
                modal: 1
            }, function(t) {
                return window.parseAjaxResponse(t)
            }), !1
        }), i(".ajax_submit_form").on("submit", function(t) {
            return t.preventDefault(), i(this).ajaxSubmit({
                data: {
                    ajax: 1
                },
                dataType: "json",
                success: window.parseAjaxResponse
            }), !1
        })
    }), window.ajax_init = function(t) {
        t.find("form:not(.modal_utils_is_bad)").validate(), t.find("input.focus").focus(), t.find(".validate").validate()
    }, window.parseAjaxResponse = function(t) {
        var a;
        if (t.html && window.AjaxModalForm(t.html), t.push_history && window.history.pushState({
                id: "histid"
            }, "", t.push_history), t.redirect_url && (a = t.redirect_url) && a.match(/^(https?:\/\/|\/)/i) && (window.top.location.href = t.redirect_url), t.refresh_page && window.location.reload(), t.refresh_after_close) return i(".modal").on("hidden.bs.modal", function() {
            return window.location.reload()
        })
    }, window.AjaxModalForm = function(t) {
        var a, e = i(t);
        return i(".modal").modal("hide"), e.on("shown.bs.modal", function() {
            return window.ajax_init(e)
        }), a = e.attr("id"), i("#" + a).replaceWith(t), i("body").append(e), i("#" + a).modal("show"), i("#" + a).find("form").submit(function() {
            var t = i(this);
            return t.valid() && (t.ajaxSubmit({
                dataType: "json",
                success: window.parseAjaxResponse
            }), e.modal("hide")), !1
        })
    }
}.call(this);