!(function(t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? e(exports, require("@orby/core"), require("path-path"))
        : "function" == typeof define && define.amd
        ? define(["exports", "@orby/core", "path-path"], e)
        : e((t["@orby/router"] = {}), t["@orby/core"], t.pathPath);
})(this, function(t, e, n) {
    var r = [],
        o = "__orby_router_namespace__",
        u = {
            path: "",
            getPath: function() {
                return window.location.pathname + location.search;
            },
            setPath: function(t) {
                window.history.pushState({}, "", t), i(t);
            },
            setup: function() {
                var t = this;
                window.addEventListener("popstate", function(e) {
                    i(t.getPath());
                });
            }
        };
    function a(t) {
        return (
            u.path || ((u.path = u.getPath()), u.setup()),
            t(u.path),
            r.push(t),
            function() {
                r.splice(r.indexOf(t) >>> 0, 1);
            }
        );
    }
    function i(t) {
        (u.path = t),
            r.forEach(function(e) {
                return e(t);
            });
    }
    function c(t, r) {
        var u = e.useState(!1),
            i = u[0],
            c = u[1],
            p = e.useContext(o) || "";
        return (
            (t = r ? t : n.join(p, t)),
            e.useEffect(function() {
                var e = n.create(t);
                return a(function(t) {
                    var r = n.compare(e, t);
                    c(r);
                });
            }, t),
            i
        );
    }
    function p(t) {
        return t.use;
    }
    function h(t, r) {
        var a = e.useContext(o) || "";
        return (
            (t = r ? t : n.join(a, t)),
            function(e) {
                e && e.preventDefault && e.preventDefault(),
                    u.setPath(n.resolve(u.path, t));
            }
        );
    }
    function f(t, r) {
        var u;
        return e.h(p, {
            context: ((u = {}), (u[o] = n.join(r[o] || "", t.path)), u),
            use: t.children[0]
        });
    }
    function s(t) {
        var e = c(t.path);
        return e ? t.children[0](e) : "";
    }
    function d(t) {
        var n = t.path,
            r = t.children,
            o = (function(t, e) {
                var n = {};
                for (var r in t)
                    Object.prototype.hasOwnProperty.call(t, r) &&
                        -1 === e.indexOf(r) &&
                        (n[r] = t[r]);
                return n;
            })(t, ["path", "children"]),
            u = h(n);
        return e.h("a", Object.assign({}, o, { href: n, onClick: u }), r);
    }
    var v = { Route: s, Group: f, Link: d };
    (t.NameSpace = o),
        (t.history = u),
        (t.subscribe = a),
        (t.dispatch = i),
        (t.useRouter = c),
        (t.useRedirect = h),
        (t.Group = f),
        (t.Route = s),
        (t.Link = d),
        (t.default = v);
});
//# sourceMappingURL=orby-router.umd.js.map
