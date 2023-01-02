
path = require 'path'
{shell} = require 'shell'
nikita = require '@nikitajs/core'
require '@nikitajs/log/lib/register'
require '@nikitajs/lxd/lib/register'

module.exports = (config) ->
  shell
    name: 'nikita-test-runner'
    description: '''
    Execute test inside the LXD environment.
    '''
    options:
      container:
        default: "#{config.container}"
        description: '''
        Name of the container.
        '''
        required: !config.container
      cwd:
        default: "#{config.cwd}"
        description: '''
        Absolute path inside the container to use as the working directory.
        '''
        required: !config.cwd
      debug:
        default: false
        type: 'boolean'
        description: '''
        Instantiate the Nikita session in debug mode.
        '''
      logdir:
        default: "#{config.logdir}"
        description: '''
        Directory were to store the logs.
        '''
    commands:
      'delete':
        description: '''
        Delete a container container.
        '''
        options:
          force:
            type: 'boolean'
            shortcut: 'f'
            description: '''
            Force the container removal even if it is started.
            '''
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'delete.md'
          .call '@nikitajs/lxd-runner/lib/actions/delete', {...config, ...params}
      'enter':
        description: '''
        Open a prompt running inside the container.
        '''
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'enter.md'
          .call '@nikitajs/lxd-runner/lib/actions/enter', {...config, ...params}
      'exec':
        description: '''
        Execute a command inside the container console.
        '''
        main: 'cmd'
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'exec.md'
          .call '@nikitajs/lxd-runner/lib/actions/exec', {...config, ...params}
      'state':
        description: '''
        Print machine state and information.
        '''
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'exec.md'
          .call '@nikitajs/lxd-runner/lib/actions/state', {...config, ...params}
      'run':
        description: '''
        Start and stop the container and execute all the tests.
        '''
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'run.md'
          .call '@nikitajs/lxd-runner/lib/actions/run', {...config, ...params}
      'start':
        description: '''
        Start the container.
        '''
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'start.md'
          .call '@nikitajs/lxd-runner/lib/actions/start', {...config, ...params}
      'stop':
        description: '''
        Stop the container.
        '''
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'stop.md'
          .call '@nikitajs/lxd-runner/lib/actions/stop', {...config, ...params}
      'test':
        description: '''
        Execute all the tests, does not start and stop the containers, see `run`.
        '''
        handler: ({params}) ->
          nikita
            $debug: params.debug
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'test.md'
          .call '@nikitajs/lxd-runner/lib/actions/test', {...config, ...params}
  .route()
