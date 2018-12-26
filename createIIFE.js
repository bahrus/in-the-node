const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'xtal-latx.js', 'in-the-node.js'], 'dist/in-the-node.iife.js');