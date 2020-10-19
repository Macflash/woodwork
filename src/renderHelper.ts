var renderer: ()=>void = ()=>{};

export function registerAppRender(render: ()=>void){
    renderer = render;
}

export function renderApp(){
    renderer();
}