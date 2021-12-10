// Generated by CoffeeScript 2.6.1
// # `nikita.file.yaml`

// Write an object serialized in YAML format. Note, we are internally using the [js-yaml] module.
// However, there is a subtile difference. Any key provided with value of
// `undefined` or `null` will be disregarded. Within a `merge`, it get more
// prowerfull and tricky: the original value will be kept if `undefined` is
// provided while the value will be removed if `null` is provided.

// The `file.yaml` function rely on the `file` function and accept all of its
// configuration. It introduces the `merge` option which instruct to read the
// target file if it exists and merge its parsed object with the one
// provided in the `content` option.

// ## Output

// * `$status`   
//   Indicate modifications in the target file.

// ## Example

// ```js
// const {$status} = await nikita.file.yaml({
//   content: {
//     'my_key': 'my value'
//   },
//   target: '/tmp/my_file'
// })
// console.info(`Content was written: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler, merge, utils, yaml;

definitions = {
  config: {
    type: 'object',
    properties: {
      'append': {
        type: 'boolean',
        default: false,
        description: `Append the content to the target file. If target does not exist, the
file will be created. When used with the \`match\` and \`replace\` config,
it will append the \`replace\` value at the end of the file if no match
if found and if the value is a string.`
      },
      'backup': {
        type: ['boolean', 'string'],
        default: false,
        description: `Create a backup, append a provided string to the filename extension or
a timestamp if value is not a string, only apply if the target file
exists and is modified.`
      },
      'clean': {
        type: 'boolean',
        default: true,
        description: `Remove all \`null\` and \`undefined\` values.`
      },
      'content': {
        type: 'object',
        description: `The javascript code to stringify.`
      },
      'from': {
        type: 'string',
        description: `Replace from after this marker, a string or a regular expression.`
      },
      'gid': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/gid'
      },
      'indent': {
        type: 'integer',
        default: 2,
        description: `Number of space used for indentation. Default to 2.`
      },
      'line_width': {
        type: 'integer',
        default: 160,
        description: `Number of max character before a new line is written. Default to 160.`
      },
      'local': {
        type: 'boolean',
        default: false,
        description: `Treat the source as local instead of remote, only apply with "ssh"
option.`
      },
      'match': {
        oneOf: [
          {
            type: 'string'
          },
          {
            instanceof: 'RegExp'
          }
        ],
        description: `Replace this marker, default to the replaced string if missing.`
      },
      'merge': {
        type: 'boolean',
        default: false,
        description: `Read the target if it exists and merge its content.`
      },
      'mode': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/mode'
      },
      'replace': {
        type: 'array',
        items: {
          type: 'string'
        },
        description: `The content to be inserted, used conjointly with the from, to or match
options.`
      },
      'source': {
        type: 'string',
        description: `File path from where to extract the content, do not use conjointly
with content.`
      },
      'ssh': {
        type: 'object',
        description: `Run the action on a remote server using SSH, an ssh2 instance or an
configuration object used to initialize the SSH connection.`
      },
      'stdout': {
        // instanceof: 'Writable'
        description: `Writable EventEmitter in which the standard output of executed
commands will be piped.`
      },
      'stderr': {
        // instanceof: 'Writable'
        description: `Writable EventEmitter in which the standard error output of executed
command will be piped.`
      },
      'target': {
        oneOf: [
          {
            type: 'string'
          },
          {
            typeof: 'function'
          }
        ],
        description: `File path where to write content to. Pass the content.`
      },
      'to': {
        oneOf: [
          {
            type: 'string'
          },
          {
            instanceof: 'RegExp'
          }
        ],
        description: `Replace to before this marker, a string or a regular expression.`
      },
      'uid': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/uid'
      }
    },
    required: ['content', 'target']
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var data, err;
  try {
    // Start real work
    if (config.merge) {
      ({data} = (await this.fs.base.readFile({
        target: config.target,
        encoding: 'utf8'
      })));
      data = yaml.load(data);
      config.content = merge(data, config.content);
    }
  } catch (error) {
    err = error;
    if (err.code !== 'NIKITA_FS_CRS_TARGET_ENOENT') {
      throw err;
    }
  }
  if (config.clean) {
    log({
      message: "Clean content",
      level: 'INFO'
    });
    // console.info JSON.stringify config.content, null, true
    utils.object.clean(config.content);
  }
  log({
    message: "Serialize content",
    level: 'DEBUG'
  });
  config.content = yaml.dump(config.content, {
    noRefs: true,
    lineWidth: config.line_width
  });
  return (await this.file(config));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};

// ## Dependencies
utils = require('./utils');

yaml = require('js-yaml');

({merge} = require('mixme'));

// [js-yaml]: https://github.com/nodeca/js-yaml
