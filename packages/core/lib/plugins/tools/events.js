/*
# Plugin `@nikitajs/core/plugins/tools/event`

Expose the event object which implement the Node.js EventEmitter API. The event
object is inhereted from parent actions and cascaded to children.
*/
import { EventEmitter } from "events";

export default {
  name: "@nikitajs/core/plugins/tools/events",
  hooks: {
    "nikita:normalize": function (action) {
      if (action.tools == null) {
        action.tools = {};
      }
      action.tools.events = action.parent
        ? action.parent.tools.events
        : new EventEmitter();
    },
    "nikita:action": function (action) {
      action.tools.events.emit("nikita:action:start", {
        action: action,
      });
    },
    "nikita:result": {
      after: "@nikitajs/core/plugins/output/status",
      handler: function ({ output }, handler) {
        return async function ({ action }) {
          try {
            output = await handler.apply(null, arguments);
            action.tools.events.emit("nikita:action:end", {
              action: action,
              error: undefined,
              output: output,
            });
            return output;
          } catch (error) {
            action.tools.events.emit("nikita:action:end", {
              action: action,
              error: error,
              output: undefined,
            });
            throw error;
          }
        };
      },
    },
    "nikita:resolved": function ({ action }) {
      action.tools.events.emit("nikita:resolved", ...arguments);
    },
    "nikita:rejected": function ({ action }) {
      action.tools.events.emit("nikita:rejected", ...arguments);
    },
  },
};
