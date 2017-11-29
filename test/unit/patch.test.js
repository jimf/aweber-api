var test = require('tape')
var testRequest = require('./util').testRequest

test('Aweber#patch: success', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy/1',
    method: 'patch',
    options: {
      data: {
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      'dummy-key': 'dummy-value'
    },
    respondWith: [200, { id: 1, 'dummy-key': 'dummy-value' }],
    expected: {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: { id: 1, 'dummy-key': 'dummy-value' },
      resolve: true
    }
  })
})

test('Aweber#patch: failure', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy/1',
    method: 'patch',
    options: {
      data: {
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      'dummy-key': 'dummy-value'
    },
    respondWith: [400, { error: {} }],
    expected: {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: { error: {} },
      resolve: false
    }
  })
})

test('Aweber#patch: exception', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy/1',
    method: 'patch',
    options: {
      data: {
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      'dummy-key': 'dummy-value'
    },
    respondWith: 'ECONNREFUSED',
    expected: {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: new Error('ECONNREFUSED'),
      resolve: false
    }
  })
})
