[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/in-the-node)

<a href="https://nodei.co/npm/in-the-node/"><img src="https://nodei.co/npm/in-the-node.png"></a>

<img src="http://img.badgesize.io/https://unpkg.com/in-the-node@0.0.5/build/ES6/in-the-node.iife.js?compression=gzip">

# in-the-node

Embed node inside your browser with [RunKit](https://runkit.com/docs/embed).

[Full-screen Demo](https://rawgit.com/bahrus/in-the-node/master/demo/index.html)

Provide the initial notebook script via a child script tag:

```html
  <!-- Polyfill for re(dge)tro browsers -->
  <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
  <!-- Polyfill for re(dge)tro browsers -->
  <script type="module" src="../in-the-node.js"></script>
  <in-the-node>
      <script nomodule>
          // GeoJSON!
          var getJSON = require("async-get-json");
          await getJSON("https://storage.googleapis.com/maps-devrel/google.json");
      </script>
  </in-the-node>
```

<!--
```
<custom-element-demo>
  <template>
    <script type="module" src="https://unpkg.com/in-the-node@0.0.5/in-the-node.iife.js"></script>
    <in-the-node>
      <script nomodule>
            // GeoJSON!
            var getJSON = require("async-get-json");
            await getJSON("https://storage.googleapis.com/maps-devrel/google.json");
        </script>
    </in-the-node>
    </template>
</custom-element-demo>
```
-->
