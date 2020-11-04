
# registration of `nikita.service` actions

require '@nikitajs/file/src/register'
registry = require '@nikitajs/engine/src/registry'

module.exports =
  service:
    '': '@nikitajs/service/src'
    assert: '@nikitajs/service/src/assert'
    discover: '@nikitajs/service/src/discover'
    install: '@nikitajs/service/src/install'
    init: '@nikitajs/service/src/init'
    remove: '@nikitajs/service/src/remove'
    restart: '@nikitajs/service/src/restart'
    start: '@nikitajs/service/src/start'
    startup: '@nikitajs/service/src/startup'
    status: '@nikitajs/service/src/status'
    stop: '@nikitajs/service/src/stop'
(->
  await registry.register module.exports
)()
