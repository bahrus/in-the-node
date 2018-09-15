import { define } from 'xtal-latx/define.js';
/**
 * `in-the-node`
 *  Embed node inside your browser with RunKit.
 *
 * @customElement
 * @demo demo/index.html
 */
export class InTheNode extends HTMLElement {
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
        this.getScript();
    }
    onPropsChange() {
        const notebook = RunKit.createNotebook({
            // the parent element for the new notebook
            element: this,
            // specify the source of the notebook
            source: this._script.innerHTML,
        });
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
//# sourceMappingURL=in-the-node.js.map