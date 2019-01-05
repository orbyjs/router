# @orby/router

Gestiona tus rutas de forma simple y declarativa.

## hooks

El manejo de estados de ruta se realiza mediante el uso de hooks, estos se suscriben a popstate y despachan los cambios del historial a los suscriptores.

### useRouter

Permite escuchar una ruta especifica, retorna un objeto si este se encuentra en la ruta y false si este no se encuentra en la ruta.

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

retorna un callback, que permite despachar la nueva ruta al navegador

```jsx
export function Link(){
    let redirect = useRedirect("/");
    return <a onClick={redirect}>root</a>    
}
```

## Componentes

Los componentes permite crear un contexto que se comparte con los hooks

### Router.Route

Escucha una unica ruta espesifica.

```jsx
<Router.Route path="/:folder">
    {(params)=>{
        return <h1>{params.folder}</h1>
    }}
</Router.Route>
```

### Router.Group

tanto los componentes como hooks heredaran el path del componente `Router.Group`, esto como beneficio permite definir rutas contenedoras, que aíslen de forma efectiva pequeñas partes de la aplicación.

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

Permite crear una etiqueta `<a>` que ya ha intanciado el hook `useRedirect`.

```jsx
<Link path="/">
    go root
</Link>
```