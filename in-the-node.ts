declare var RunKit: any;
import {define} from 'xtal-latx/define.js';
import {XtallatX} from 'xtal-latx/xtal-latx.js';
/**
 * `in-the-node`
 *  Embed node inside your browser with RunKit.
 *
 * @customElement
 * @demo demo/index.html
 */
export class InTheNode extends XtallatX(HTMLElement){
    static get is(){return 'in-the-node'}
    _script!: HTMLScriptElement;
    getScript(){
        this._script = this.querySelector('script') as HTMLScriptElement;
        if(!this._script){
            setTimeout(() =>{
                this.getScript();
            }, 50);
            return;
        }
        this.onPropsChange();
    }
    connectedCallback(){
        this._upgradeProperties(['input']);
        this.getScript();
        
    }
    onPropsChange(){
        const inp = this._input;
        if(inp !== null){
            switch(typeof(inp)){
                case 'object':
                    const s = JSON.stringify(inp);
                    this._script.innerHTML = Array.isArray(inp) ? s : '(' + s + ')';
                    break;
                default:
                    this._script.innerHTML = inp.toString();
            }
        }
        Array.from(this.querySelectorAll('iframe')).forEach(n => n.remove());
        const notebook = RunKit.createNotebook({
            // the parent element for the new notebook
            element: this,
            // specify the source of the notebook
            source: this._script.innerHTML,
        })
    }
    _input: any = null;
    get input(){
        return this._input;
    }
    set input(nv){
        this._input = nv;
        this.getScript();
    }
}
function init(){
    define(InTheNode);
}

if(!(<any>self)['RunKit_Script']){
    const scriptTag = document.createElement('script') as HTMLScriptElement;
    scriptTag.src = 'https://embed.runkit.com';
    scriptTag.id = 'RunKit_Script';
    scriptTag.onload = () =>{
        init();
    }
    document.head.appendChild(scriptTag);
}