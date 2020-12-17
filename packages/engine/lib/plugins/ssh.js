// Generated by CoffeeScript 2.5.1
var merge, session, utils;

({merge} = require('mixme'));

utils = require('../utils');

session = require('../session');

/*
Pass an SSH connection or SSH information to an action. Disable SSH if the value
is `null` or `false`.
*/
module.exports = function() {
  return {
    module: '@nikitajs/engine/src/plugins/ssh',
    require: ['@nikitajs/engine/src/plugins/tools_find'],
    hooks: {
      'nikita:session:normalize': function(action, handler) {
        var ssh;
        if (action.metadata.namespace[0] === 'ssh') {
          // Dont interfere with ssh actions
          return handler;
        }
        if (action.hasOwnProperty('ssh')) {
          ssh = action.ssh;
          delete action.ssh;
        }
        return async function() {
          action = (await handler.call(null, ...arguments));
          action.ssh = ssh;
          return action;
        };
      },
      'nikita:session:action': async function(action, handler) {
        var ssh;
        // return handler if action.metadata.namespace[0] is 'ssh'
        ssh = (await action.tools.find(function(action) {
          if (action.ssh === void 0) {
            return void 0;
          }
          return action.ssh || false;
        }));
        if (ssh && !utils.ssh.is(ssh)) {
          ({ssh} = (await session({
            // Need to inject `tools.log`
            plugins: [require('../plugins/tools_events'), require('../plugins/tools_log'), require('../metadata/status'), require('../plugins/history')]
          }, function({run}) {
            return run({
              metadata: {
                namespace: ['ssh', 'open']
              },
              config: ssh
            });
          })));
          action.metadata.ssh_dispose = true;
        } else if (ssh === false) {
          ssh = null;
        }
        action.ssh = ssh;
        return handler;
      },
      'nikita:session:result': async function({action}) {
        if (action.metadata.ssh_dispose) {
          return (await session({
            // Need to inject `tools.log`
            plugins: [require('../plugins/tools_events'), require('../plugins/tools_log'), require('../metadata/status'), require('../plugins/history')]
          }, function({run}) {
            return run({
              metadata: {
                namespace: ['ssh', 'close']
              },
              config: {
                ssh: action.ssh
              }
            });
          }));
        }
      }
    }
  };
};
