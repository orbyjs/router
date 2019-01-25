import {
    h,
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo
} from "@orby/core";

import { match, join, resolve } from "./path";

let ContextGroup = createContext("");
let ContextProvider = createContext({});

export function useJoin(add = "") {
    let group = join(useContext(ContextGroup) || "", add);

    return add => join(group, add);
}

export function useCurrentPath() {
    let context = useContext(ContextProvider),
        [path, setPath] = useState(context.path);
    useEffect(
        () => {
            return context.subscribe(nextPath => {
                if (path !== nextPath) setPath(nextPath);
                path = nextPath;
            });
        },
        [context]
    );
    return path;
}

export function useMatchPath(path) {
    let join = useJoin(),
        nextPath = join(path),
        currentPath = useCurrentPath();
    return match(nextPath, currentPath);
}

export function useRedirect(path) {
    let context = useContext(ContextProvider),
        join = useJoin();

    path = join(path);
    return event => {
        if (event && event.preventDefault) event.preventDefault();
        context.dispatch(resolve(context.path, path));
    };
}

export function insertHistoy(ctrl) {
    let dispatch = ctrl.dispatch,
        prevent;
    ctrl.dispatch = nextPath => {
        history.pushState(nextPath, {}, nextPath);
        dispatch(nextPath);
    };
    window.addEventListener("popstate", () => {
        dispatch(location.pathname);
    });
    return ctrl;
}

export function Provider(props) {
    let [handlers] = useState([]),
        path = props.location || "/",
        ctrl = useMemo(
            () => {
                ctrl = {
                    get path() {
                        return path;
                    },
                    subscribe(handler) {
                        handlers.push(handler);
                        return () => {
                            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
                        };
                    },
                    dispatch(nextPath) {
                        path = nextPath;
                        handlers.forEach(handler => handler(path));
                    }
                };
                if (props.history) {
                    ctrl = props.history(ctrl);
                }
                return ctrl;
            },
            [handlers]
        );

    return (
        <ContextProvider.Provider value={ctrl}>
            {props.children}
        </ContextProvider.Provider>
    );
}

export function Folder({ children, path }) {
    let join = useJoin();
    return (
        <ContextGroup.Provider value={join(path)}>
            {children}
        </ContextGroup.Provider>
    );
}

export function Route({ path, children }) {
    let params = useMatchPath(path);
    if (params) {
        return children[0](params);
    }
    return "";
}

export function Link({ children, path }) {
    let redirect = useRedirect(path);
    return <a onClick={redirect}>{children}</a>;
}

export function Router({ children, path }) {
    let currentPath = useCurrentPath(),
        join = useJoin(),
        next,
        params;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child.props.default) {
            next = child;
        } else {
            if ((params = match(join(child.props.path), currentPath))) {
                next = child;
                break;
            }
        }
    }
    if (next) {
        next = next.clone();
        next.props.params = params || [];
        delete next.props.default;
        delete next.props.path;
        return next;
    }
    return "";
}

export function Async(props) {
    let [Component, setComponent] = useState("");

    useEffect(() => {
        props
            .render(props.params)
            .then(md => setComponent(md.default ? md.default : md))
            .catch(() => {
                if (props.error) setComponent(props.error);
            });
        return () => {
            if (Component) setComponent("");
        };
    }, props.params);

    if (!Component) {
        return props.loading;
    }
    return typeof Component === "function" ? (
        <Component children={props.children} />
    ) : (
        Component
    );
}

export default {
    Provider,
    Folder,
    Router,
    Route,
    Async,
    Link
};
