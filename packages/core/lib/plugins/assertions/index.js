// Generated by CoffeeScript 2.5.1
var handlers, session, utils;

session = require('../../session');

utils = require('../../utils');

module.exports = {
  name: '@nikitajs/core/lib/plugins/assertions',
  require: ['@nikitajs/core/lib/plugins/metadata/raw', '@nikitajs/core/lib/plugins/metadata/disabled'],
  hooks: {
    'nikita:normalize': function(action, handler) {
      var assertions, property, ref, value;
      // Ventilate assertions properties defined at root
      assertions = {};
      ref = action.metadata;
      for (property in ref) {
        value = ref[property];
        if (/^(un)?assert$/.test(property)) {
          if (assertions[property]) {
            throw Error('ASSERTION_DUPLICATED_DECLARATION', [`Property ${property} is defined multiple times,`, 'at the root of the action and inside assertions']);
          }
          if (!Array.isArray(value)) {
            value = [value];
          }
          assertions[property] = value;
          delete action.metadata[property];
        }
      }
      return async function() {
        action = (await handler.call(null, ...arguments));
        action.assertions = assertions;
        return action;
      };
    },
    'nikita:result': async function({action, error, output}) {
      var final_run, k, local_run, ref, v;
      final_run = true;
      ref = action.assertions;
      for (k in ref) {
        v = ref[k];
        if (handlers[k] == null) {
          continue;
        }
        local_run = (await handlers[k].call(null, action, error, output));
        if (local_run === false) {
          final_run = false;
        }
      }
      if (!final_run) {
        throw utils.error('NIKITA_INVALID_ASSERTION', ['action did not validate the assertion']);
      }
    }
  }
};

handlers = {
  assert: async function(action, error, output) {
    var assertion, final_run, i, len, ref, run;
    final_run = true;
    ref = action.assertions.assert;
    for (i = 0, len = ref.length; i < len; i++) {
      assertion = ref[i];
      if (typeof assertion === 'function') {
        run = (await session({
          $: {
            handler: assertion,
            metadata: {
              bastard: true,
              raw_output: true
            },
            parent: action,
            config: action.config,
            error: error,
            output: output
          }
        }));
        if (typeof run !== 'boolean') {
          throw utils.error('NIKITA_ASSERTION_INVALID_OUTPUT', ['invalid assertion output,', 'expect a boolean value,', `got ${JSON.stringify(run)}.`]);
        }
      } else {
        run = utils.object.match(output, assertion);
      }
      if (run === false) {
        final_run = false;
      }
    }
    return final_run;
  },
  unassert: async function(action, error, output) {
    var assertion, final_run, i, len, ref, run;
    final_run = true;
    ref = action.assertions.unassert;
    for (i = 0, len = ref.length; i < len; i++) {
      assertion = ref[i];
      if (typeof assertion === 'function') {
        run = (await session({
          $: {
            handler: assertion,
            metadata: {
              bastard: true,
              raw_output: true
            },
            parent: action,
            config: action.config,
            error: error,
            output: output
          }
        }));
        if (typeof run !== 'boolean') {
          throw utils.error('NIKITA_ASSERTION_INVALID_OUTPUT', ['invalid assertion output,', 'expect a boolean value,', `got ${JSON.stringify(run)}.`]);
        }
      } else {
        run = utils.object.match(output, assertion);
      }
      if (run === true) {
        final_run = false;
      }
    }
    return final_run;
  }
};
