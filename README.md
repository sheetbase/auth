<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @sheetbase/auth

**User management system for Sheetbase app.**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Installation](#installation)
- [Options](#options)
- [Lib](#lib)
  - [Lib properties](#lib-properties)
  - [Lib methods](#lib-methods)
    - [`registerRoutes(routeEnabling?, middlewares?)`](#lib-registerroutes-0)
    - [`useUserMiddleware()`](#lib-useusermiddleware-0)
    - [`userIdTokenMiddleware()`](#lib-useridtokenmiddleware-0)
- [Routing](#routing)
  - [Errors](#routing-errors)
  - [Routes](#routing-routes)
    - [Routes overview](#routing-routes-overview)
    - [Routes detail](#routing-routes-detail)
      - [`GET` /auth/action](#GET__auth_action)
      - [`POST` /auth/action](#POST__auth_action)
      - [`GET` /auth/oauth](#GET__auth_oauth)
      - [`GET` /auth/oob](#GET__auth_oob)
      - [`POST` /auth/oob](#POST__auth_oob)
      - [`PUT` /auth/oob](#PUT__auth_oob)
      - [`GET` /auth/public](#GET__auth_public)
      - [`DELETE` /auth](#DELETE__auth)
      - [`POST` /auth](#POST__auth)
      - [`PUT` /auth](#PUT__auth)
      - [`GET` /auth/token](#GET__auth_token)
      - [`GET` /auth/user](#GET__auth_user)
      - [`PATCH` /auth/user](#PATCH__auth_user)
- [Detail API reference](https://sheetbase.github.io/auth)


</section>

<section id="installation" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="installation"><p>Installation</p>
</a></h2>

- Install: `npm install --save @sheetbase/auth`

- Usage:

```ts
// 1. import module
import { AuthModule } from "@sheetbase/auth";

// 2. create an instance
export class App {
  // the object
  authModule: AuthModule;

  // initiate the instance
  constructor() {
    this.authModule = new AuthModule(/* options */);
  }
}
```

</section>

<section id="options" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="options"><p>Options</p>
</a></h2>

| Name                                                                                              | Type                                                                                                             | Description |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------- |
| [**encryptionSecret**](https://sheetbase.github.io/auth/interfaces/options.html#encryptionsecret) | <code>string</code>                                                                                              |             |
| [oobBody?](https://sheetbase.github.io/auth/interfaces/options.html#oobbody)                      | <code><a href="https://sheetbase.github.io/auth/globals.html#oobbody" target="_blank">OobBody</a></code>         |             |
| [oobSubject?](https://sheetbase.github.io/auth/interfaces/options.html#oobsubject)                | <code><a href="https://sheetbase.github.io/auth/globals.html#oobsubject" target="_blank">OobSubject</a></code>   |             |
| [oobUrl?](https://sheetbase.github.io/auth/interfaces/options.html#ooburl)                        | <code>string \| <a href="https://sheetbase.github.io/auth/globals.html#ooburl" target="_blank">OobUrl</a></code> |             |

</section>

<section id="lib" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="lib" href="https://sheetbase.github.io/auth/classes/lib.html"><p>Lib</p>
</a></h2>

**The `Lib` class.**

<h3><a name="lib-properties"><p>Lib properties</p>
</a></h3>

| Name                                                                                     | Type                                                                                                                         | Description |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [authActionRoute](https://sheetbase.github.io/auth/classes/lib.html#authactionroute)     | <code><a href="https://sheetbase.github.io/auth/classes/authactionroute.html" target="_blank">AuthActionRoute</a></code>     |             |
| [authOauthRoute](https://sheetbase.github.io/auth/classes/lib.html#authoauthroute)       | <code><a href="https://sheetbase.github.io/auth/classes/authoauthroute.html" target="_blank">AuthOauthRoute</a></code>       |             |
| [authOobRoute](https://sheetbase.github.io/auth/classes/lib.html#authoobroute)           | <code><a href="https://sheetbase.github.io/auth/classes/authoobroute.html" target="_blank">AuthOobRoute</a></code>           |             |
| [authPublicRoute](https://sheetbase.github.io/auth/classes/lib.html#authpublicroute)     | <code><a href="https://sheetbase.github.io/auth/classes/authpublicroute.html" target="_blank">AuthPublicRoute</a></code>     |             |
| [authRoute](https://sheetbase.github.io/auth/classes/lib.html#authroute)                 | <code><a href="https://sheetbase.github.io/auth/classes/authroute.html" target="_blank">AuthRoute</a></code>                 |             |
| [authService](https://sheetbase.github.io/auth/classes/lib.html#authservice)             | <code><a href="https://sheetbase.github.io/auth/classes/authservice.html" target="_blank">AuthService</a></code>             |             |
| [authTokenRoute](https://sheetbase.github.io/auth/classes/lib.html#authtokenroute)       | <code><a href="https://sheetbase.github.io/auth/classes/authtokenroute.html" target="_blank">AuthTokenRoute</a></code>       |             |
| [authUserRoute](https://sheetbase.github.io/auth/classes/lib.html#authuserroute)         | <code><a href="https://sheetbase.github.io/auth/classes/authuserroute.html" target="_blank">AuthUserRoute</a></code>         |             |
| [helperService](https://sheetbase.github.io/auth/classes/lib.html#helperservice)         | <code><a href="https://sheetbase.github.io/auth/classes/helperservice.html" target="_blank">HelperService</a></code>         |             |
| [idTokenMiddleware](https://sheetbase.github.io/auth/classes/lib.html#idtokenmiddleware) | <code><a href="https://sheetbase.github.io/auth/classes/idtokenmiddleware.html" target="_blank">IdTokenMiddleware</a></code> |             |
| [oauthService](https://sheetbase.github.io/auth/classes/lib.html#oauthservice)           | <code><a href="https://sheetbase.github.io/auth/classes/oauthservice.html" target="_blank">OauthService</a></code>           |             |
| [oobService](https://sheetbase.github.io/auth/classes/lib.html#oobservice)               | <code><a href="https://sheetbase.github.io/auth/classes/oobservice.html" target="_blank">OobService</a></code>               |             |
| [optionService](https://sheetbase.github.io/auth/classes/lib.html#optionservice)         | <code><a href="https://sheetbase.github.io/auth/classes/optionservice.html" target="_blank">OptionService</a></code>         |             |
| [tokenService](https://sheetbase.github.io/auth/classes/lib.html#tokenservice)           | <code><a href="https://sheetbase.github.io/auth/classes/tokenservice.html" target="_blank">TokenService</a></code>           |             |
| [userMiddleware](https://sheetbase.github.io/auth/classes/lib.html#usermiddleware)       | <code><a href="https://sheetbase.github.io/auth/classes/usermiddleware.html" target="_blank">UserMiddleware</a></code>       |             |

<h3><a name="lib-methods"><p>Lib methods</p>
</a></h3>

| Function                                                              | Returns type                 | Description              |
| --------------------------------------------------------------------- | ---------------------------- | ------------------------ |
| [registerRoutes(routeEnabling?, middlewares?)](#lib-registerroutes-0) | <code>RouterService<></code> | Expose the module routes |
| [useUserMiddleware()](#lib-useusermiddleware-0)                       | <code>RoutingHandler</code>  |                          |
| [userIdTokenMiddleware()](#lib-useridtokenmiddleware-0)               | <code>RoutingHandler</code>  |                          |

<h4><a name="lib-registerroutes-0" href="https://sheetbase.github.io/auth/classes/lib.html#registerroutes"><p><code>registerRoutes(routeEnabling?, middlewares?)</code></p>
</a></h4>

**Expose the module routes**

**Parameters**

| Param         | Type                                         | Description |
| ------------- | -------------------------------------------- | ----------- |
| routeEnabling | <code>true \| DisabledRoutes</code>          |             |
| middlewares   | <code>Middlewares \| RouteMiddlewares</code> |             |

**Returns**

<code>RouterService<></code>

---

<h4><a name="lib-useusermiddleware-0" href="https://sheetbase.github.io/auth/classes/lib.html#useusermiddleware"><p><code>useUserMiddleware()</code></p>
</a></h4>

**The `useUserMiddleware` call signature.**

**Returns**

<code>RoutingHandler</code>

---

<h4><a name="lib-useridtokenmiddleware-0" href="https://sheetbase.github.io/auth/classes/lib.html#useridtokenmiddleware"><p><code>userIdTokenMiddleware()</code></p>
</a></h4>

**The `userIdTokenMiddleware` call signature.**

**Returns**

<code>RoutingHandler</code>

---

</section>

<section id="routing" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="routing"><p>Routing</p>
</a></h2>

**AuthModule** provides REST API endpoints allowing clients to access server resources. Theses enpoints are not exposed by default, to expose the endpoints:

```ts
AuthModule.registerRoutes(routeEnabling?);
```

<h3><a name="routing-errors"><p>Errors</p>
</a></h3>

**AuthModule** returns these routing errors, you may use the error code to customize the message:

- `auth/invalid-email`: Invalid email.
- `auth/invalid-input`: Invalid input.
- `auth/invalid-password`: Invalid password.
- `auth/invalid-token`: Invalid token.
- `auth/user-exists`: User already exists.
- `auth/user-not-exists`: No user.

<h3><a name="routing-routes"><p>Routes</p>
</a></h3>

<h4><a name="routing-routes-overview"><p>Routes overview</p>
</a></h4>

| Route                              | Method   | Disabled | Description                                   |
| ---------------------------------- | -------- | -------- | --------------------------------------------- |
| [/auth/action](#GET__auth_action)  | `GET`    | `true`   | Default oob ui                                |
| [/auth/action](#POST__auth_action) | `POST`   | `true`   | Handle for oob action                         |
| [/auth/oauth](#GET__auth_oauth)    | `GET`    | `true`   | Get oauth user profile                        |
| [/auth/oob](#GET__auth_oob)        | `GET`    | `true`   | Check an oob code                             |
| [/auth/oob](#POST__auth_oob)       | `POST`   | `true`   | Handle oob actions                            |
| [/auth/oob](#PUT__auth_oob)        | `PUT`    | `true`   | Send oob emails                               |
| [/auth/public](#GET__auth_public)  | `GET`    | `true`   | Get user public profiles                      |
| [/auth](#DELETE__auth)             | `DELETE` | `true`   | Logout or delete account                      |
| [/auth](#POST__auth)               | `POST`   | `true`   | Log a user in                                 |
| [/auth](#PUT__auth)                | `PUT`    | `true`   | Create new account                            |
| [/auth/token](#GET__auth_token)    | `GET`    | `true`   | exchange the refresh token for a new id token |
| [/auth/user](#GET__auth_user)      | `GET`    | `true`   | Get auth user profile                         |
| [/auth/user](#PATCH__auth_user)    | `PATCH`  | `true`   | Update auth user data                         |

<h4><a name="routing-routes-detail"><p>Routes detail</p>
</a></h4>

<h5><a name="GET__auth_action"><p><code>GET</code> /auth/action</p>
</a></h5>

`DISABLED` Default oob ui

**Request query**

| Name        | Type       | Description |
| ----------- | ---------- | ----------- |
| **mode**    | <a data-sref="string"><code>string</code></a> |             |
| **oobCode** | <a data-sref="string"><code>string</code></a> |             |

**Response**

`string`

---

<h5><a name="POST__auth_action"><p><code>POST</code> /auth/action</p>
</a></h5>

`DISABLED` Handle for oob action

**Request body**

| Name         | Type       | Description |
| ------------ | ---------- | ----------- |
| **mode**     | <a data-sref="string"><code>string</code></a> |             |
| **oobCode**  | <a data-sref="string"><code>string</code></a> |             |
| newPassword? | <a data-sref="string"><code>string</code></a> |             |

**Response**

`object`

---

<h5><a name="GET__auth_oauth"><p><code>GET</code> /auth/oauth</p>
</a></h5>

`DISABLED` Get oauth user profile

**Request query**

| Name            | Type               | Description |
| --------------- | ------------------ | ----------- |
| **providerId**  | <a data-sref="UserProviderId"><code>UserProviderId</code></a> |             |
| **accessToken** | <a data-sref="string"><code>string</code></a>         |             |

**Response**

`object`

---

<h5><a name="GET__auth_oob"><p><code>GET</code> /auth/oob</p>
</a></h5>

`DISABLED` Check an oob code

**Request query**

| Name        | Type       | Description |
| ----------- | ---------- | ----------- |
| **oobCode** | <a data-sref="string"><code>string</code></a> |             |
| **mode**    | <a data-sref="string"><code>string</code></a> |             |

**Response**

`object`

---

<h5><a name="POST__auth_oob"><p><code>POST</code> /auth/oob</p>
</a></h5>

`DISABLED` Handle oob actions

**Request body**

| Name         | Type       | Description |
| ------------ | ---------- | ----------- |
| **oobCode**  | <a data-sref="string"><code>string</code></a> |             |
| **mode**     | <a data-sref="string"><code>string</code></a> |             |
| newPassword? | <a data-sref="string"><code>string</code></a> |             |

**Response**

`void`

---

<h5><a name="PUT__auth_oob"><p><code>PUT</code> /auth/oob</p>
</a></h5>

`DISABLED` Send oob emails

**Request body**

| Name      | Type       | Description |
| --------- | ---------- | ----------- |
| **mode**  | <a data-sref="string"><code>string</code></a> |             |
| **email** | <a data-sref="string"><code>string</code></a> |             |

**Response**

`void`

---

<h5><a name="GET__auth_public"><p><code>GET</code> /auth/public</p>
</a></h5>

`DISABLED` Get user public profiles

**Request query**

| Name  | Type       | Description |
| ----- | ---------- | ----------- |
| uid?  | <a data-sref="string"><code>string</code></a> |             |
| uids? | <a data-sref="string"><code>string</code></a> |             |

**Response**

`UserProfile | object`

---

<h5><a name="DELETE__auth"><p><code>DELETE</code> /auth</p>
</a></h5>

`DISABLED` Logout or delete account

**Request body**

| Name           | Type        | Description |
| -------------- | ----------- | ----------- |
| cancelAccount? | <a data-sref="boolean"><code>boolean</code></a> |             |
| refreshToken?  | <a data-sref="string"><code>string</code></a>  |             |

**Middleware data**

| Name     | Type           | Description |
| -------- | -------------- | ----------- |
| **user** | <a data-sref="UserObject" href="https://sheetbase.github.io/auth/classes/userobject.html"><code>UserObject</code></a> |             |

**Response**

`void`

---

<h5><a name="POST__auth"><p><code>POST</code> /auth</p>
</a></h5>

`DISABLED` Log a user in

**Request body**

| Name           | Type        | Description |
| -------------- | ----------- | ----------- |
| email?         | <a data-sref="string"><code>string</code></a>  |             |
| password?      | <a data-sref="string"><code>string</code></a>  |             |
| customToken?   | <a data-sref="string"><code>string</code></a>  |             |
| offlineAccess? | <a data-sref="boolean"><code>boolean</code></a> |             |

**Response**

`Record<string, unknown>`

---

<h5><a name="PUT__auth"><p><code>PUT</code> /auth</p>
</a></h5>

`DISABLED` Create new account

**Request body**

| Name      | Type       | Description |
| --------- | ---------- | ----------- |
| email?    | <a data-sref="string"><code>string</code></a> |             |
| password? | <a data-sref="string"><code>string</code></a> |             |

**Response**

`object`

---

<h5><a name="GET__auth_token"><p><code>GET</code> /auth/token</p>
</a></h5>

`DISABLED` exchange the refresh token for a new id token

**Request query**

| Name             | Type       | Description |
| ---------------- | ---------- | ----------- |
| **refreshToken** | <a data-sref="string"><code>string</code></a> |             |

**Response**

`object`

---

<h5><a name="GET__auth_user"><p><code>GET</code> /auth/user</p>
</a></h5>

`DISABLED` Get auth user profile

**Middleware data**

| Name     | Type           | Description |
| -------- | -------------- | ----------- |
| **user** | <a data-sref="UserObject" href="https://sheetbase.github.io/auth/classes/userobject.html"><code>UserObject</code></a> |             |

**Response**

`UserInfo`

---

<h5><a name="PATCH__auth_user"><p><code>PATCH</code> /auth/user</p>
</a></h5>

`DISABLED` Update auth user data

**Request body**

| Name             | Type                        | Description |
| ---------------- | --------------------------- | ----------- |
| profile?         | <a data-sref="UserEditableProfile"><code>UserEditableProfile</code></a>     |             |
| additionalData?  | <a data-sref="Record<string, unknown>"><code>Record<string, unknown></code></a> |             |
| settings?        | <a data-sref="Record<string, unknown>"><code>Record<string, unknown></code></a> |             |
| publicly?        | <a data-sref="string \"><p>string[</p>
</a>]      |             |
| privately?       | <a data-sref="string \"><p>string[</p>
</a>]      |             |
| username?        | <a data-sref="string"><code>string</code></a>                  |             |
| currentPassword? | <a data-sref="string"><code>string</code></a>                  |             |
| newPassword?     | <a data-sref="string"><code>string</code></a>                  |             |

**Middleware data**

| Name     | Type           | Description |
| -------- | -------------- | ----------- |
| **user** | <a data-sref="UserObject" href="https://sheetbase.github.io/auth/classes/userobject.html"><code>UserObject</code></a> |             |

**Response**

`UserInfo`

---

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@sheetbase/auth** is released under the [MIT](https://github.com/sheetbase/auth/blob/master/LICENSE) license.

</section>
