! function(p, g) {
    window.zr = window.zr || {}, window.zr.event = window.zr.event || {}, window.zr.event.allFired = window.zr.event.allFired || "";
    var m = window.zr.debug,
        u = window.zr.debugger ? window.zr.debugger.logStyles : {};
    m && console.log("%c zr%c.tracking %c Type %cwindow.zr.event.allFired%c to see all events fired this pageview", u.zr, u.name, u.reset, u.cmd, u.reset);
    window.zr.event.numFired = 0, p.log_event = function(t, e, a) {
        if (window.zr.event.numFired = window.zr.event.numFired + 1, 100 <= window.zr.event.numFired) 100 === window.zr.event.numFired && console.warn("Max events per page exceeded. No longer recording.");
        else {
            var r, i = 2 === arguments.length && p.isFunction(e) ? e : (r = e, a);
            if (t) {
                var n = {};
                if (r)
                    for (var o in r) r.hasOwnProperty(o) && (n[o] = r[o]);
                var s = p.extend({}, window.zr.event.frontendSuperProperties, {
                    referrer: document.referrer.substring(0, 300),
                    screen_height: screen.height || 0,
                    screen_width: screen.width || 0,
                    window_height: p(window).height() || 0,
                    window_width: p(window).width() || 0,
                    fired_from: "frontend"
                });
                for (o in s) s.hasOwnProperty(o) && !n.hasOwnProperty(o) && (n[o] = s[o]);
                var d = window.zr.event.backendProperties;
                if (d != g)
                    for (var o in d) d.hasOwnProperty(o) && (n[o] = d[o]);
                c = window.location, l = c.hash, w = /\bintsrc=([^&=]+)\&?/, window.zr.event.intsrc == g && (b = l.match(w)) && ("#" === (l = l.replace(w, "")) && (l = ""), history.replaceState(null, null, c.pathname + c.search + l), window.zr.event.intsrc = b[1]);
                var c, w = window.zr.event.intsrc,
                    l = (w != g && (n.intsrc = w), window.zr.event.originType && (n.origin_type = window.zr.event.originType), c = window.JSON ? JSON.stringify(n) : '{"error":"JSON.stringify does not exist in browser"}', Date.now()),
                    b = window.zr.event.log_url || "/events/log",
                    w = {
                        event_type: t,
                        properties: c,
                        path: window.zr.event.request_path || window.location.pathname,
                        time: l
                    };
                navigator && navigator.sendBeacon ? (m && console.log("%c zr%c.tracking %c sendBeacon log_event: %c" + t, u.zr, u.name, u.cmd, u.reset, n), (c = new FormData).append("event_type", w.event_type), c.append("properties", w.properties), c.append("path", w.path), c.append("time", w.time), navigator.sendBeacon(b, c)) : (m && console.log("%c zr%c.tracking %c log_event: %c" + t, u.zr, u.name, u.cmd, u.reset, n), p.ajax({
                    url: b,
                    dataType: "json",
                    method: "POST",
                    data: w
                })), ! function(e, a) {
                    var r, n;
                    i !== g && i.apply(this, arguments), "success" === a ? (r = "event-log", n = t, window.zr && window.zr.event && (n = n + " (" + r + " front-end)", window.zr.event.allFired += window.zr.event.allFired ? ", " + n : n)) : console.warn("Failed to log " + t + " event")
                }({}, "success")
            }
        }
    }, window.mixpanel = {
        track: function(e, a) {
            p.log_event && p.log_event(e, a)
        }
    }, logPageView = function(e, a) {
        if (!window.zr.event.pageViewFired || e) {
            var r, e = (e = window.location.pathname).replace(/\/(\?.*)?$/, ""),
                n = window.location.pathname + window.location.search,
                t = window.zr.event.backendProperties.page_type,
                i = window.zr.event.pageviewBackendProperties;
            document.referrer;
            switch (e) {
                case "":
                case "/post-job":
                    r = "Homepage";
                    break;
                case "/login":
                    r = "Login";
                    break;
                case "/login/reset-password":
                    r = "Reset Password";
                    break;
                case "/login/forgot-password":
                    r = "Forgot Password";
                    break;
                case "/jobs/resume":
                    r = "Resume Landing";
                    break;
                case "/mobile":
                    r = "Mobile Landing";
                    break;
                case "/candidate/about":
                    r = "Candidate - About";
                    break;
                case "/candidate/alerts":
                    r = "Candidate - Alerts";
                    break;
                case "/candidate/my-jobs":
                    r = "Candidate - My Jobs";
                    break;
                case "/candidate/resume":
                    r = "Candidate - My Resume";
                    break;
                case "/candidate/references":
                    r = "Candidate - References";
                    break;
                case "/candidate/notifications":
                    r = "Candidate - Notifications";
                    break;
                case "/candidate/password":
                    r = "Candidate - Password";
                    break;
                case "/candidate/unsubscribe":
                    r = "Candidate - Unsubscribe";
                    break;
                case "/candidate/saved-jobs":
                    r = "Candidate - Saved Jobs";
                    break;
                case "/jobseeker/home":
                    r = "Candidate - Suggested Jobs";
                    break;
                case "/candidate/verify-identity":
                    r = "Candidate - Verify Identity";
                    break;
                case "/candidate/gothired":
                    r = "Candidate - Got Hired";
                    break;
                case "/candidate/onboard":
                    r = "Candidate - Recruiter Onboarding";
                    break;
                case "/candidate/replace-mobile-resume":
                    r = "Candidate - Replace Mobile Resume";
                    break;
                case "/employer":
                    r = "Employer - Landing";
                    break;
                case "/user/purchase-plan-simple":
                    r = "Employer - Paywall";
                    break;
                case "/quiz/create":
                    r = "Employer - Quiz Create";
                    break;
                case "/user/create":
                    r = "Employer - Reg Page";
                    break;
                case "/user/account":
                    r = "Employer - User Account";
                    break;
                case "/post-a-job":
                    r = "Employer - Post Job Landing";
                    break;
                case "/jobs/search":
                    r = "Employer - Job Search Home";
                    break;
                case "/employer/reactivate":
                    r = "Employer - Reactivate";
                    break;
                case "/user/purchase-upgrade":
                    r = "Employer - Upgrade Plan";
                    break;
                case "/user/set-plan":
                    r = "Employer - Select Plan";
                    break;
                case "/user/change-card":
                    r = "Employer - Change CC";
                    break;
                case "/candidate/testimonials":
                case "/job-sites":
                case "/pricing":
                case "/enterprise":
                case "/features":
                case "/employer-reviews":
                case "/guarantee":
                case "/faq":
                case "/sales":
                case "/about":
                case "/scale":
                    r = "Marketing";
                    break;
                case "/find-a-job":
                    r = "Vanity URL - SEM Simple"
            }
            if ("Marketing" != r) {
                switch (t) {
                    case "Vanity URL":
                        r = "Vanity URL";
                        break;
                    case "Job Search Home":
                        r = "Job Search Home";
                        break;
                    case "Jobs Directory Page":
                        r = "Jobs DIRP";
                        break;
                    case "Enhanced Directory Page":
                        r = "Enhanced DIRP";
                        break;
                    case "Salary Page":
                        r = "Salary Page";
                        break;
                    case "Jobs SERP":
                        r = "Jobs SERP";
                        break;
                    case "Organic Job":
                        r = "Organic Job";
                        break;
                    case "Job Browse Home":
                        r = "Browse Jobs";
                        break;
                    case "Single Page Reg-to-SERP":
                        r = "Single Page Reg-to-SERP";
                        break;
                    case "Top Results Page":
                        r = "Top Results Page";
                        break;
                    case "Salary Data Widget":
                        r = "Salary Data Widget";
                        break;
                    case "Individual Job Page":
                        r = window.zr.event.hasApplyUrl ? "External Apply Job" : "Zip Apply Job"
                }
                "/my-jobs?show=draft" === n && (r = "Employer - Draft Jobs")
            }
            "/blog" === e ? r = "Blog Home" : e.match(/^\/blog\//) ? r = "Blog Page" : e.match(/^\/contact\/survey\//) ? r = "Contact Survey Landing" : e.match(/^\/candidate\/zipresume\/verify\//) ? r = "Edit Resume" : e.match(/^\/candidate\/unsubscribe\//) ? r = "Candidate - Job Alert Unsubscribe" : e.match(/^\/submit-reference\//) ? r = "Reference Submit Form" : e.match(/^\/reference-giver\/create-alert\//) ? r = "Reference Giver - Create Alert" : e.match(/^\/user\/details\/\?unsub/) || e.match(/^\/user\/unsubscribe/) ? r = "Employer - Unsubscribe" : e.match(/^\/candidates/) && (r = "Employer - My Candidates"), r === g && "undefined" != (t = i.saw_registered_pixels) && 0 == t && (r = "Employer - Payment Complete Page"), i.non_interaction = 1, r && (i.mixpanel_page_type = r), zr.page && zr.page.model && zr.page.model.is_zremployerapp && (i.mobile_webview = 1), ab_tests = (ab_tests = i.ab_tests) || {}, a && (Object.assign(ab_tests, a.ab_tests), i.ab_tests = ab_tests), p.log_event("page_view", i), window.zr.event.pageViewFired = !0
        }
    }, window.zr.event.logPageView = logPageView, window.logPageView = logPageView
}(window.Zepto || window.jQuery || window.$);