// Generated by CoffeeScript 2.5.1
// # `nikita.system.user`

// Create or modify a Unix user.

// If the user home is provided, its parent directory will be created with root 
// ownerships and 0644 permissions unless it already exists.

// ## Callback parameters

// * `$status`   
//   Value is "true" if user was created or modified.

// ## Example

// ```coffee
// require('nikita')
// .system.user({
//   name: 'a_user',
//   system: true,
//   uid: 490,
//   gid: 10,
//   comment: 'A System User'
// }, function(err, {status}){
//   console.log(err ? err.message : 'User created: ' + status);
// })
// ```

// The result of the above action can be viewed with the command
// `cat /etc/passwd | grep myself` producing an output similar to
// "a\_user:x:490:490:A System User:/home/a\_user:/bin/bash". You can also check
// you are a member of the "wheel" group (gid of "10") with the command
// `id a\_user` producing an output similar to 
// "uid=490(hive) gid=10(wheel) groups=10(wheel)".

// ## Hooks
var handler, on_action, path, schema, utils;

on_action = function({config}) {
  switch (config.shell) {
    case true:
      config.shell = '/bin/sh';
      break;
    case false:
      config.shell = '/sbin/nologin';
  }
  if (typeof config.groups === 'string') {
    return config.groups = config.groups.split(',');
  }
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'comment': {
      type: 'string',
      description: `Short description of the login.`
    },
    'expiredate': {
      type: 'integer',
      description: `The date on which the user account is disabled.`
    },
    'gid': {
      type: 'integer',
      description: `Group name or number of the user´s initial login group.`
    },
    'groups': {
      type: 'array',
      items: {
        type: 'string'
      },
      description: `List of supplementary groups which the user is also a member of.`
    },
    'home': {
      type: 'string',
      description: `Value for the user´s login directory, default to the login name
appended to "BASE_DIR".`
    },
    'inactive': {
      type: 'integer',
      description: `The number of days after a password has expired before the account
will be disabled.`
    },
    'name': {
      type: 'string',
      description: `Login name of the user.`
    },
    'no_home_ownership': {
      type: 'boolean',
      description: `Disable ownership on home directory which default to the "uid" and
"gid" config, default is "false".`
    },
    'password': {
      type: 'string',
      description: `The unencrypted password.`
    },
    'password_sync': {
      type: 'boolean',
      default: true,
      description: `Synchronize password`
    },
    'shell': {
      // oneOf: [
      //   type: 'boolean'
      // ,
      //   type: 'string'
      // ]
      type: ['boolean', 'string'],
      default: '/bin/sh',
      description: `Path to the user shell, set to "/sbin/nologin" if \`false\` and "/bin/sh"
if \`true\` or \`undefined\`.`
    },
    'skel': {
      type: 'string',
      description: `The skeleton directory, which contains files and directories to be
copied in the user´s home directory, when the home directory is
created by useradd.`
    },
    'system': {
      type: 'boolean',
      description: `Create a system account, such user are not created with a home by
default, set the "home" option if we it to be created.`
    },
    'uid': {
      type: 'integer',
      description: `Numerical value of the user´s ID, must not exist.`
    }
  },
  required: ['name']
};

// ## Handler
handler = async function({
    metadata,
    config,
    tools: {log}
  }) {
  var $status, changed, err, group, groups, groups_info, i, j, k, len, len1, ref, ref1, user_info, users;
  log({
    message: "Entering user",
    level: 'DEBUG'
  });
  if (config.system == null) {
    config.system = false;
  }
  if (config.gid == null) {
    config.gid = null;
  }
  if (config.password_sync == null) {
    config.password_sync = true;
  }
  if (typeof config.shell === "function" ? config.shell(typeof config.shell !== 'string') : void 0) {
    throw Error(`Invalid option 'shell': ${JSON.strinfigy(config.shell)}`);
  }
  user_info = groups_info = null;
  ({users} = (await this.system.user.read()));
  user_info = users[config.name];
  log(user_info ? {
    message: `Got user information for ${JSON.stringify(config.name)}`,
    level: 'DEBUG',
    module: 'nikita/lib/system/group'
  } : {
    message: `User ${JSON.stringify(config.name)} not present`,
    level: 'DEBUG',
    module: 'nikita/lib/system/group'
  });
  // Get group information if
  // * user already exists
  // * we need to compare groups membership
  ({groups} = (await this.system.group.read({
    $if: user_info && config.groups
  })));
  groups_info = groups;
  if (groups_info) {
    log({
      message: `Got group information for ${JSON.stringify(config.name)}`,
      level: 'DEBUG'
    });
  }
  if (config.home) {
    this.fs.mkdir({
      $unless_exists: path.dirname(config.home),
      target: path.dirname(config.home),
      uid: 0,
      gid: 0,
      mode: 0o0644 // Same as '/home'
    });
  }
  if (!user_info) {
    await this.execute([
      {
        code_skipped: 9,
        command: ['useradd',
      config.system ? '-r' : void 0,
      !config.home ? '-M' : void 0,
      config.home ? '-m' : void 0,
      config.home ? `-d ${config.home}` : void 0,
      config.shell ? `-s ${config.shell}` : void 0,
      config.comment ? `-c ${utils.string.escapeshellarg(config.comment)}` : void 0,
      config.uid ? `-u ${config.uid}` : void 0,
      config.gid ? `-g ${config.gid}` : void 0,
      config.expiredate ? `-e ${config.expiredate}` : void 0,
      config.inactive ? `-f ${config.inactive}` : void 0,
      config.groups ? `-G ${config.groups.join(',')}` : void 0,
      config.skel ? `-k ${config.skel}` : void 0,
      `${config.name}`].join(' ')
      },
      {
        $if: config.home,
        command: `chown ${config.name}. ${config.home}`
      }
    ]);
    log({
      message: "User defined elsewhere than '/etc/passwd', exit code is 9",
      level: 'WARN'
    });
  } else {
    changed = [];
    ref = ['uid', 'home', 'shell', 'comment', 'gid'];
    for (i = 0, len = ref.length; i < len; i++) {
      k = ref[i];
      if ((config[k] != null) && user_info[k] !== config[k]) {
        changed.push(k);
      }
    }
    if (config.groups) {
      ref1 = config.groups;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        group = ref1[j];
        if (!groups_info[group]) {
          throw Error(`Group does not exist: ${group}`);
        }
        if (groups_info[group].users.indexOf(config.name) === -1) {
          changed.push('groups');
        }
      }
    }
    log(changed.length ? {
      message: `User ${config.name} modified`,
      level: 'WARN',
      module: 'nikita/lib/system/user/add'
    } : {
      message: `User ${config.name} not modified`,
      level: 'DEBUG',
      module: 'nikita/lib/system/user/add'
    });
    try {
      await this.execute({
        $if: changed.length,
        command: ['usermod', config.home ? `-d ${config.home}` : void 0, config.shell ? `-s ${config.shell}` : void 0, config.comment != null ? `-c ${utils.string.escapeshellarg(config.comment)}` : void 0, config.gid ? `-g ${config.gid}` : void 0, config.groups ? `-G ${config.groups.join(',')}` : void 0, config.uid ? `-u ${config.uid}` : void 0, `${config.name}`].join(' ')
      });
    } catch (error) {
      err = error;
      if (err.exit_code === 8) {
        throw Error(`User ${config.name} is logged in`);
      } else {
        throw err;
      }
    }
    if (config.home && (config.uid || config.gid)) {
      await this.fs.chown({
        $if_exists: config.home,
        $unless: config.no_home_ownership,
        target: config.home,
        uid: config.uid,
        gid: config.gid
      });
    }
  }
  // TODO, detect changes in password
  // echo #{config.password} | passwd --stdin #{config.name}
  if (config.password_sync && config.password) {
    ({$status} = (await this.execute({
      command: `hash=$(echo ${config.password} | openssl passwd -1 -stdin)
usermod --pass="$hash" ${config.name}`
    })));
    if ($status) {
      // arch_chroot: config.arch_chroot
      // rootdir: config.rootdir
      // sudo: config.sudo
      return log({
        message: "Password modified",
        level: 'WARN'
      });
    }
  }
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    argument_to_config: 'name',
    schema: schema
  }
};

// ## Dependencies
path = require('path');

utils = require('../utils');
