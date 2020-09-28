// Generated by CoffeeScript 2.5.1
var Ajv, ajv_keywords, error, is_object_literal, parse;

error = require('../utils/error');

Ajv = require('ajv');

ajv_keywords = require('ajv-keywords');

({is_object_literal} = require('mixme'));

parse = function(uri) {
  var matches;
  matches = /^(\w+:)\/\/(.*)/.exec(uri);
  if (!matches) {
    throw error('SCHEMA_URI_INVALID_PROTOCOL', ['uri must start with a valid protocol', 'such as "module://" or "registry://",', `got ${uri}.`]);
  }
  return {
    protocol: matches[1],
    pathname: matches[2]
  };
};

module.exports = function(action) {
  var ajv, schema;
  // schema = create(action)
  ajv = new Ajv({
    $data: true,
    allErrors: true,
    useDefaults: true,
    // extendRefs: 'ignore'
    extendRefs: true,
    // coerceTypes: true
    loadSchema: function(uri) {
      return new Promise(async function(accept, reject) {
        var module, pathname, protocol;
        ({protocol, pathname} = parse(uri));
        switch (protocol) {
          case 'module:':
            action = require.main.require(pathname);
            return accept(action.schema);
          case 'registry:':
            module = pathname.split('/');
            action = (await action.registry.get(module));
            return accept(action.metadata.schema);
        }
      });
    }
  });
  ajv_keywords(ajv);
  schema = {
    add: function(schema, name) {
      if (!schema) {
        return;
      }
      return ajv.addSchema(schema, name);
    },
    validate: async function(action, schema) {
      var validate;
      validate = (await ajv.compileAsync(schema));
      if (validate(action.config)) {
        return;
      }
      return error('NIKITA_SCHEMA_VALIDATION_CONFIG', [
        validate.errors.length === 1 ? 'one error was found in the configuration of' : 'multiple errors where found in the configuration of',
        action.metadata.namespace.length ? `action \`${action.metadata.namespace.join('.')}\`:` : "anonymous action:",
        validate.errors.map(function(err) {
          var key,
        msg,
        value;
          msg = err.schemaPath + ' ' + ajv.errorsText([err]).replace(/^data/,
        'config');
          if (err.params) {
            msg += ((function() {
              var ref,
        results;
              ref = err.params;
              results = [];
              for (key in ref) {
                value = ref[key];
                results.push(`, ${key} is ${JSON.stringify(value)}`);
              }
              return results;
            })()).join('');
          }
          return msg;
        }).sort().join('; ') + '.'
      ]);
    },
    list: function() {
      return {
        schemas: ajv._schemas,
        refs: ajv._refs,
        fragments: ajv._fragments
      };
    }
  };
  return {
    module: '@nikitajs/engine/src/plugins/schema',
    hooks: {
      'nikita:registry:normalize': function(action) {
        if (action.metadata == null) {
          action.metadata = {};
        }
        if (action.hasOwnProperty('schema')) {
          action.metadata.schema = action.schema;
          return delete action.schema;
        }
      },
      'nikita:session:normalize': function(action) {
        if (action.hasOwnProperty('schema')) {
          action.metadata.schema = action.schema;
          return delete action.schema;
        }
      },
      'nikita:session:action': {
        after: ['@nikitajs/engine/src/metadata/disabled', '@nikitajs/engine/src/plugins/conditions'],
        handler: async function(action, handler) {
          var err;
          if (action.metadata.disabled) {
            return handler;
          }
          action.schema = schema;
          if ((action.metadata.schema != null) && !is_object_literal(action.metadata.schema)) {
            throw error('METADATA_SCHEMA_INVALID_VALUE', ["option `schema` expect an object literal value,", `got ${JSON.stringify(action.metadata.schema)}.`]);
          }
          if (!action.metadata.schema) {
            return handler;
          }
          err = (await schema.validate(action, action.metadata.schema));
          if (err) {
            throw err;
          } else {
            return handler;
          }
        }
      }
    }
  };
};
