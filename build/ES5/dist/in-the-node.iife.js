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

  var disabled = 'disabled';
  /**
   * Base class for many xtal- components
   * @param superClass
   */

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this;

          babelHelpers.classCallCheck(this, _class);
          _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class).apply(this, arguments));
          _this._evCount = {};
          return _this;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",

          /**
           * Set attribute value.
           * @param name
           * @param val
           * @param trueVal String to set attribute if true.
           */
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
          /**
           * Turn number into string with even and odd values easy to query via css.
           * @param n
           */

        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
          /**
           * Increment event count
           * @param name
           */

        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr('data-' + name, this.to$(ec[name]));
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
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

        }, {
          key: "de",
          value: function de(name, detail) {
            var asIs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var eventName = name + (asIs ? '' : '-changed');
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
          /**
           * Needed for asynchronous loading
           * @param props Array of property names to "upgrade", without losing value set while element was Unknown
           */

        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this2 = this;

            props.forEach(function (prop) {
              if (_this2.hasOwnProperty(prop)) {
                var value = _this2[prop];
                delete _this2[prop];
                _this2[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",

          /**
           * Any component that emits events should not do so if it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in should ensure not to call "de" if this property is set to true.
           */
          get: function get() {
            return this._disabled;
          },
          set: function set(val) {
            this.attr(disabled, val, '');
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return [disabled];
          }
        }]);
        return _class;
      }(superClass)
    );
  }
  /**
   * `in-the-node`
   *  Embed node inside your browser with RunKit.
   *
   * @customElement
   * @demo demo/index.html
   */


  var InTheNode =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(InTheNode, _XtallatX);

    function InTheNode() {
      var _this3;

      babelHelpers.classCallCheck(this, InTheNode);
      _this3 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(InTheNode).apply(this, arguments));
      _this3._input = null;
      return _this3;
    }

    babelHelpers.createClass(InTheNode, [{
      key: "getScript",
      value: function getScript() {
        var _this4 = this;

        this._script = this.querySelector('script');

        if (!this._script) {
          setTimeout(function () {
            _this4.getScript();
          }, 50);
          return;
        }

        this.onPropsChange();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._upgradeProperties(['input']);

        this.getScript();
      }
    }, {
      key: "onPropsChange",
      value: function onPropsChange() {
        var inp = this._input;

        if (inp !== null) {
          switch (babelHelpers.typeof(inp)) {
            case 'object':
              var s = JSON.stringify(inp);
              this._script.innerHTML = Array.isArray(inp) ? s : '(' + s + ')';
              break;

            default:
              this._script.innerHTML = inp.toString();
          }
        }

        Array.from(this.querySelectorAll('iframe')).forEach(function (n) {
          return n.remove();
        });
        var notebook = RunKit.createNotebook({
          // the parent element for the new notebook
          element: this,
          // specify the source of the notebook
          source: this._script.innerHTML
        });
      }
    }, {
      key: "input",
      get: function get() {
        return this._input;
      },
      set: function set(nv) {
        this._input = nv;
        this.getScript();
      }
    }], [{
      key: "is",
      get: function get() {
        return 'in-the-node';
      }
    }]);
    return InTheNode;
  }(XtallatX(HTMLElement));

  function init() {
    define(InTheNode);
  }

  if (!self['RunKit_Script']) {
    var scriptTag = document.createElement('script');
    scriptTag.src = 'https://embed.runkit.com';
    scriptTag.id = 'RunKit_Script';

    scriptTag.onload = function () {
      init();
    };

    document.head.appendChild(scriptTag);
  }
})();