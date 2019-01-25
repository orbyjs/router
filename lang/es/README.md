# @orby/router

gestiona rutas de forma simple y elegante con tan solo 1kB

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



1. [Componentes](#componentes)
   1. [Provider](#provider)
   2. [Route](#route)
   3. [Link](#link)
   4. [Router](#Router)
   5. [Async](#async)
   6. [Folder](#folder)
2. [Hooks](#hooks)
   1. [useRedirect](#useredirect)
3. [Expresión path](#path)

## Componentes

### Provider

por defecto @orby/router puede manejar un estado de ruta sin usar  `popstate`, si desea manejar el historial del navegador debe añadir este debe ser añadido manualmente mediante el uso de  `history={insertHistory}`.

```jsx
<Provider location="/">
    <App/>
</Provider>
```

|Propiedad|Tipo|default|Detalle|
|---------|----|-------|-------|
|location|string|`/`|ubicación actual a transmitir por contexto|
|history|function||history permite acceder al objeto de suscriptores de `<Provider/>`, es útil para construir disparadores personalizados como `insertHistory` que maneja el historial del navegador|



### Route

Escucha una ruta de `<Provider/>` a base de una expresión dada a la propiedad `path`,ejemplo `path="/users/**"`

```jsx
<Route path="/user/*!">
    {([id])=>{
        return <h1>user id:{$id}</h1>
    }}
</Route>
```

|Propiedad|Tipo|default|Detalle|
|---------|----|-------|-------|
|path|string|`/`|expresión valida para [path](#path)|

### Link

Permite despachar un vinculo al componente `<Provider/>`.

```jsx
<Link path="/users">
    view users
</Link>
```
Ud también puede crear callback de redireccionamiento usando [useRedirect](#useredirect).

|Propiedad|Tipo|default|Detalle|
|---------|----|-------|-------|
|path|string|`/`|expresión valida para [path](#path)|

### Router

Router selecciona uno de sus hijos para la vista, ud puede hacer uso del componente `<Async/>` para generar cargas asíncronas de componentes, sea mediante el uso de `import` o `Promise`

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

|Propiedad|Tipo|default|Detalle|
|---------|----|-------|-------|
|path|string|`/`|expresión valida para [path](#path), el primer hijo en concordar con el patrón path será impreso por `<Router/>`|
|default|boolean||seleciona por defecto el componente default, en caso de que ningun patron de la lista de hijos sortee el patron|




### Async

permite generar una carga asíncrona de un componente, solo puede ser usando como hijo de `<Router>/`


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

|Propiedad|Tipo|default|Detalle|
|---------|----|-------|-------|
|path|string|`/`|expresión [path](#path), el primer hijo en concordar con expresión path será impreso por `<Router/>`|
|default|boolean||selecciona por defecto el componente default, en caso de que ninguna expresión de la lista de hijos sortee la comparación|
|loading|any||mientras espera la finalización de la función asíncrona, se enseñara loading|
|render|function||render siempre debe retornar una **promesa**, de usar import directamente el componente `<Async/>` importara por defecto del modulo la propiedad `module.default`|

### Folder

Permite manipular el contexto de grupo con la intencion de agupar el path, logrando asilar el comportamiento de `useRedirect`, `<Router/>`y `<Router>`, solo dentro del path dado por `<Folder/>`

```jsx
<Folder path="/users">
    <Route path="/*?">
        {([id])=>{
            return id;
        }}
    </Route>
</Folder>	
```

la ruta a escuchar por el componente `<Route/>` será  `/users/*?`.



| Propiedad | Tipo   | default | Detalle                             |
| --------- | ------ | ------- | ----------------------------------- |
| path      | string | `/`     | expresión valida para [path](#path) |

### 

## Hooks

### useRedirect

permite crear un callback capas de despachar un nuevo estado de ruta

```jsx
let redirectToUsers = useRedirect("/users");
```

## path

path se define como un string de expresión a usar dentro del router, este serializa las capturas en un arreglo el que puede ser leído mediante [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). path ofrece la siguiente lectura a base de los siguientes comodines

1. **parámetro** : `/*!`, captura un parámetro de la ruta.
2. **parametro opcional**: `/*?` captura un parametro opcional
3. **parámetros spread** : `/...` captura 0 o mas parámetros desde su definición, este solo debe ser usado al finalizar la expresión de path
4. **comodín any**: `/image.*.jpeg` permite aceptar rutas sin la necesidad de conocer su valor exacto.
5. **carpetas opcionales**: `/users|user` acepta la ruta en 2 frente a 2 condiciones `/users` o `/user`
