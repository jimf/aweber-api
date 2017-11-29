var test = require('tape')
var testRequest = require('./util').testRequest

test('Aweber#post: success 200', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'post',
    options: {
      data: {
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      'dummy-key': 'dummy-value'
    },
    params: {
      'dummy-key': 'dummy-value'
    },
    respondWith: [200, Buffer.from(JSON.stringify({ id: 1, 'dummy-key': 'dummy-value' }))],
    expected: {
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: { id: 1, 'dummy-key': 'dummy-value' },
      resolve: true
    }
  })
})

test('Aweber#post: success 201', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'post',
    options: {
      data: {
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      'dummy-key': 'dummy-value'
    },
    params: {
      'dummy-key': 'dummy-value'
    },
    respondWith: [201, Buffer.from(''), { Location: 'dummy-link' }],
    expected: {
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: { link: 'dummy-link' },
      resolve: true
    }
  })
})

test('Aweber#post: failure', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'post',
    options: {
      data: {
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      'dummy-key': 'dummy-value'
    },
    params: {
      'dummy-key': 'dummy-value'
    },
    respondWith: [400, Buffer.from(JSON.stringify({ error: {} }))],
    expected: {
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: { error: {} },
      resolve: false
    }
  })
})

test('Aweber#post: exception', function (t) {
  testRequest(t, {
    endpoint: '/1.0/dummy',
    method: 'post',
    options: {
      data: {
        'dummy-key': 'dummy-value'
      }
    },
    data: {
      'dummy-key': 'dummy-value'
    },
    params: {
      'dummy-key': 'dummy-value'
    },
    respondWith: 'ECONNREFUSED',
    expected: {
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'aweber-api (https://github.com/jimf/aweber-api)'
      },
      response: new Error('ECONNREFUSED'),
      resolve: false
    }
  })
})
