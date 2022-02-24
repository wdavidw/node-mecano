
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
      logdir:
        default: "#{config.logdir}"
        description: '''
        Directory were to store the logs.
        '''
    commands:
      'enter':
        description: '''
        Open a prompt running inside the container.
        '''
        handler: ({params}) ->
          nikita
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'enter.md'
          .execute
            $header: 'Container enter'
            command: """
            lxc exec \
              --cwd #{params.cwd} \
              #{params.container} -- bash
            """
            stdio: ['inherit', 'inherit', 'inherit']
            stdin: process.stdin
            stdout: process.stdout
            stderr: process.stderr
      'exec':
        description: '''
        Execute a command inside the container console.
        '''
        main: 'cmd'
        handler: ({params}) ->
          nikita
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'exec.md'
          .execute
            $header: 'Container exec'
            command: """
            lxc exec \
              --cwd #{params.cwd} \
              #{params.container} -- #{params.cmd}
            """
            stdio: ['inherit', 'inherit', 'inherit']
            stdin: process.stdin
            stdout: process.stdout
            stderr: process.stderr
      'run':
        description: '''
        Start and stop the container and execute all the tests.
        '''
        handler: ({params}) ->
          nikita
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'run.md'
          .call '@nikitajs/lxd-runner/lib/actions/run', {...config, ...params}
      'start':
        description: '''
        Start the container.
        '''
        handler: ({params}) ->
          nikita
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'start.md'
          .call '@nikitajs/lxd-runner/lib/actions/start', {...config, ...params}
      'stop':
        description: '''
        Stop the container.
        '''
        handler: ({params}) ->
          nikita
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'stop.md'
          .call '@nikitajs/lxd-runner/lib/actions/stop', {...config, ...params}
      'test':
        description: '''
        Execute all the tests, does not start and stop the containers, see `run`.
        '''
        handler: ({params}) ->
          nikita
          .log.cli pad: host: 20, header: 60
          .log.md filename: path.resolve params.logdir, 'test.md'
          .call '@nikitajs/lxd-runner/lib/actions/test', {...config, ...params}
  .route()
