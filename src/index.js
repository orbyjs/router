import { h, useState, useEffect, useContext } from "@orby/core";
import { create, compare, resolve, join } from "path-path";

let subscribers = [];

export let NameSpace = "@__orby_router_namespace__";

export let history = {
    path: "",
    getPath() {
        return window.location.pathname + location.search;
    },
    setPath(path) {
        window.history.pushState({}, "", path || "/");
        dispatch(path);
    },
    setup() {
        window.addEventListener("popstate", event => {
            dispatch(this.getPath());
        });
    }
};

export function subscribe(handler) {
    if (!history.path) {
        history.path = history.getPath();
        history.setup();
    }
    handler(history.path);
    subscribers.push(handler);
    return () => {
        subscribers.splice(subscribers.indexOf(handler) >>> 0, 1);
    };
}

export function dispatch(path) {
    history.path = path;
    subscribers.forEach(handler => handler(path));
}

export function useRoute(path, global) {
    let [state, setState] = useState(false),
        group = useContext(NameSpace) || "";

    path = global ? path : join(group, path);

    useEffect(() => {
        let route = create(path),
            lastPath;
        return subscribe(currentPath => {
            if (lastPath === currentPath) return;
            let params = compare(route, currentPath);
            lastPath = currentPath;
            setState(params);
        });
    }, path);

    return state;
}

function Context({ children }) {
    return children[0];
}

export function useRedirect(path, global) {
    let group = useContext(NameSpace) || "";

    path = global ? path : join(group, path);
    return event => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        path = resolve(history.path, path);
        history.setPath(path === "/." ? "/" : path);
    };
}

export function Group(props, context) {
    let group = context[NameSpace] || "";
    return (
        <Context context={{ [NameSpace]: join(group, props.path) }}>
            {props.children}
        </Context>
    );
}

export function Route(props) {
    let params = useRoute(props.path);
    return params ? props.children[0](params) : "";
}

export function Link({ path, children, ...props }) {
    let redirect = useRedirect(path);
    return (
        <a {...props} href={path} onClick={redirect}>
            {children}
        </a>
    );
}

export function RouteAsync(props) {
    let [state, setState] = useState(""),
        params = useRoute(props.path);

    useEffect(() => {
        if (state) setState(false);
        if (props.component)
            props.component().then(md => {
                setState(md.default);
            });
    }, params);

    if (!state && params) {
        return props.loading || "";
    }
    return params ? h(state) : "";
}

export function Switch({ children }) {
    return (
        <Route path=":path...">
            {({ path }) => {
                let length = children.length,
                    nextChild;
                for (let i = 0; i < length; i++) {
                    let child = children[i];
                    if (child.props.default) {
                        nextChild = child;
                    } else {
                        if (compare(create(child.props.path), path)) {
                            nextChild = child;
                            break;
                        }
                    }
                }
                // if (nextChild) {
                //     nextChild = nextChild.clone();
                //     delete nextChild.props.path;
                //     delete nextChild.props.default;
                // }
                return nextChild;
            }}
        </Route>
    );
}

export default {
    RouteAsync,
    Switch,
    Group,
    Route,
    Link
};
