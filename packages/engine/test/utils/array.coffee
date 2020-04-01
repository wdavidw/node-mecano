
{multiply} = require '../../src/utils/array'

describe 'utils array', ->
  
  it 'object with object', ->
    multiply {a: ''}, {b: ''}
    .should.eql [
      [{a: ''}, {b: ''}]
    ]

  it 'object with [object]', ->
    multiply {a: 1}, [{b: 2}, {c: 3}]
    .should.eql [
      [ { a: 1 }, { b: 2 } ]
      [ { a: 1 }, { c: 3 } ]
    ]
      
  it 'string and [object]', ->
    multiply 'a', [{b: ''}, {c: ''}], 'd'
    .should.eql [
      ['a', {b: ''}, 'd'],
      ['a', {c: ''}, 'd']
    ]
      
  it '[object] with [object]', ->
    multiply [{a: ''}, {b: ''}], [{c: ''}, {d: ''}]
    .should.eql [
      [{a: ''}, {c: ''}],
      [{b: ''}, {c: ''}],
      [{a: ''}, {d: ''}],
      [{b: ''}, {d: ''}]
    ]

  it 'null with [object]', ->
    multiply null, [{b: 2}, {c: 3}]
    .should.eql [
      [ null, { b: 2 } ]
      [ null, { c: 3 } ]
    ]
