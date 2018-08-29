
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
class InTheNode extends HTMLElement {
    static get is() { return 'in-the-node'; }
    connectedCallback() {
        const notebook = RunKit.createNotebook({
            // the parent element for the new notebook
            element: this,
            // specify the source of the notebook
            source: "// GeoJSON!\nvar getJSON = require(\"async-get-json\");\n\nawait getJSON(\"https://storage.googleapis.com/maps-devrel/google.json\");"
        });
    }
}
function init() {
    define(InTheNode);
}
if (!self['RunKit_Script']) {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://embed.runkit.com';
    scriptTag.onload = () => {
        init();
    };
    document.head.appendChild(scriptTag);
}
    })();  
        