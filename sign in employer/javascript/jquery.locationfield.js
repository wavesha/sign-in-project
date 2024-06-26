! function(n) {
    "use strict";

    function t(t, o) {
        var a = "zipcode" === c ? "&select_code=p" : "";
        n.ajax({
            url: zr.page.model.autoCompleteUrl + a,
            data: {
                location: t
            },
            success: function(a) {
                var e, d;
                s[t] = (a = a.results, e = {}, d = {
                    US: "USA",
                    GB: "UK",
                    CA: "Canada",
                    AU: "Australia"
                }, _.each(a, function(a) {
                    var o;
                    (a.city && a.admin1_code && a.cc || "zipcode" === c && a.postal_code && a.city && a.admin1_code && a.cc) && (o = {
                        result: a,
                        latitude: a.lat,
                        longitude: a.lng,
                        formatted_address: a.name,
                        address: n.grep([a.city, a.admin1_code, d[a.cc] || a.cc], Boolean).join(", "),
                        city: a.city,
                        state: a.admin1_code.substring(0, 2),
                        country: a.cc,
                        formatted_country: d[a.cc] || a.cc,
                        zipcode: a.postal_code,
                        valid: !0,
                        cbsa_no: a.cbsa_code,
                        cbsa_name: a.cbsa_name
                    }, "US" !== a.cc && "zipcode" !== c || (o.address = o.formatted_address), zr.known_locations[o.address] && zr.known_locations[o.address].valid || (zr.known_locations[o.address] = o, e[o.address] = o), e[o.address] || (e[o.address] = o))
                }), _.values(e)), o(s[t])
            },
            error: function(a, o, e) {
                n.log_event("locationfield", {
                    type: "service-error",
                    address: t,
                    status: o,
                    error: e,
                    mode: c
                })
            }
        })
    }(0, zr.util.namespace)("zr.known_locations", {});
    var s = {},
        c = "default";
    n.validator.addMethod("geocoded", function(a, o) {
        var e = document.activeElement === o,
            o = n(o).data("location_address");
        return !!(e || !zr.known_locations[o] || zr.known_locations[o] && zr.known_locations[o].valid)
    }, "You must enter a valid city or ZIP code."), n.fn.extend({
        locationField: function() {
            return this.each(function() {
                function a() {
                    e.removeClass("ajax_loader");
                    var a = e.data("location_address");
                    "" === a || zr.known_locations[a] && zr.known_locations[a].valid || (e.addClass("ajax_loader"), zr.known_locations[a] = {
                        valid: !1
                    }, t(a, function(a) {
                        d(a[0])
                    }))
                }
                var e = n(this),
                    d = function(a) {
                        if (e.removeClass("ajax_loader"), a && a.address) {
                            if ("zipcode" === c && !a.zipcode) return;
                            "zipcode" === c ? (e.val(a.zipcode), e.siblings(".autocomplete_zipcode_address").remove(), e.after('<span class="autocomplete_zipcode_filler">' + a.zipcode + '</span><span class="autocomplete_zipcode_address"> - ' + a.city + ", " + a.state + " " + a.formatted_country + "</span>")) : e.val(a.address), e.data("location_address", a.address), zr.known_locations[a.address] && zr.known_locations[a.address].valid && (e.trigger("location_updated", [zr.known_locations[a.address]]), n.log_event("locationfield", {
                                type: "updated",
                                valid: !0,
                                location: a.address,
                                mode: c
                            }))
                        }
                        a && a.address && zr.known_locations[a.address] && zr.known_locations[a.address].valid ? (e.trigger("location_updated", [zr.known_locations[a.address]]), n.log_event("locationfield", {
                            type: "updated",
                            valid: !0,
                            location: a.address,
                            mode: c
                        })) : (e.trigger("location_updated", [{}]), n.log_event("locationfield", {
                            type: "updated",
                            valid: !1,
                            location: e.data("location_address"),
                            mode: c
                        }))
                    };
                return e.on("modeChange", function(a, o) {
                    s = {}, "zipcode" === (c = o) && e.siblings(".autocomplete_zipcode_address").remove()
                }), e.autocomplete({
                    minLength: 2,
                    source: function(a, o) {
                        e.addClass("ajax_loader"), t(a.term, function(a) {
                            e.removeClass("ajax_loader"), o(a)
                        })
                    },
                    focus: function(a, o) {
                        return !1
                    },
                    select: function(a, o) {
                        return d(o.item), !1
                    }
                }), e.data("ui-autocomplete")._renderItem = function(a, o) {
                    return n("<li></li>").data("ui-autocomplete-item", o).append("<a>" + o.address + "</a>").appendTo(a)
                }, e.val() && (e.data("location_address", e.val()), setTimeout(a, 1e3)), e.on("blur", a), e.on("input", function() {
                    e.data("location_address", e.val()), e.siblings(".autocomplete_zipcode_address").remove()
                }), e
            })
        }
    })
}(jQuery);