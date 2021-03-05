// Generated by CoffeeScript 2.5.1
// # `nikita.krb5.execute`

// Execute a Kerberos command.

// ## Example

// ```js
// const {$status} = await nikita.krb5.exec({
//   command: 'listprincs'
// })
// console.info(`Command was executed: ${$status}`)
// ```

// ## Hooks
var handler, mutate, on_action, schema, utils;

on_action = function({config}) {
  if (config.egrep != null) {
    throw Error('Deprecated config `egrep`');
  }
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'admin': {
      type: 'object',
      properties: {
        'realm': {
          type: 'string',
          description: `The realm the principal belongs to.`
        },
        'principal': {
          type: 'string',
          description: `KAdmin principal name unless \`kadmin.local\` is used.`
        },
        'server': {
          type: 'string',
          description: `Address of the kadmin server; optional, use "kadmin.local" if
missing.`
        },
        'password': {
          type: 'string',
          description: `Password associated to the KAdmin principal.`
        }
      }
    },
    'command': {
      type: 'string',
      description: `          `
    },
    'grep': {
      oneOf: [
        {
          type: 'string'
        },
        {
          instanceof: 'RegExp'
        }
      ],
      description: `Ensure the execute output match a string or a regular expression.`
    }
  },
  required: ['admin', 'command']
};

// ## Handler
handler = async function({config}) {
  var realm, stdout;
  realm = config.admin.realm ? `-r ${config.admin.realm}` : '';
  ({stdout} = (await this.execute({
    command: config.admin.principal ? `kadmin ${realm} -p ${config.admin.principal} -s ${config.admin.server} -w ${config.admin.password} -q '${config.command}'` : `kadmin.local ${realm} -q '${config.command}'`
  })));
  if (config.grep && typeof config.grep === 'string') {
    return {
      stdout: stdout,
      $status: stdout.split('\n').some(function(line) {
        return line === config.grep;
      })
    };
  }
  if (config.grep && utils.regexp.is(config.grep)) {
    return {
      stdout: stdout,
      $status: stdout.split('\n').some(function(line) {
        return config.grep.test(line);
      })
    };
  }
  return {
    $status: true,
    stdout: stdout
  };
};

// ## Export
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    global: 'krb5',
    schema: schema
  }
};

// ## Dependencies
({mutate} = require('mixme'));

utils = require('@nikitajs/core/lib/utils');
