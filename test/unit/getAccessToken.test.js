var qs = require('querystring')
var test = require('tape')
var nock = require('nock')
var Aweber = require('../..')

function setup () {
  var mockRequest = nock('https://auth.aweber.com', {
    reqheaders: {
      'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
    }
  })
    .post('/1.0/oauth/access_token')
    .query({
      oauth_consumer_key: 'consumer-key',
      oauth_nonce: /[A-Za-z0-9]+/,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: /\d+/,
      oauth_version: '1.0',
      oauth_token: 'dummy-token',
      oauth_signature: /.+/,
      oauth_verifier: 'dummy-verifier'
    })
  var aw = Aweber('consumer-key', 'consumer-secret', { token: 'dummy-token' })
  return { mockRequest: mockRequest, aw: aw }
}

test('Aweber#getAccessToken: success', function (t) {
  var testcase = setup()
  testcase.mockRequest.reply(200, Buffer.from(qs.stringify({
    oauth_token: 'new-token',
    oauth_token_secret: 'new-token-secret'
  })))
  testcase.aw.getAccessToken('dummy-verifier').then(function (result) {
    t.deepEqual(result, { token: 'new-token', tokenSecret: 'new-token-secret' },
      'resolves with new token values')
    t.end()
  }).catch(function (err) {
    t.fail(err, 'resolves with new token values')
    t.end()
  })
})

test('Aweber#getAccessToken: failure', function (t) {
  var testcase = setup()
  testcase.mockRequest.reply(400, Buffer.from(JSON.stringify({ error: {} })))
  testcase.aw.getAccessToken('dummy-verifier').then(function (result) {
    t.fail(result, 'rejects with error response')
    t.end()
  }).catch(function (err) {
    t.deepEqual(err, { error: {} }, 'rejects with error response')
    t.end()
  })
})

test('Aweber#getAccessToken: exception', function (t) {
  var testcase = setup()
  testcase.mockRequest.replyWithError('ECONNREFUSED')
  testcase.aw.getAccessToken('dummy-verifier').then(function (result) {
    t.fail(result, 'rejects with error')
    t.end()
  }).catch(function (err) {
    t.deepEqual(err, new Error('ECONNREFUSED'), 'rejects with error')
    t.end()
  })
})
