// Generated by CoffeeScript 2.6.1
// # `nikita.fs.base.symlink`

// Delete a name and possibly the file it refers to.

// ## Schema definitions
var definitions, escapeshellarg, handler, utils;

definitions = {
  config: {
    type: 'object',
    properties: {
      'source': {
        oneOf: [
          {
            type: 'string'
          },
          {
            instanceof: 'Buffer'
          }
        ],
        description: `Location of the file to reference.`
      },
      'target': {
        oneOf: [
          {
            type: 'string'
          },
          {
            instanceof: 'Buffer'
          }
        ],
        description: `Destination of the link to create.`
      }
    },
    required: ['source', 'target']
  }
};

// ## Handler
handler = async function({config}) {
  return (await this.execute({
    command: `ln -sf ${escapeshellarg(config.source)} ${escapeshellarg(config.target)}`
  }));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    argument_to_config: 'target',
    log: false,
    raw_output: true,
    definitions: definitions
  }
};

// ## Dependencies
utils = require('../../../utils');

({escapeshellarg} = utils.string);
