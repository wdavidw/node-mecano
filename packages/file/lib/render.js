// Generated by CoffeeScript 2.5.1
// # `nikita.file.render`

// Render a template file. More templating engine could be added on demand. The
// following templating engines are integrated:

// * [Handlebars](https://handlebarsjs.com/)

// If target is a callback, it will be called with the generated content as
// its first argument.   

// ## Output

// * `$status`   
//   Value is true if rendered file was created or modified.

// ## Rendering with Handlebar

// ```js
// const {$status} = await nikita.file.render({
//   source: './some/a_template.hbs',
//   target: '/tmp/a_file',
//   context: {
//     username: 'a_user'
//   }
// })
// console.info(`File was rendered: ${$status}`)
// ```

// ## Hooks
var handlebars, handler, on_action, path, schema;

on_action = function({config}) {
  var extension;
  // Validate parameters
  if (config.encoding == null) {
    config.encoding = 'utf8';
  }
  if (!(config.source || config.content)) {
    throw Error('Required option: source or content');
  }
  // Extension
  if (!config.engine && config.source) {
    extension = path.extname(config.source);
    switch (extension) {
      case '.hbs':
        return config.engine = 'handlebars';
      default:
        throw Error(`Invalid Option: extension '${extension}' is not supported`);
    }
  }
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'content': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/content'
    },
    'context': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/context'
    },
    'engine': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/engine'
    },
    'gid': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/gid'
    },
    'mode': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/mode'
    },
    'local': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/local'
    },
    'remove_empty_lines': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/remove_empty_lines'
    },
    'source': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/source'
    },
    'target': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/target'
    },
    'uid': {
      $ref: 'module://@nikitajs/file/lib/index#/properties/uid'
    }
  },
  required: ['target', 'context']
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var data;
  // Read source
  if (config.source) {
    ({data} = (await this.fs.base.readFile({
      $ssh: config.local ? false : void 0,
      $sudo: config.local ? false : void 0,
      target: config.source,
      encoding: config.encoding
    })));
    if (data != null) {
      config.source = void 0;
      config.content = data;
    }
  }
  log({
    message: `Rendering with ${config.engine}`,
    level: 'DEBUG'
  });
  config.transform = function({config}) {
    var template;
    template = handlebars.compile(config.content.toString());
    return template(config.context);
  };
  await this.file(config);
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    schema: schema
  }
};

// ## Dependencies
path = require('path');

handlebars = require('handlebars');
