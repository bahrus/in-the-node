declare var RunKit: any;
import {define} from 'xtal-latx/define.js';

export class InTheNode extends HTMLElement{
    static get is(){return 'in-the-node'}
    connectedCallback(){
        const notebook = RunKit.createNotebook({
            // the parent element for the new notebook
            element: this,
            // specify the source of the notebook
            source: "// GeoJSON!\nvar getJSON = require(\"async-get-json\");\n\nawait getJSON(\"https://storage.googleapis.com/maps-devrel/google.json\");"
        })
    }
}
function init(){
    define(InTheNode);
}

if(!(<any>self)['RunKit_Script']){
    const scriptTag = document.createElement('script') as HTMLScriptElement;
    scriptTag.src = 'https://embed.runkit.com';
    scriptTag.onload = () =>{
        init();
    }
    document.head.appendChild(scriptTag);
}