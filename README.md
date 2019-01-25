# @orby/router

manages routes in a simple and elegant way with only 1kB.

```jsx
<Router>
    <Async
        path="/config"
        loading="...loading"
        render={() =>import("./page/config.js")}
        />
    <Async
        path="/users"
        loading="...loading"
        render={() =>import("./page/users.js")}
        />
    <NoFound default/>
</Router>
```

1. [Components](#componentes)
   1. [Provider](#provider)
   2. [Route](#route)
   3. [Link](#link)
   4. [Router](#Router)
   5. [Async](#async)
   6. [Folder](#folder)
2. [Hooks](#hooks)
   1. [useRedirect](#useredirect)
3. [Path expression](#path)

## Components

### Provider

By default @orby/router can handle a route status without using `popstate`, if you want to handle the browser history you must add this must be added manually by using `history={insertHistory}`.

```jsx
<Provider location="/">
    <App/>
</Provider>
```

|Property|Type|default|Description|
|--------|----|-------|-----------|
| location | string | `/` | current location to be transmitted by context |
| history | function || history allows access to the subscriber object of `<Provider/>`, it is useful to build custom triggers like `insertHistory` that manages the browser history |



### Route

Listen to a `<Provider/>` path based on an expression given to the `path` property, example `path="/users/**"`

```jsx
<Route path="/user/*!">
    {([id])=>{
        return <h1>user id:{$id}</h1>
    }}
</Route>
```

|Property|Type|default|Description|
|--------|----|-------|-----------|
| path | string | `/` | valid expression for [path](#path) |

### Link

Allows dispatching a link to the `<Provider/>` component.

```jsx
<Link path="/users">
    view users
</Link>
```
You can also create redirect callback using [useRedirect](#useredirect).

|Property|Type|default|Description|
|--------|----|-------|-----------|
| path | string | `/` | valid expression for [path](#path) |

### Router

Router selects one of its children for the view, you can use the `<Async/>` component to generate asynchronous component loads, either through the use of `import` or` Promise`

```jsx
<Router>
    <Async
        path="/config"
        loading="...loading"
        render={() =>import("./page/config.js")}
        />
    <Async
        path="/users"
        loading="...loading"
        render={() =>import("./page/users.js")}
        />
    <NoFound default/>
</Router>
```

|Property|Type|default|Description|
|--------|----|-------|-----------|
| path | string | `/` | valid expression for [path](#path), the first child to match the path pattern will be printed by `<Router/>` |
| default | boolean || the default component is selected by default, in case no patron of the list of children draws the pattern |




### Async

allows to generate an asynchronous load of a component, it can only be used as a child of `<Router/>`

```jsx
<Router>
    <Async
        path="/config"
        loading="...loading"
        render={() =>import("./page/config.js")}
        />
    <Async
        path="/users"
        loading="...loading"
        render={() =>import("./page/users.js")}
        />
    <NoFound default/>
</Router>
```

|Property|Type|default|Description|
|--------|----|-------|-----------|
| path | string | `/` | expression [path](#path), the first child to match path expression will be printed by `<Router/>` |
| default | boolean || selects the default component by default, in case no expression in the list of children draws the comparison |
| loading | any || while waiting for the completion of the asynchronous function, it will be shown loading |
| render | function || render should always return a **promise**, to directly use the component `<Async/>` will import the `module.default` property by default from the module |

### Folder

Allows to manipulate the group context with the intention of storing the path, managing to isolate the behavior of `useRedirect`, `<Router/>` and `<Router/>`, only within the path given by `<Folder/>`.

```jsx
<Folder path="/users">
    <Route path="/*?">
        {([id])=>{
            return id;
        }}
    </Route>
</Folder>	
```

the path to listen for the `<Route/>` component will be `/users/*?`.



| Propiedad | Tipo   | default | Detalle                             |
| --------- | ------ | ------- | ----------------------------------- |
| path | string | `/` | valid expression for [path](#path) |


## Hooks

### useRedirect

allows you to create a callback layers to dispatch a new route status

```jsx
let redirectToUsers = useRedirect("/users");
```

## path

path is defined as an expression string to use within the router, it serializes the captures in an array that can be read by [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). path offers the following reading based on the following wildcards

1. **parameter**: `/*!`, Capture a parameter of the route.
2. **optional parameter**: `/*?` Captures an optional parameter
3. **spread parameters**: `/...` captures 0 or more parameters from its definition, this should only be used at the end of the path expression
4. **wildcard any**: `/image.*.Jpeg` allows you to accept routes without the need to know their exact value.
5. **optional folders**: `/users|user` accepts the route in 2 versus 2 conditions `/users` or `/user`
