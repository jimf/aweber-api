var test = require('tape')
var testRequest = require('./util').testRequest

test('Aweber#put: success', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy/1',
    method: 'put',
    options: {
      data: {
        id: 1,
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      id: 1,
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

test('Aweber#put: failure', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'put',
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

test('Aweber#put: exception', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'put',
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
