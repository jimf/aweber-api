var test = require('tape')
var Aweber = require('../..')

test('ctor: missing required args', function (t) {
  t.throws(Aweber.bind(null), 'throws if missing consumer key arg')
  t.throws(Aweber.bind(null, 'dummy-consumer-key'), 'throws if missing consumer secret arg')
  t.end()
})

test('ctor: missing options object', function (t) {
  t.doesNotThrow(Aweber.bind(null, 'dummy-consumer-key', 'dummy-consumer-secret'), 'does not throw')
  t.end()
})
