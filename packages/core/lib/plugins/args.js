// Generated by CoffeeScript 2.5.1
/*
The `args` plugin place the original argument into the action "args" property.

*/
var utils;

utils = require('../utils');

module.exports = {
  name: '@nikitajs/core/lib/plugins/args',
  hooks: {
    'nikita:arguments': {
      handler: function({args, child}, handler) {
        var ref;
        // return handler is args.length is 0 # nikita is called without any args, eg `nikita.call(...)`
        // Erase all arguments to re-inject them later
        // return null if args.length is 1 and args[0]?.args
        if (child != null ? (ref = child.metadata) != null ? ref.raw_input : void 0 : void 0) { //or child?.metadata?.raw
          arguments[0].args = [{}];
        }
        return function() {
          var actions, ref1;
          // console.log child, args
          actions = handler.apply(null, arguments);
          // console.log actions
          // If raw_input is activated, just pass arguments as is
          // Always one action since arguments are erased
          if (child != null ? (ref1 = child.metadata) != null ? ref1.raw_input : void 0 : void 0) {
            actions.args = args;
            actions.metadata.raw_input = true;
            return actions;
          }
          // Otherwise, compute args and pass them to the returned actions
          args = utils.array.multiply(...args);
          if (Array.isArray(actions)) {
            return actions.map(function(action, i) {
              action.args = args[i];
              return action;
            });
          } else if (actions) {
            actions.args = args[0];
            return actions;
          }
        };
      }
    },
    'nikita:normalize': function(action, handler) {
      return async function() {
        var args;
        // Prevent arguments to move into config by normalize
        args = action.args;
        delete action.args;
        action = (await handler.apply(null, arguments));
        action.args = args;
        return action;
      };
    }
  }
};
