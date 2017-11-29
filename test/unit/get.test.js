var test = require('tape')
var testRequest = require('./util').testRequest

test('Aweber#get: success', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'get',
    respondWith: [200, { success: true }],
    expected: {
      headers: {
        accept: 'application/json',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: { success: true },
      resolve: true
    }
  })
})

test('Aweber#get: failure', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'get',
    respondWith: [400, { error: {} }],
    expected: {
      headers: {
        accept: 'application/json',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: { error: {} },
      resolve: false
    }
  })
})

test('Aweber#get: exception', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'get',
    respondWith: 'ECONNREFUSED',
    expected: {
      headers: {
        accept: 'application/json',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: new Error('ECONNREFUSED'),
      resolve: false
    }
  })
})
