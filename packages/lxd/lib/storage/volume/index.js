// Generated by CoffeeScript 2.7.0
// # `nikita.lxc.storage.volume`

// Create a new storage volume in the selected pool.

// ## Output parameters

// * `$status`
//   True if the volume was created.

// ## Example

// ```js
// const {$status} = await @lxc.storage({
//   pool = 'default',
//   name = 'test',
// })
// console.info(`The pool creation was correctly made: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'pool': {
        type: 'string',
        description: `Name of the storage pool to create the volume in.`
      },
      'name': {
        type: 'string',
        description: `Name of the storage volume to create.`
      },
      'type': {
        enum: ["custom"],
        default: "custom",
        description: `Type of the storage volume to create.`
      },
      'properties': {
        type: 'object',
        patternProperties: {
          '': {
            type: ['string', 'boolean', 'number']
          }
        },
        description: `Configuration to use to configure this storage volume. `
      },
      'content': {
        enum: ["filesystem", "block"],
        default: "filesystem",
        description: `Type of content to create in the storage volume.
Filesystem is for containers and block is for virtual machines.`
      },
      'description': {
        type: 'string',
        description: `Description of the storage volume.`
      }
    },
    required: ['name', 'pool', 'type']
  }
};

// ## Handler
handler = async function({config}) {
  var $status, parameters;
  parameters = JSON.stringify({
    name: config.name,
    config: config.properties != null ? config.properties : {},
    content_type: config.content != null ? config.content : null,
    description: config.description != null ? config.description : null
  });
  ({$status} = (await this.lxc.query({
    path: `/1.0/storage-pools/${config.pool}/volumes/${config.type}`,
    request: "POST",
    data: parameters,
    format: 'string',
    code: [0, 1]
  })));
  return {
    $status: $status
  };
};


// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions,
    shy: true
  }
};
