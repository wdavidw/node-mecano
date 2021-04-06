// Generated by CoffeeScript 2.5.1
// # `nikita.lxc.network.detach`

// Detach a network from a container.

// ## Output

// * `$status`
//   True if the network was detached

// ## Example

// ```js
// const {$status} = await nikita.lxc.network.detach({
//   network: 'network0',
//   container: 'container1'
// })
// console.info(`Network was detached: ${$status}`)
// ```

// ## Schema
var handler, schema;

schema = {
  config: {
    type: 'object',
    properties: {
      'network': {
        type: 'string',
        description: `The network name to detach.`
      },
      'container': {
        $ref: 'module://@nikitajs/lxd/lib/init#/definitions/config/properties/container'
      }
    },
    required: ['network', 'container']
  }
};

// ## Handler
handler = async function({config}) {
  //Execute
  return (await this.execute({
    command: `lxc config device list ${config.container} | grep ${config.network} || exit 42
${['lxc', 'network', 'detach', config.network, config.container].join(' ')}`,
    code_skipped: 42
  }));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    schema: schema
  }
};
