import { define } from 'trans-render/define.js';
import { hydrate } from 'trans-render/hydrate.js';
import { XtallatX } from 'xtal-element/xtal-latx.js';
/**
 * `in-the-node`
 *  Embed node inside your browser with RunKit.
 *
 * @customElement
 * @demo demo/index.html
 */
export class InTheNode extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._input = null;
    }
    static get is() { return 'in-the-node'; }
    getScript() {
        this._script = this.querySelector('script');
        if (!this._script) {
            setTimeout(() => {
                this.getScript();
            }, 50);
            return;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.propUp(['input']);
        this.getScript();
    }
    get value() {
        return this._value;
    }
    set value(nv) {
        this._value = nv;
        this.de('value', {
            value: nv
        });
    }
    onPropsChange() {
        const inp = this._input;
        if (inp !== null) {
            switch (typeof (inp)) {
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
        });
    }
    get input() {
        return this._input;
    }
    set input(nv) {
        this._input = nv;
        this.getScript();
    }
}
function init() {
    define(InTheNode);
}
if (!self['RunKit_Script']) {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://embed.runkit.com';
    scriptTag.id = 'RunKit_Script';
    scriptTag.onload = () => {
        init();
    };
    document.head.appendChild(scriptTag);
}
