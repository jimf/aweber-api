var crypto = require('crypto')
var qs = require('querystring')
var url = require('url')
var OAuth = require('oauth-1.0a')
var get = require('simple-get')

function Aweber (key, secret, opts) {
  if (!key || !secret) {
    throw new Error('Consumer key and secret required')
  }

  opts = opts || {}
  var token = opts.token || null
  var tokenSecret = opts.tokenSecret || null
  var userAgent = opts.userAgent || 'aweber-api (https://github.com/jimf/aweber-api)'
  var PromiseCtor = opts.Promise || Promise
  var oauth = OAuth({
    consumer: {
      key: key,
      secret: secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function (baseString, k) {
      return crypto.createHmac('sha1', k).update(baseString).digest('base64')
    }
  })

  function signedRequest (opts, cb) {
    return new PromiseCtor(function (resolve, reject) {
      var signedData = oauth.authorize({
        url: opts.url,
        method: opts.method,
        data: opts.params
      }, token !== null ? { token: token, secret: tokenSecret } : undefined)
      delete opts.params
      opts.headers = opts.headers || {}
      opts.headers['user-agent'] = userAgent
      opts.url = opts.url + '?' + qs.stringify(signedData)
      get.concat(opts, cb(resolve, reject))
    })
  }

  function createBufferCallback (resolve, reject) {
    return function (err, res, data) {
      if (err) {
        reject(err)
      } else if (res.statusCode >= 400) {
        reject(JSON.parse(data.toString()))
      } else {
        resolve(data.toString())
      }
    }
  }

  function getRequestToken (callback) {
    token = ''
    return signedRequest({
      url: 'https://auth.aweber.com/1.0/oauth/request_token',
      method: 'POST',
      params: {
        oauth_callback: callback,
        oauth_token: token
      }
    }, createBufferCallback)
  }

  function getAccessToken (verifier) {
    return signedRequest({
      url: 'https://auth.aweber.com/1.0/oauth/access_token',
      method: 'POST',
      params: {
        oauth_verifier: verifier,
        oauth_token: token
      }
    }, createBufferCallback)
  }

  function request (method) {
    return function (urlRaw, options) {
      options = options || {}
      var parsedUrl = url.parse(urlRaw)
      var baseUrl = url.format({
        protocol: 'https:',
        host: 'api.aweber.com',
        pathname: parsedUrl.pathname
      })
      var requestOpts = {
        url: baseUrl,
        method: method,
        headers: {
          accept: 'application/json'
        },
        params: Object.assign(
          {},
          qs.parse(parsedUrl.query),
          method === 'POST' ? options.data : null,
          options.params,
          { oauth_token: token }
        )
      }

      if (method === 'POST') {
        requestOpts.form = options.data
      } else {
        requestOpts.body = options.data
        requestOpts.json = true
      }

      return signedRequest(requestOpts, function (resolve, reject) {
        return function (err, res, data) {
          if (err) {
            reject(err)
            return
          } else if (res.statusCode === 201) {
            resolve({ link: res.headers.location })
            return
          }
          data = requestOpts.form ? JSON.parse(data.toString()) : data
          if (res.statusCode >= 400) {
            reject(data)
          } else {
            resolve(data || { success: true })
          }
        }
      })
    }
  }

  return {
    getAuthorizationUrl: function (callbackUrl) {
      return getRequestToken(callbackUrl || 'oob').then(function (resp) {
        var parsed = qs.parse(resp)
        token = parsed.oauth_token
        tokenSecret = parsed.oauth_token_secret
        return 'https://auth.aweber.com/1.0/oauth/authorize?oauth_token=' + token
      })
    },
    getAccessToken: function (verifier) {
      return getAccessToken(verifier).then(function (resp) {
        var parsed = qs.parse(resp)
        token = parsed.oauth_token
        tokenSecret = parsed.oauth_token_secret
        return { token: token, tokenSecret: tokenSecret }
      })
    },
    del: request('DELETE'),
    get: request('GET'),
    patch: request('PATCH'),
    post: request('POST'),
    put: request('PUT')
  }
}

module.exports = Aweber
