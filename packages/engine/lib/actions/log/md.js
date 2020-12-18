// Generated by CoffeeScript 2.5.1
// # `nikita.log.md`

// Write log to the host filesystem in Markdown.

// ## Hook
var handler, log_fs, on_action, schema;

on_action = function({config}) {
  return config.serializer = {};
};

// ## Schema
schema = {
  type: 'object',
  allOf: [
    {
      $ref: 'module://@nikitajs/engine/src/actions/log/fs',
      properties: {
        divider: {
          type: 'string',
          default: ' : ',
          description: `The characters used to join the hierarchy of headers to create a
markdown header.`
        }
      }
    }
  ]
};

// ## Handler
handler = function({config}) {
  var state;
  state = {
    last_event_type: void 0
  };
  return this.call(log_fs, {
    config: config,
    serializer: {
      'nikita:action:start': function(action) {
        var header, headers, last_event_type, walk;
        if (!action.metadata.header) {
          return;
        }
        ({last_event_type} = state);
        state.last_event_type = 'nikita:action:start';
        walk = function(parent) {
          var precious, results;
          precious = parent.metadata.header;
          results = [];
          if (precious !== void 0) {
            results.push(precious);
          }
          if (parent.parent) {
            results.push(...(walk(parent.parent)));
          }
          return results;
        };
        headers = walk(action);
        // Async operation break the event order, causing header to be writen
        // after other sync event such as text
        // headers = await act.tools.walk ({config}) ->
        //   config.header
        header = headers.reverse().join(config.divider);
        return [last_event_type !== 'nikita:action:start' ? '\n' : void 0, '#'.repeat(headers.length), ' ', header, '\n\n'].join('');
      },
      // 'diff': (log) ->
      //   "\n```diff\n#{log.message}```\n\n" unless log.message
      // 'end': ->
      //   '\nFINISHED WITH SUCCESS\n'
      // 'error': (err) ->
      //   content = []
      //   content.push '\nFINISHED WITH ERROR\n'
      //   print = (err) ->
      //     content.push err.stack or err.message + '\n'
      //   unless err.errors
      //     print err
      //   else if err.errors
      //     content.push err.message + '\n'
      //     for error in err.errors then content.push error
      //   content.join ''
      // 'header': (log, act) ->
      //   header = log.metadata.headers.join(action.config.divider)
      //   "\n#{'#'.repeat log.metadata.headers.length} #{header}\n\n"
      'stdin': function(log) {
        var out;
        out = [];
        if (log.message.indexOf('\n') === -1) {
          out.push(`\nRunning Command: \`${log.message}\`\n\n`);
        } else {
          out.push(`\n\`\`\`stdin\n${log.message}\n\`\`\`\n\n`);
        }
        // stdining = log.message isnt null
        return out.join('');
      },
      'stderr': function(log) {
        return `\n\`\`\`stderr\n${log.message}\`\`\`\n\n`;
      },
      'stdout_stream': function(log) {
        var out;
        state.last_event_type = 'stdout_stream';
        // return if log.message is null and stdouting is 0
        if (log.message === null) {
          state.stdout_count = 0;
        } else if (state.stdout_count === void 0) {
          state.stdout_count = 1;
        } else {
          state.stdout_count++;
        }
        out = [];
        if (state.stdout_count === 1) {
          out.push('\n```stdout\n');
        }
        if (state.stdout_count > 0) {
          out.push(log.message);
        }
        if (state.stdout_count === 0) {
          out.push('\n```\n\n');
        }
        return out.join('');
      },
      'text': function(log) {
        var content;
        state.last_event_type = 'text';
        content = [];
        content.push(`${log.message}`);
        if (log.module) {
          content.push(` (${log.depth}.${log.level}, written by ${log.module})`);
        }
        content.push("\n");
        return content.join('');
      }
    }
  });
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    schema: schema
  },
  ssh: false
};

// ## Dependencies
log_fs = require('./fs');
