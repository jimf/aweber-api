var test = require('tape')
var testRequest = require('./util').testRequest

test('Aweber#del: success', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy/1',
    method: 'delete',
    options: {
      params: {
        'ws.op': 'delete'
      }
    },
    params: {
      'ws.op': 'delete'
    },
    respondWith: [200, 'null'],
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

test('Aweber#del: failure', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy/1',
    method: 'delete',
    options: {
      params: {
        'ws.op': 'delete'
      }
    },
    params: {
      'ws.op': 'delete'
    },
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

test('Aweber#del: exception', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy/1',
    method: 'delete',
    options: {
      params: {
        'ws.op': 'delete'
      }
    },
    params: {
      'ws.op': 'delete'
    },
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
