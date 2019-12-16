// Generated by CoffeeScript 2.4.1
// # `nikita.lxd.config.set`

// Set container or server configuration keys.

// ## Options

// * `container` (string, required)
//   The name of the container.
// * `config` (object, required)
//   One or multiple keys to set.

// ## Set a configuration key

// ```js
// require('nikita')
// .lxd.config.set({
//   name: "my_container",
//   config:
//     'boot.autostart.priority': 100,
// }, function(err, {status}) {
//   console.log( err ? err.message : status ?
//     'Property set' : 'Property already present')
// });
// ```

// ## Source Code
var diff, merge, validate_container_name, yaml;

module.exports = function({options}) {
  var keys;
  this.log({
    message: "Entering lxd.config.set",
    level: 'DEBUG',
    module: '@nikitajs/lxd/lib/config/set'
  });
  if (!options.container) {
    // Validation
    throw Error("Invalid Option: container is required");
  }
  validate_container_name(options.container);
  // Execution
  keys = {};
  this.system.execute({
    cmd: `${['lxc', 'config', 'show', options.container].join(' ')}`,
    shy: true,
    code_skipped: 42
  }, function(err, {stdout}) {
    var config;
    if (err) {
      throw err;
    }
    config = yaml.safeLoad(stdout);
    return keys = diff(config.config, merge(config.config, options.config));
  });
  return this.call(function() {
    var k, v;
    // Note, it doesnt seem possible to set multiple keys in one command
    return this.system.execute({
      if: Object.keys(keys).length,
      cmd: `${((function() {
        var results;
        results = [];
        for (k in keys) {
          v = keys[k];
          results.push(['lxc', 'config', 'set', options.container, `${k} '${v.replace('\'', '\\\'')}'`].join(' '));
        }
        return results;
      })()).join('\n')}`,
      code_skipped: 42
    });
  });
};

// ## Dependencies
({merge} = require('mixme'));

yaml = require('js-yaml');

diff = require('object-diff');

validate_container_name = require('../misc/validate_container_name');
