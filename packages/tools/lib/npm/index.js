// Generated by CoffeeScript 2.5.1
// # `nikita.tools.npm`

// Install Node.js packages with NPM.

// It upgrades outdated packages if config "upgrade" is "true".

// ## Example

// The following action installs the coffescript package globally.

// ```js
// const {$status} = await nikita.tools.npm({
//   name: 'coffeescript',
//   global: true
// })
// console.info(`Package was installed: ${$status}`)
// ```

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'cwd': {
      $ref: 'module://@nikitajs/core/lib/actions/execute#/properties/cwd'
    },
    'global': {
      type: 'boolean',
      default: false,
      description: `Installs the current package context as a global package.`
    },
    'name': {
      type: 'array',
      items: {
        type: 'string'
      },
      description: `Name of the package(s) to install or upgrade if config "upgrade" is
"true".`
    },
    'sudo': {
      $ref: 'module://@nikitajs/core/lib/actions/execute#/properties/sudo'
    },
    'upgrade': {
      default: false,
      type: 'boolean',
      description: `Upgrade outdated packages.`
    }
  },
  required: ['name'],
  if: {
    properties: {
      'global': {
        const: false
      }
    }
  },
  then: {
    required: ['cwd']
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var install, installed, name, packages;
  // Upgrade
  await this.tools.npm.upgrade({
    $if: config.upgrade,
    cwd: config.cwd,
    global: config.global,
    name: config.name
  });
  // Get installed packages
  ({packages} = (await this.tools.npm.list({
    cwd: config.cwd,
    global: config.global
  })));
  // Install packages
  installed = Object.keys(packages);
  install = (function() {
    var i, len, ref, results;
    ref = config.name;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      if (installed.includes(name.split('@')[0])) {
        continue;
      }
      results.push(name);
    }
    return results;
  })();
  if (!install.length) {
    return;
  }
  await this.execute({
    command: ['npm install', config.global ? '--global' : void 0, ...install].join(' '),
    cwd: config.cwd
  });
  return log({
    message: `NPM Installed Packages: ${install.join(', ')}`
  });
};

// ## Export
module.exports = {
  handler: handler,
  metadata: {
    argument_to_config: 'name',
    schema: schema
  }
};
