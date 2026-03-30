# 安全

* **XSS（跨站脚本攻击）防护**： XSS通过在网页中注入恶意的脚本，使得这些脚本在用户的浏览器上执行
  * `转义用户输入`
  * `使用内容安全策略（CSP）` nonce scriptSrc
  * 使用 `HTTP-only Cookies`：将 Cookies 设置为 `HTTP-only，可以防止脚本通过 JavaScript 访问 Cookies`，从而防止 XSS 攻击者窃取用户的 Cookies
  * 验证和过滤用户输入
* **CSRF（跨站请求伪造）防护**： CSRF（跨站请求伪造）是一种网络攻击手段，攻击者通过诱导用户点击链接或者加载图片的方式，让用户在不知情的情况下向网站发出恶意请求。
  * 使用 `CSRF 令牌`：在用户提交请求时，服务器生成一个随机的 `CSRF 令牌`，并将这个令牌嵌入到表单中。当用户提交表单时，服务器会验证这个令牌是否有效。因为攻击者无法获取到这个令牌，所以无法伪造有效的请求。
    * 请求头：通过` X-CSRF-Token` 或类似的自定义请求头传递 CSRF 令牌。
    * 请求体：`通过表单的隐藏字段` 传递 CSRF 令牌。
      `<input type="hidden" name="csrf_token" value="令牌值">`
    * Cookie：`双重提交方法将令牌存储在 Cookie 和请求头`中进行验证。
      `body: JSON.stringify(data)`

  * 验证 `Referer`：服务器可以验证 HTTP 请求头中的 Referer 字段，确保请求是从合法的源发出的。如果 Referer 不是预期的源，那么可以拒绝这个请求
  * 要求用户`进行二次确认`：对于一些重要的操作，如修改密码、转账等，可以要求用户进行二次确认，例如输入密码、点击确认链接等。
  * 使用 **SameSite Cookies**：将 Cookies 设置为 SameSite，可以防止在跨站请求中发送 Cookies。这样，即使攻击者诱导用户发出请求，由于请求中没有 Cookies，所以服务器不会认为这是一个有效的会话。
* **反爬虫**：
  * `SSR渲染`
  * `IP 限制`
  * `隐藏或混淆数据`： 可以使用各种混淆工具，如 UglifyJS、Terser 等，将代码混淆后再发送。混淆后的代码逻辑和原代码相同，但是更难被理解。
  * `线上环境禁止点击右键检查`
* **SQL 注入**
  * SQL注入是一种常见的网络攻击手段，攻击者通过在输入字段中插入恶意的SQL代码，试图影响后端数据库的操作。例如，攻击者可能试图通过SQL注入获取敏感信息，修改数据，甚至删除数据。
  * `永远不要信任用户的输入，并且使用参数化查询或预编译语句`。这些方法可以确保用户的输入被正确地处理，并且不会被解析为SQL代码的一部分。
* **DDoS**
  * DDoS（Distributed Denial of Service）攻击，即分布式拒绝服务攻击，是一种常见的网络攻击手段。攻击者通过控制大量的计算机或其他网络设备，向目标服务器`发送大量的网络请求`，使得服务器无法处理正常的请求，从而达到拒绝服务的目的
  * 增加带宽
  * `使用负载均衡`
  * 使用 DDoS 防御服务
  * 使用`防火墙` 或 IPS 系统


## Content Security Policy (CSP) 指令

| 指令| 功能说明  | 示例  |
|---|---|---|
| `defaultSrc`| 用作其他未明确指定的指令的默认备份源。  | `default-src 'self';` |
| `scriptSrc` | 限制 JavaScript 代码的加载源。  | `script-src 'self' https://example.com;`|
| `styleSrc`  | 限制 CSS 样式表的加载源。   | `style-src 'self' https://example.com;`   |
| `imgSrc`| 限制图像的加载源。  | `img-src 'self' https://example.com;` |
| `connectSrc`| 限制可发起网络请求的源（例如 `XMLHttpRequest`、`fetch`、WebSocket）。| `connect-src 'self' https://api.example.com;` |
| `frameSrc`  | 限制嵌入框架（例如 `<frame>` 和 `<iframe>`）的源。  | `frame-src 'self' https://frames.example.com;` |
| `fontSrc`   | 限制字体文件的加载源。  | `font-src 'self' https://fonts.example.com;` |
| `mediaSrc`  | 限制音频和视频文件的加载源。| `media-src 'self' https://media.example.com;` |
| `objectSrc` | 限制插件对象（例如 `<object>`、`<embed>` 和 `<applet>`）的加载源。  | `object-src 'self';`  |
| `childSrc`  | 限制创建的嵌套浏览上下文（例如 `<frame>` 和 `<iframe>`）的源。  | `child-src 'self' https://children.example.com;` |
| `frameAncestors`| 限制哪些源可以嵌入当前页面为 `<frame>` 或 `<iframe>`。  | `frame-ancestors 'self' https://parent.example.com;` |
| `formAction`| 限制表单提交的目标源。  | `form-action 'self' https://forms.example.com;` |
| `workerSrc` | 限制 Web Workers 和 Shared Workers 的加载源。| `worker-src 'self';`  |
| `manifestSrc`   | 限制应用清单文件的加载源。  | `manifest-src 'self';`|
| `baseUri`   | 限制 `<base>` 标签的有效来源。  | `base-uri 'self';`|
| `blockAllMixedContent` | 防止加载任何混合内容；HTTP 内容被 HTTPS 页面加载时会被阻止。   | `block-all-mixed-content;`|
| `upgradeInsecureRequests` | 将页面中的所有 HTTP 请求自动升级为 HTTPS。 | `upgrade-insecure-requests;`  |


scriptSrc：限制 JavaScript 的来源。
connectSrc：限制网络请求的来源。
frameSrc：限制框架嵌入的来源。
defaultSrc：作为所有其他指令的默认源。

* 在 `Nginx` 配置文件中添加以下内容：

```javascript
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://apis.google.com; connect-src 'self' https://api.example.com; frame-src 'none';";
```

* 在 `Express` 应用中，你可以使用 helmet 中间件来设置 CSP 头部

```javascript
const express = require('express');
const helmet = require('helmet');

const app = express();

// 配置 CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameSrc: ["'none'"],
    },
  })
);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```


## WAF 防火墙

**waf主要做了什么**: 即Web应用防火墙，是一种专门用于保护Web应用安全的网络安全解决方案，包括但不限于SQL注入、跨站脚本（XSS）、跨站请求伪造（CSRF）和文件包含攻击、选择合适的WAF服务提供商 （阿里云、亚马逊云科技（AWS））


## 管理第三方cookies

管理第三方 Cookies

* 分析 Cookies：使用浏览器开发者工具（如 `Chrome 的 Application 选项卡`）查看和识别第三方 Cookies。


XSS和CSRF的区别：
   1.XSS是获取信息，不需要提前知道其他用户页面的代码和数据包
   2.CSRF代替用户完成指定的动作，需要知道其他页面的代码和数据包



1.sql注入原理：是将sql代码伪装到输入参数中，传递到服务器解析并执行的一种攻击手法。也就是说，也就是说，
            在一些对server端发起的请求参数中植入一些sql代码，server端在执行sql操作时，会拼接对应参数，
            同时也将一些sql注入攻击的“sql”拼接起来，导致会执行一些预期之外的操作。
		防范：1.对用户输入进行校验
		       2.不适用动态拼接sql
2.XSS（跨站脚本攻击）：往web页面插入恶意的html标签或者js代码。
		        举例子：在论坛放置一个看是安全的链接，窃取cookie中的用户信息
			防范：1.尽量采用post而不使用get提交表单
			      2.避免cookie中泄漏用户的隐式
3.CSRF (跨站请求伪装）：通过伪装来自受信任用户的请求
			举例子：黄轶老师的webapp音乐请求数据就是利用CSRF跨站请求伪装来获取QQ音乐的数据
			防范：在客服端页面增加伪随机数，通过验证码
