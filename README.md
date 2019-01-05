# @orby/router

Manage your routes in a simple and declarative way.

## hooks

The handling of route states is done through the use of hooks, they subscribe to popstate and dispatch the changes of the history to the subscribers.

### useRouter

It allows to hear a specific route, returns an object if it is in the route and false if it is not in the route.

```jsx
export function Link(){
    let paramsRoot = useRouter("/"),
        paramsOther = useRouter("/other");
    return <div>
        {paramsRoot && "in root"}
        {paramsOther && "in other"}
    </div>; 
}
```

### useRedirect

returns a callback, which allows dispatching the new route to the browser.

```jsx
export function Link(){
    let redirect = useRedirect("/");
    return <a onClick={redirect}>root</a>    
}
```

## Components

The components allows you to create a context that is shared with the hooks

### Router.Route

Listen to a single specific route.

```jsx
<Router.Route path="/:folder">
    {(params)=>{
        return <h1>{params.folder}</h1>
    }}
</Router.Route>
```

### Router.Group

both the components and hooks will inherit the path of the component `Router.Group`, this as a benefit allows to define container routes, which effectively isolate small parts of the application.

```jsx
<Router.Group path="/:parent">
    <Router.Route path="/:folder">
        {(params)=>{
            return <h1>{params.parent} + {params.folder}</h1>
        }}
    </Router.Route>
</Router.Group>
```

### Router.Link

Allows you to create a `<a>` tag that has already instantiated the `useRedirect` hook.

```jsx
<Link path="/">
    go root
</Link>
```