// Generated by CoffeeScript 2.5.1
// registration of `nikita.file` actions
var registry;

registry = require('@nikitajs/engine/lib/registry');

module.exports = {
  file: {
    '': '@nikitajs/file/lib',
    cache: '@nikitajs/file/lib/cache',
    cson: '@nikitajs/file/lib/cson',
    download: '@nikitajs/file/lib/download',
    // ini: '@nikitajs/file/lib/ini'
    json: '@nikitajs/file/lib/json',
    properties: {
      '': '@nikitajs/file/lib/properties',
      read: '@nikitajs/file/lib/properties/read'
    },
    render: '@nikitajs/file/lib/render',
    touch: '@nikitajs/file/lib/touch',
    upload: '@nikitajs/file/lib/upload'
  }
};

(async function() {  // yaml: '@nikitajs/file/lib/yaml'
  return (await registry.register(module.exports));
})();
