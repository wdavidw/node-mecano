// Generated by CoffeeScript 2.5.1
/*
The plugin enrich the config object with default values defined in the JSON
schema. Thus, it mst be defined after every module which modify the config
object.
*/
var is_object_literal, utils;

utils = require('../../utils');

({is_object_literal} = require('mixme'));

module.exports = {
  name: '@nikitajs/core/lib/plugins/metadata/schema',
  require: ['@nikitajs/core/lib/plugins/tools/schema'],
  hooks: {
    'nikita:action': {
      after: ['@nikitajs/core/lib/plugins/global'],
      handler: async function(action, handler) {
        var err;
        if ((action.metadata.schema != null) && !is_object_literal(action.metadata.schema)) {
          throw utils.error('METADATA_SCHEMA_INVALID_VALUE', ["option `schema` expect an object literal value,", `got ${JSON.stringify(action.metadata.schema)} in`, action.metadata.namespace.length ? `action \`${action.metadata.namespace.join('.')}\`.` : "root action."]);
        }
        if (!action.metadata.schema) {
          return handler;
        }
        err = (await action.tools.schema.validate(action));
        return function() {
          if (err) {
            throw err;
          }
          return handler.apply(null, arguments);
        };
      }
    }
  }
};
