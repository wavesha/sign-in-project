window.jQuery, $.validator.defaults.errorElement = "div", $.validator.prototype.defaultShowErrors = function() {
    for (var t, s, i = 0; this.errorList[i]; i++) s = this.errorList[i], this.settings.highlight && this.settings.highlight.call(this, s.element, this.settings.errorClass, this.settings.validClass), this.showLabel(s.element, s.message, s.method);
    if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
        for (i = 0; this.successList[i]; i++) this.showLabel(this.successList[i]);
    if (this.settings.unhighlight)
        for (i = 0, t = this.validElements(); t[i]; i++) this.settings.unhighlight.call(this, t[i], this.settings.errorClass, this.settings.validClass);
    this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
}, $.validator.prototype.showLabel = function(t, s, i) {
    var e, r, h, a = $(t),
        o = this.errorsFor(t),
        l = this.idOrName(t),
        n = a.attr("aria-describedby");
    n && 0 < (h = $("#" + a.attr("aria-describedby"))).length && (o = h), i && (s = a.data("error-" + i) || s), o.length ? (o.removeClass(this.settings.validClass).addClass(this.settings.errorClass), o.html(s), o.show()) : (h = o = $("<" + this.settings.errorElement + ">").attr({
        id: l + "-error",
        "aria-live": "polite"
    }).addClass(this.settings.errorClass).addClass("validate_error_label").html(s || ""), this.settings.wrapper && (h = o.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(h) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, h, $(t)) : h.insertAfter(t), o.is("label") ? o.attr("for", l) : 0 === o.parents("label[for='" + l + "']").length && (a = o.attr("id"), n ? n.match(new RegExp("\\b" + a + "\\b")) || (n += " " + a) : n = a, $(t).attr("aria-describedby", n), e = this.groups[t.name]) && (r = this, $.each(r.groups, function(t, s) {
        s === e && $("[name='" + t + "']", r.currentForm).attr("aria-describedby", o.attr("id"))
    }))), !s && this.settings.success && (o.text(""), "string" == typeof this.settings.success ? o.addClass(this.settings.success) : this.settings.success(o, t)), this.toShow = this.toShow.add(o)
};