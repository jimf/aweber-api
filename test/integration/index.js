#!/usr/bin/env node

var util = require('util')
var test = require('tape')
var Aweber = require('../..')

var key = process.env.CONSUMER_KEY
var secret = process.env.CONSUMER_SECRET
var token = process.env.TOKEN
var tokenSecret = process.env.TOKEN_SECRET
var accountId = process.env.ACCOUNT_ID
var listId = process.env.LIST_ID

if (!(key && secret && token && tokenSecret && accountId && listId)) {
  // TAP output for early failure (https://testanything.org/tap-version-13-specification.html)
  console.log('Bail out! Missing one or more required env vars: CONSUMER_KEY, CONSUMER_SECRET, TOKEN, TOKEN_SECRET, ACCOUNT_ID, LIST_ID')
}

var aw = Aweber(key, secret, { token: token, tokenSecret: tokenSecret })

test('custom_fields', function (t) {
  var collectionUrl = '/1.0/accounts/' + accountId + '/lists/' + listId + '/custom_fields'
  var field = 'dummy' + (new Date()).getTime()

  aw.get(collectionUrl)
    .then(function (data) {
      t.ok(!!data.entries, 'can GET custom fields collection')
      return aw.post(collectionUrl, {
        data: {
          'ws.op': 'create',
          name: field
        }
      })
    })
    .then(function (data) {
      t.ok(!!data.link, 'can POST a new custom field')
      return aw.patch(data.link, {
        data: {
          name: 'new' + field
        }
      })
    })
    .then(function (data) {
      t.equal(data.name, 'new' + field, 'can PATCH a custom field')
      return aw.del(data.self_link, {
        params: {
          'ws.op': 'delete'
        }
      })
    })
    .then(function (data) {
      t.ok(data.success, 'can DELETE a custom field')
      t.end()
    })
    .catch(function (err) {
      t.fail(util.inspect(err, { depth: 3 }))
      t.end()
    })
})
