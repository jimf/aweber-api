# aweber-api

Minimal higher-level wrapper around [AWeber's API](https://labs.aweber.com/)
for Node.js.

[![npm Version][npm-badge]][npm]
[![Build Status][build-badge]][build-status]
[![Test Coverage][coverage-badge]][coverage-result]
[![Dependency Status][dep-badge]][dep-status]

__Features__

- Promise-based
- Minimal
- Resilient to upstream changes to the AWeber API

## Installation

Install using [npm][]:

    $ npm install aweber-api --save


## Getting Started

1. In order to use the AWeber API, you will first need to register for a
   [free developer account](https://labs.aweber.com/).
2. Once you have an account, log in and create an app, making note of your
   consumer key and secret.

With a consumer key and secret, you are now ready to authenticate your app and
verify one or more accounts. We'll start by verifying a single account.  Open a
Node.js console session:

```
$ node
> Aweber = require('aweber-api')
[Function: Aweber]
> aw = Aweber('your-consumer-key', 'your-consumer-secret')
> aw.getAuthorizationUrl().then(console.log).catch(console.log)
Promise { <pending> }
> https://auth.aweber.com/1.0/oauth/authorize?oauth_token=XXXXXXXXXXXXXXXXXXXXXXXX
```

Visit the URL this generates. You will be prompted to enter the credentials for
the AWeber account you'd like to access via the API (NOTE: AWeber account, NOT
your labs developer account).

After submitting the form, copy the verifier code that was generated and return
to your node console session:

```
> aw.getAccessToken('your-verifier-token').then(console.log).catch(console.log)
Promise { <pending> }
{ token: "XXXXXXXXXXXXXXXXXXXXXXXX", tokenSecret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }
```

At this point, your account is fully authenticated. Make note of your token and
token secret. These should be stored securely for future use.

## Usage

__aweber-api__ exports a factory function for creating new `aweber` instances.
Consumer key and secret are __required__.

```js
const Aweber = require('aweber-api');

// ...

const aw = Aweber(config.consumerKey, config.consumerSecret, {
  token: session.token,
  tokenSecret: session.tokenSecret
});
```

## Available Options

Overview of defaults:

```js
Aweber(consumerKey, consumerSecret, {
  token: null,
  tokenSecret: null,
  userAgent: 'aweber-api (https://github.com/jimf/aweber-api)',
  Promise: Promise
});
```

## Methods

### OAuth

#### `Aweber#getAuthorizationUrl([callbackUrl])`

Resets the instance's internal token value to an empty string, requests a new
temporary token, stores the new token internally, and returns the URL where
authorization can be made. An optional callback url may be specified. Returns
a Promise.

#### `Aweber#getAccessToken(verifier)`

Request a new token and token secret. This method requires the verifier code
obtained from the user authorization process. Returns a Promise.

### HTTP Verbs

See the [official AWeber API docs](https://labs.aweber.com/docs/reference/1.0)
for specifics on using individual endpoints.

#### `Aweber#del(url, options)`

Makes a single `DELETE` request to the AWeber API for the given resource,
returning a Promise.

__Params__
- `url` __{String}__: URL of the resource to be deleted (host and query params optional)
- `options` __{Object}__: Options object
- `options.params` __{Object}__: Dictionary of query parameters to specify

__Example__

```js
// All of the following are equivalent:
aw.del('https://api.aweber.com/1.0/example/1?ws.op="delete"').then(/* ... */);
aw.del('/1.0/example/1?ws.op="delete"').then(/* ... */);
aw.del('/1.0/example/1', { params: { 'ws.op': 'delete' } }).then(/* ... */);
```

#### `Aweber#get(url, options)`

Makes a single `GET` request to the AWeber API for the given resource,
returning a Promise.

__Params__
- `url` __{String}__: URL of the resource to be retrieved (host and query params optional)
- `options` __{Object}__: Options object
- `options.params` __{Object}__: Dictionary of query parameters to specify

__Example__

```js
// All of the following are equivalent:
aw.get('https://api.aweber.com/1.0/example?status="new"').then(/* ... */);
aw.get('/1.0/example?status="new"').then(/* ... */);
aw.get('/1.0/example', { params: { status: 'new' } }).then(/* ... */);
```

#### `Aweber#patch(url, options)`

Makes a single `PATCH` request to the AWeber API for the given resource,
returning a Promise.

__Params__
- `url` __{String}__: URL of the resource to be updated (host and query params optional)
- `options` __{Object}__: Options object
- `options.data` __{Object}__: Dictionary of fields with their updated values
- `options.params` __{Object}__: Dictionary of query parameters to specify

__Example__

```js
const opts = { data: { subject: 'new value' } };

// All of the following are equivalent:
aw.patch('https://api.aweber.com/1.0/example/1', opts).then(/* ... */);
aw.patch('/1.0/example/1', opts).then(/* ... */);
```

#### `Aweber#post(url, options)`

Makes a single `POST` request to the AWeber API for the given resource,
returning a Promise.

__Params__
- `url` __{String}__: URL of the resource to be created (host and query params optional)
- `options` __{Object}__: Options object
- `options.data` __{Object}__: Dictionary of field/value pairs
- `options.params` __{Object}__: Dictionary of query parameters to specify

__Example__

```js
const data = { foo: 1, bar: true };
const params = { 'ws.op': 'create' };

// All of the following are equivalent:
aw.post('https://api.aweber.com/1.0/example?ws.op=create', { data }).then(/* ... */);
aw.post('https://api.aweber.com/1.0/example', { data, params }).then(/* ... */);
aw.post('/1.0/example?ws.op=create', { data }).then(/* ... */);
aw.post('/1.0/example', { data, params }).then(/* ... */);
```

#### `Aweber#put(url, options)`

Makes a single `PUT` request to the AWeber API for the given resource,
returning a Promise.

__Params__
- `url` __{String}__: URL of the resource to be updated (host and query params optional)
- `options` __{Object}__: Options object
- `options.data` __{Object}__: Dictionary containing fully updated record
- `options.params` __{Object}__: Dictionary of query parameters to specify

__Example__

```js
const opts = { data: { id: 1, foo: 1, bar: true } };

// All of the following are equivalent:
aw.post('https://api.aweber.com/1.0/example', opts).then(/* ... */);
aw.post('/1.0/example', opts).then(/* ... */);
```

## License

MIT

[build-badge]: https://img.shields.io/travis/jimf/aweber-api/master.svg
[build-status]: https://travis-ci.org/jimf/aweber-api
[npm-badge]: https://img.shields.io/npm/v/aweber-api.svg
[npm]: https://www.npmjs.org/package/aweber-api
[coverage-badge]: https://img.shields.io/coveralls/jimf/aweber-api.svg
[coverage-result]: https://coveralls.io/r/jimf/aweber-api
[dep-badge]: https://img.shields.io/david/jimf/aweber-api.svg
[dep-status]: https://david-dm.org/jimf/aweber-api
