//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  var InTheNode =
  /*#__PURE__*/
  function (_HTMLElement) {
    babelHelpers.inherits(InTheNode, _HTMLElement);

    function InTheNode() {
      babelHelpers.classCallCheck(this, InTheNode);
      return babelHelpers.possibleConstructorReturn(this, (InTheNode.__proto__ || Object.getPrototypeOf(InTheNode)).apply(this, arguments));
    }

    babelHelpers.createClass(InTheNode, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var notebook = RunKit.createNotebook({
          // the parent element for the new notebook
          element: this,
          // specify the source of the notebook
          source: "// GeoJSON!\nvar getJSON = require(\"async-get-json\");\n\nawait getJSON(\"https://storage.googleapis.com/maps-devrel/google.json\");"
        });
      }
    }], [{
      key: "is",
      get: function get() {
        return 'in-the-node';
      }
    }]);
    return InTheNode;
  }(HTMLElement);

  function init() {
    define(InTheNode);
  }

  if (!self['RunKit_Script']) {
    var scriptTag = document.createElement('script');
    scriptTag.src = 'https://embed.runkit.com';

    scriptTag.onload = function () {
      init();
    };

    document.head.appendChild(scriptTag);
  }
})();