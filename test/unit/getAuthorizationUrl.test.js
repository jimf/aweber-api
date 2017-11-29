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
    .post('/1.0/oauth/request_token')
    .query({
      oauth_consumer_key: 'consumer-key',
      oauth_nonce: /[A-Za-z0-9]+/,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: /\d+/,
      oauth_version: '1.0',
      oauth_token: '',
      oauth_signature: /.+/,
      oauth_callback: 'oob'
    })
  var aw = Aweber('consumer-key', 'consumer-secret')
  return { mockRequest: mockRequest, aw: aw }
}

test('Aweber#getAuthorizationUrl: success', function (t) {
  var testcase = setup()
  testcase.mockRequest.reply(200, Buffer.from(qs.stringify({
    oauth_consumer_key: 'consumer-key',
    oauth_token: 'dummy-token',
    oauth_token_secret: 'dummy-token-secret'
  })))
  testcase.aw.getAuthorizationUrl().then(function (result) {
    t.equal(result, 'https://auth.aweber.com/1.0/oauth/authorize?oauth_token=dummy-token',
      'resolves with authorization url')
    t.end()
  }).catch(function (err) {
    t.fail(err, 'resolves with authorization url')
    t.end()
  })
})

test('Aweber#getAuthorizationUrl: failure', function (t) {
  var testcase = setup()
  testcase.mockRequest.reply(400, Buffer.from(JSON.stringify({ error: {} })))
  testcase.aw.getAuthorizationUrl().then(function (result) {
    t.fail(result, 'rejects with error response')
    t.end()
  }).catch(function (err) {
    t.deepEqual(err, { error: {} }, 'rejects with error response')
    t.end()
  })
})

test('Aweber#getAuthorizationUrl: exception', function (t) {
  var testcase = setup()
  testcase.mockRequest.replyWithError('ECONNREFUSED')
  testcase.aw.getAuthorizationUrl().then(function (result) {
    t.fail(result, 'rejects with error')
    t.end()
  }).catch(function (err) {
    t.deepEqual(err, new Error('ECONNREFUSED'), 'rejects with error')
    t.end()
  })
})
