
// Dependencies
const registry = require('@nikitajs/core/lib/registry');
require('@nikitajs/file/lib/register');
require('@nikitajs/service/lib/register');

// Action registration
module.exports = {
  tools: {
    backup: '@nikitajs/tools/lib/backup',
    compress: '@nikitajs/tools/lib/compress',
    cron: {
      add: '@nikitajs/tools/lib/cron/add',
      remove: '@nikitajs/tools/lib/cron/remove'
    },
    extract: '@nikitajs/tools/lib/extract',
    dconf: '@nikitajs/tools/lib/dconf',
    iptables: '@nikitajs/tools/lib/iptables',
    git: '@nikitajs/tools/lib/git',
    npm: {
      '': '@nikitajs/tools/lib/npm',
      list: '@nikitajs/tools/lib/npm/list',
      outdated: '@nikitajs/tools/lib/npm/outdated',
      uninstall: '@nikitajs/tools/lib/npm/uninstall',
      upgrade: '@nikitajs/tools/lib/npm/upgrade'
    },
    repo: '@nikitajs/tools/lib/repo',
    rubygems: {
      'fetch': '@nikitajs/tools/lib/rubygems/fetch',
      'install': '@nikitajs/tools/lib/rubygems/install',
      'remove': '@nikitajs/tools/lib/rubygems/remove'
    },
    ssh: {
      keygen: '@nikitajs/tools/lib/ssh/keygen'
    },
    sysctl: '@nikitajs/tools/lib/sysctl'
  }
};

(async function() {
  try {
    return (await registry.register(module.exports));
  } catch (error) {
    console.error(error.stack);
    return process.exit(1);
  }
})();
