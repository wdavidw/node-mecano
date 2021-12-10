// Generated by CoffeeScript 2.6.1
// Registration of `nikita.java` actions
var registry;

require('@nikitajs/file/lib/register');

registry = require('@nikitajs/core/lib/registry');

module.exports = {
  java: {
    keystore_add: '@nikitajs/java/lib/keystore_add',
    keystore_remove: '@nikitajs/java/lib/keystore_remove'
  }
};

(async function() {
  var err;
  try {
    return (await registry.register(module.exports));
  } catch (error) {
    err = error;
    console.error(err.stack);
    return process.exit(1);
  }
})();
