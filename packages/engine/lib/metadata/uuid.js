// Generated by CoffeeScript 2.5.1
var uuid;

({
  v4: uuid
} = require('uuid'));

module.exports = function() {
  return {
    module: '@nikitajs/engine/src/metadata/uuid',
    hooks: {
      'nikita:session:action': {
        handler: function(action) {
          if (action.metadata.depth === 0) {
            return action.metadata.uuid = uuid();
          } else {
            return action.metadata.uuid = action.parent.metadata.uuid;
          }
        }
      }
    }
  };
};
