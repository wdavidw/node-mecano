// Generated by CoffeeScript 2.6.1
// Registration of `nikita.ipa` actions
var registry;

require('@nikitajs/network/lib/register');

registry = require('@nikitajs/core/lib/registry');

module.exports = {
  ipa: {
    group: {
      '': '@nikitajs/ipa/lib/group',
      add_member: '@nikitajs/ipa/lib/group/add_member',
      del: '@nikitajs/ipa/lib/group/del',
      exists: '@nikitajs/ipa/lib/group/exists',
      show: '@nikitajs/ipa/lib/group/show'
    },
    user: {
      '': '@nikitajs/ipa/lib/user',
      find: '@nikitajs/ipa/lib/user/find',
      del: '@nikitajs/ipa/lib/user/del',
      exists: '@nikitajs/ipa/lib/user/exists',
      show: '@nikitajs/ipa/lib/user/show'
    },
    service: {
      '': '@nikitajs/ipa/lib/service',
      del: '@nikitajs/ipa/lib/service/del',
      exists: '@nikitajs/ipa/lib/service/exists',
      show: '@nikitajs/ipa/lib/service/show'
    }
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
