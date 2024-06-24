
import nikita from '@nikitajs/core'
import utils from '@nikitajs/core/utils'
import test from '../../../test.coffee'
import mochaThey from 'mocha-they'
they = mochaThey(test.config)


describe 'actions.fs.rename', ->
  return unless test.tags.posix

  they 'create', ({ssh}) ->
    nikita
      $ssh: ssh
      $templated: true
      $tmpdir: true
    , ->
      await @fs.writeFile
        target: "{{parent.metadata.tmpdir}}/a_source"
        content: 'hello'
      await @fs.rename
        source: "{{parent.metadata.tmpdir}}/a_source"
        target: "{{parent.metadata.tmpdir}}/a_target"
      {stats} = await @fs.stat
        target: "{{parent.metadata.tmpdir}}/a_target"
      utils.stats.isFile(stats.mode).should.be.true()
