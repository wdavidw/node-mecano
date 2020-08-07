// Generated by CoffeeScript 2.5.1
module.exports = function() {
  return {
    module: '@nikitajs/engine/src/plugins/history',
    hooks: {
      'nikita:session:normalize': function(action, handler) {
        return function() {
          action = handler.call(null, ...arguments);
          action.children = [];
          if (action.parent) {
            action.siblings = action.parent.children;
          }
          if (action.parent) {
            action.sibling = action.siblings.slice(-1)[0];
          }
          return action;
        };
      },
      'nikita:session:result': function({action, error, output}) {
        if (!action.parent) {
          return;
        }
        return action.parent.children.push({
          children: action.children,
          metadata: action.metadata,
          config: action.config,
          error: error,
          output: output
        });
      }
    }
  };
};
