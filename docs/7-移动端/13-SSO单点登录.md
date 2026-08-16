# SSO单点登录

## 什么是单点登录
单点登录（Single Sign-On，SSO）是一种用户认证和授权的机制，它允许多个应用系统共用一个身份认证中心，用户只需登录一次，即可访问所有相关的应用系统。

## 单点登录的优点
- 减少用户认证次数，降低认证成本，提高用户体验。
- 统一认证中心，降低运维成本，提高安全性。
- 简化用户管理，降低用户认证门槛，提高用户满意度。

## 单点登录的实现方式
- 集中式单点登录（Centralized Single Sign-On，CSOS）：用户的认证信息存储在一个中心化的认证中心，所有应用系统都通过认证中心进行认证。
- 联合式单点登录（Federated Single Sign-On，FSOS）：用户的认证信息存储在各个应用系统中，应用系统之间通过单点登录协议进行认证。

## 数据流转

* 用户访问应用系统1，应用系统1需要用户进行认证，但用户没有登录，因此会重定向到认证中心进行登录。
* 用户登录认证中心，认证中心会生成一个唯一的认证票据，并将票据发送给应用系统1。
* 应用系统1接收到票据后，会将票据存储在本地，并在后续的请求中带上该票据，认证中心验证票据的有效性。

## OIDC 授权码流程（企业 SSO 的主流实现）

企业级 SSO 多数基于 **OIDC（OpenID Connect）**，由 Okta、Auth0、Keycloak 等 IdP（身份提供商）承载。
前端要理解的核心是 **授权码流程（Authorization Code Flow）**：

```
用户 → 前端应用（未登录）
     → 重定向到 IdP 授权页（/authorize?client_id=...&response_type=code&redirect_uri=...）
     → 用户在 IdP 完成登录
     → IdP 带 code 重定向回 redirect_uri
     → 前端把 code 交给后端 / BFF
     → 后端用 code + client_secret 换取 token（/token）
     → 后端签发自己的会话 Cookie 给前端
```

### 关键参数

| 参数 | 作用 |
|------|------|
| `client_id` | 应用在 IdP 的唯一标识，**可公开** |
| `client_secret` | 应用密钥，**只能存在服务端，绝不可进前端代码** |
| `redirect_uri` | 回调地址，必须在 IdP 后台**预先登记**，防止 code 被劫持 |
| `state` | 随机串，**防 CSRF**：回调时必须校验与发起时一致 |
| `nonce` | 随机串，防 ID Token 重放 |
| `code` | 一次性临时凭证，**有效期通常仅 60s** |

### 为什么 code 要交给后端换 token

- `client_secret` 一旦下发到浏览器就等于公开，**任何人都能冒充你的应用**
- token 存在前端（尤其 localStorage）会暴露在 XSS 攻击面下
- 由 BFF 换取 token 并转成 **HttpOnly + Secure + SameSite Cookie**，前端完全接触不到 token

> 纯前端应用（无后端）必须改用 **PKCE 流程**：用动态生成的 `code_verifier` / `code_challenge`
> 替代 `client_secret`，这是 SPA 和移动端的标准做法。

### Token 刷新

`access_token` 通常 1 小时过期，靠 `refresh_token` 续期。前端侧要处理的是
**并发请求同时 401 时只发起一次刷新**，其余请求排队等待，否则会打出多个刷新请求导致 token 互相失效。

## 常见考点

- 问题 1：为什么不用隐式流程（Implicit Flow）？→ token 直接出现在 URL 片段中，**易泄漏且无法刷新**，已被废弃
- 问题 2：`state` 参数的作用？→ **防 CSRF**，回调时校验与发起时一致
- 问题 3：SPA 没有后端怎么做 SSO？→ **PKCE**，用 `code_verifier` 替代 `client_secret`
- 问题 4：token 存哪里？→ 首选 **HttpOnly Cookie**；存 localStorage 会暴露于 XSS
- 问题 5：多个请求同时遇到 token 过期怎么办？→ **刷新请求去重**，共用同一个 Promise

## 拓展阅读

- [OpenID Connect 官方规范](https://openid.net/developers/how-connect-works/)
- [OAuth 2.0 授权码流程 — RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1)
- [PKCE — RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [Okta — Sign users in to your SPA](https://developer.okta.com/docs/guides/sign-into-spa-redirect/react/main/)
