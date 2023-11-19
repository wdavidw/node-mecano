
import exec from 'ssh2-exec/promises'
import nikita from '@nikitajs/core'
import test from '../../../test.coffee'
import mochaThey from 'mocha-they'
they = mochaThey(test.config)

describe 'actions.fs.base.createReadStream.sudo', ->
  return unless test.tags.sudo

  they 'read file', ({ssh}) ->
    nikita
      $ssh: ssh
      $tmpdir: true
      $sudo: true
    , ({metadata: {tmpdir}, ssh}) ->
      await exec ssh, """
      echo -n 'hello' | sudo tee #{tmpdir}/a_file
      """
      buffers = []
      await @fs.base.createReadStream
        stream: (rs) ->
          rs.on 'readable', ->
            while buffer = rs.read()
              buffers.push buffer
        target: "#{tmpdir}/a_file"
      Buffer.concat(buffers).toString().should.eql 'hello'

  they 'NIKITA_FS_CRS_TARGET_ENOENT if file does not exist', ({ssh}) ->
    nikita
      $ssh: ssh
      $tmpdir: true
      $sudo: true
    , ({metadata: {tmpdir}}) ->
      @fs.base.createReadStream
        target: "#{tmpdir}/a_file"
        stream: (rs) ->
          rs.on 'readable', ->
            while buffer = rs.read()
              buffers.push buffer
      .should.be.rejectedWith
        message: /^NIKITA_FS_CRS_TARGET_ENOENT: fail to read a file because it does not exist, location is "\/tmp\/.*" \(temporary file, target is "\/tmp\/.*"\)./
        errno: -2
        code: 'NIKITA_FS_CRS_TARGET_ENOENT'
        syscall: 'open'
        path: /^\/tmp\//
    
