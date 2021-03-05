// Generated by CoffeeScript 2.5.1
// # `nikita.ldap.user`

// Create and modify a user store inside an OpenLDAP server.   

// ## Example

// ```js
// const {$status} = await nikita.ldap.user({
//   uri: 'ldap://openldap.server/',
//   binddn: 'cn=admin,cn=config',
//   passwd: 'password',
//   user: {}
// })
// console.info(`User created or modified: ${$status}`)
// ```

// ## Schema
var handler, merge, schema, utils;

schema = {
  type: 'object',
  properties: {
    'name': {
      type: 'string',
      description: `Distinguish name storing the "olcAccess" property, using the database
address (eg: "olcDatabase={2}bdb,cn=config").`
    },
    'user': {
      oneOf: [
        {
          type: 'object'
        },
        {
          type: 'array'
        }
      ],
      description: `User object.`
    },
    // General LDAP connection information
    'binddn': {
      type: 'string',
      description: `Distinguished Name to bind to the LDAP directory.`
    },
    'passwd': {
      type: 'string',
      description: `Password for simple authentication.`
    },
    'uri': {
      oneOf: [
        {
          type: 'string'
        },
        {
          type: 'boolean',
          default: 'ldapi:///'
        }
      ],
      description: `LDAP Uniform Resource Identifier(s), "ldapi:///" if true, default to
false in which case it will use your openldap client environment
configuration.`
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var added, entry, i, k, len, loggedin, modified, new_password, ref, updated, user, v;
  if (!Array.isArray(config.user)) {
    // Auth related config
    // binddn = if config.binddn then "-D #{config.binddn}" else ''
    // passwd = if config.passwd then "-w #{config.passwd}" else ''
    // uri = if config.uri then "-H #{config.uri}" else '' # URI is obtained from local openldap conf unless provided
    // User related config
    // Note, very weird, if we don't merge, the user array is traversable but
    // the keys map to undefined values.
    config.user = [merge(config.user)];
  }
  modified = false;
  ref = config.user;
  for (i = 0, len = ref.length; i < len; i++) {
    user = ref[i];
    // Add the user
    entry = {};
    for (k in user) {
      v = user[k];
      if (k === 'userPassword' && !/^\{SASL\}/.test(user.userPassword)) {
        continue;
      }
      entry[k] = user[k];
    }
    ({updated, added} = (await this.ldap.add({
      entry: entry,
      uri: config.uri,
      binddn: config.binddn,
      passwd: config.passwd
    })));
    if (added) {
      log({
        message: "User added",
        level: 'WARN',
        module: 'nikita/ldap/user'
      });
    } else if (updated) {
      log({
        message: "User updated",
        level: 'WARN',
        module: 'nikita/ldap/user'
      });
    }
    if (updated || added) {
      modified = true;
    }
    // Check password is user is not new and his password is not of type SASL
    new_password = false;
    if (!added && user.userPassword && !/^\{SASL\}/.test(user.userPassword)) {
      ({
        $status: loggedin
      } = (await this.ldap.search({
        // See https://onemoretech.wordpress.com/2011/09/22/verifying-ldap-passwords/
        binddn: user.dn,
        passwd: user.userPassword,
        uri: config.uri,
        base: '',
        scope: 'base',
        filter: 'objectclass=*',
        code_skipped: 49
      })));
      if (!loggedin) {
        new_password = true;
      }
    }
    if (added || new_password && !/^\{SASL\}/.test(user.userPassword)) {
      await this.execute({
        // """
        // ldappasswd #{binddn} #{passwd} #{uri} \
        //   -s #{user.userPassword} \
        //   '#{user.dn}'
        // """
        command: ['ldappasswd', config.mesh ? `-Y ${utils.string.escapeshellarg(config.mesh)}` : void 0, config.binddn ? `-D ${utils.string.escapeshellarg(config.binddn)}` : void 0, config.passwd ? `-w ${utils.string.escapeshellarg(config.passwd)}` : void 0, config.uri ? `-H ${utils.string.escapeshellarg(config.uri)}` : void 0, `-s ${user.userPassword}`, `${utils.string.escapeshellarg(user.dn)}`].join(' ')
      });
      log({
        message: "Password modified",
        level: 'WARN'
      });
      modified = true;
    }
  }
  return {
    $status: modified
  };
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'ldap',
    schema: schema
  }
};

// ## Note

  // A user can modify it's own password with the "ldappasswd" command if ACL allows
// it. Here's an example:

  // ```bash
// ldappasswd -D cn=myself,ou=users,dc=ryba -w oldpassword \
//   -H ldaps://master3.ryba:636 \
//   -s newpassword 'cn=myself,ou=users,dc=ryba'
// ```

  // ## Dependencies
({merge} = require('mixme'));

utils = require('./utils');

// [index]: http://www.zytrax.com/books/ldap/apa/indeces.html
