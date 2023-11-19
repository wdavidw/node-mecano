
// Dependencies
import path from 'node:path';
import {mutate} from 'mixme';

// Action
export default {
  hooks: {
    on_action: async function(action) {
      if (typeof action.metadata.argument !== 'string') {
        return;
      }
      let mod = action.metadata.argument;
      // When metadata.argument is a string, consider it as the module name to load.
      if (typeof mod === 'string') {
        if (mod.startsWith('.')) {
          mod = path.resolve(process.cwd(), mod);
        }
        mod = (await import(mod)).default;
        // The loaded action can have its own interpretation of an argument.
        // In order to avoid any conflict, we simply remove the
        // `action.metadata.argument` property.
        // We shall probably also clean up the action.args array.
        action.metadata.module = action.metadata.argument;
        action.metadata.argument = undefined;
      }
      const on_action = mod.hooks?.on_action
      if (typeof mod === 'function') {
        mod = {
          handler: mod
        };
      }
      mutate(action, mod, {
        metadata: {
          module: action.metadata.argument
        }
      });
      if (on_action) {
        action = on_action.call(null, action);
      }
      return action;
    }
  }
};
