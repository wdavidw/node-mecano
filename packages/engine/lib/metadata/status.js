// Generated by CoffeeScript 2.5.1
var is_object, is_object_literal, utils;

({is_object, is_object_literal} = require('mixme'));

utils = require('../utils');

module.exports = function() {
  return {
    module: '@nikitajs/engine/src/metadata/status',
    require: ['@nikitajs/engine/src/plugins/history', '@nikitajs/engine/src/metadata/raw'],
    hooks: {
      // 'nikita:registry:normalize': (action) ->
      //   action.metadata ?= {}
      //   action.metadata.shy ?= false
      'nikita:session:normalize': function(action, handler) {
        // Do not default shy to false or metadata from the registry will be overwritten
        // Todo: create a test to illutrate it
        // action.metadata.shy ?= false
        // Register action
        action.registry.register(['status'], {
          metadata: {
            raw: true
          },
          handler: function({
              parent,
              args: [position]
            }) {
            if (typeof position === 'number') {
              return parent.children.slice(position)[0].output.status;
            } else if (position == null) {
              return parent.children.some(function(child) {
                return child.output.status;
              });
            } else {
              throw utils.error('NIKITA_STATUS_POSITION_INVALID', ['argument position must be an integer if defined,', `get ${JSON.stringify(position)}`]);
            }
          }
        });
        return async function() {
          // Handler execution
          action = (await handler.apply(null, arguments));
          // Register `status` operation
          if (action.tools == null) {
            action.tools = {};
          }
          action.tools.status = function(index) {
            var i, l, sibling;
            if (arguments.length === 0) {
              return action.children.some(function(sibling) {
                var ref;
                return !sibling.metadata.shy && ((ref = sibling.output) != null ? ref.status : void 0) === true;
              });
            } else {
              l = action.children.length;
              i = index < 0 ? l + index : index;
              sibling = action.children[i];
              if (!sibling) {
                throw Error(`Invalid Index ${index}`);
              }
              return sibling.output.status;
            }
          };
          return action;
        };
      },
      'nikita:session:result': {
        before: '@nikitajs/engine/src/plugins/history',
        handler: function({action, error, output}) {
          var inherit;
          inherit = function(output) {
            if (output == null) {
              output = {};
            }
            output.status = action.children.some(function(child) {
              var ref;
              if (child.metadata.shy) {
                return false;
              }
              return ((ref = child.output) != null ? ref.status : void 0) === true;
            });
            return output;
          };
          if (!error && !action.metadata.raw_output) {
            return arguments[0].output = (function() {
              var ref;
              if (typeof output === 'boolean') {
                return {
                  status: output
                };
              } else if (is_object_literal(output)) {
                if (output.hasOwnProperty('status')) {
                  output.status = !!output.status;
                  return output;
                } else {
                  return inherit(output);
                }
              } else if (output == null) {
                return inherit(output);
              } else if (is_object(output)) {
                return output;
              } else if (Array.isArray(output) || ((ref = typeof output) === 'string' || ref === 'number')) {
                return output;
              } else {
                throw utils.error('HANDLER_INVALID_OUTPUT', ['expect a boolean or an object or nothing', 'unless the `raw_output` configuration is activated,', `got ${JSON.stringify(output)}`]);
              }
            })();
          }
        }
      }
    }
  };
};
