import { h, useState, useEffect, useContext } from "@orby/core";
import { create, compare, resolve, join } from "path-path";

let subscribers = [];

export let NameSpace = "__orby_router_namespace__";

export let history = {
    path: "",
    getPath() {
        return window.location.pathname + location.search;
    },
    setPath(path) {
        window.history.pushState({}, "", path);
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

export function useRouter(path, global) {
    let [state, setState] = useState(false),
        group = useContext(NameSpace) || "";

    path = global ? path : join(group, path);

    useEffect(() => {
        let route = create(path);
        return subscribe(currentPath => {
            let params = compare(route, currentPath);
            setState(params);
        });
    }, path);

    return state;
}

function Layer(props) {
    return props.use;
}

export function useRedirect(path, global) {
    let group = useContext(NameSpace) || "";

    path = global ? path : join(group, path);
    return event => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        history.setPath(resolve(history.path, path));
    };
}

export function Group(props, context) {
    let group = context[NameSpace] || "";

    return (
        <Layer
            context={{ [NameSpace]: join(group, props.path) }}
            use={props.children[0]}
        />
    );
}

export function Route(props) {
    let params = useRouter(props.path);

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

export default {
    Route,
    Group,
    Link
};
