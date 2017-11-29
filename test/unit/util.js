var nock = require('nock')
var Aweber = require('../..')

exports.testRequest = function testRequest (t, opts) {
  var isErrorResponse = false
  var mockRequest = nock('https://api.aweber.com', { reqheaders: opts.expected.headers })[opts.method](opts.endpoint, opts.method !== 'get' ? opts.data : undefined)
    .query(Object.assign({
      oauth_consumer_key: 'consumer-key',
      oauth_nonce: /[A-Za-z0-9]+/,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: /\d+/,
      oauth_version: '1.0',
      oauth_token: 'token',
      oauth_signature: /.+/
    }, opts.params))
  if (typeof opts.respondWith === 'string' && opts.respondWith[0] === 'E') {
    isErrorResponse = true
    mockRequest.replyWithError(opts.respondWith)
  } else {
    mockRequest.reply.apply(mockRequest, opts.respondWith)
  }
  var aw = Aweber('consumer-key', 'consumer-secret', {
    token: 'token',
    tokenSecret: 'token-secret'
  })
  aw[opts.method === 'delete' ? 'del' : opts.method](opts.endpoint, opts.options).then(function (res) {
    if (opts.expected.resolve) {
      t.deepEqual(res, opts.expected.response, 'resolves with API response')
    } else {
      t.fail('rejects with API response')
    }
    t.end()
  }).catch(function (err) {
    if (opts.expected.resolve) {
      t.fail(err, 'resolves with API response')
    } else {
      t.deepEqual(err, opts.expected.response, 'rejects with ' + (isErrorResponse ? 'error' : 'API response'))
    }
    t.end()
  })
}
