
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
/**
 * `in-the-node`
 *  Embed node inside your browser with RunKit.
 *
 * @customElement
 * @demo demo/index.html
 */
class InTheNode extends XtallatX(HTMLElement) {
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
        this._upgradeProperties(['input']);
        this.getScript();
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
    })();  
        