# HTTP Header

## 常见请求头

| 头 | 作用 | 示例 |
|--|--|--|
| `Host` | 目标主机（HTTP/1.1 必带，虚拟主机的依据） | `Host: www.example.com` |
| `User-Agent` | 客户端标识 | `Mozilla/5.0 ... Chrome/120` |
| `Accept` / `Accept-Encoding` / `Accept-Language` | 内容协商：能接收的类型 / 压缩算法 / 语言 | `Accept: text/html`、`Accept-Encoding: gzip, br` |
| `Content-Type` / `Content-Length` | 请求体的媒体类型 / 字节长度 | `Content-Type: application/json` |
| `Authorization` | 认证凭证 | `Authorization: Bearer <token>` |
| `Cookie` | 携带客户端 Cookie | `Cookie: sid=abc` |
| `Origin` / `Referer` | 请求来源（Origin 只有源，Referer 含完整路径） | 跨域判断 / 来源分析、防盗链 |
| `Cache-Control` / `If-None-Match` / `If-Modified-Since` | 缓存控制与协商验证 | 见 [协商缓存 & 强缓存](./2-协商缓存%20&%20强缓存.md) |
| `Connection` | 连接管理 | `Connection: keep-alive` |

## 常见响应头

| 头 | 作用 |
|--|--|
| `Content-Type` | 响应体类型与编码，如 `text/html; charset=utf-8` |
| `Set-Cookie` | 下发 Cookie（HttpOnly / Secure / SameSite 见 [Cookie & Storage](../2-JS/8-Cookie%20&%20storage%20&%20indexDB%20.md)） |
| `Cache-Control` / `ETag` / `Last-Modified` | 缓存策略 |
| `Access-Control-Allow-*` | CORS 授权（见 [跨域问题](./3-跨域问题.md)） |
| `Content-Encoding` | 实际使用的压缩算法，如 `gzip`、`br` |
| `Location` | 重定向目标（配合 3xx） |
| `X-Frame-Options` / `Content-Security-Policy` / `Strict-Transport-Security` | 安全响应头：防嵌套点击劫持 / CSP / 强制 HTTPS |

## Referer 专题

`Referer` 表示`发起请求的页面 URL`，提供用户来源上下文，用于流量分析、防盗链、安全校验。

* 控制泄露范围用 `Referrer-Policy`（现代浏览器默认 `strict-origin-when-cross-origin`：跨域时只发送源）：

```html
<meta name="referrer" content="no-referrer" />
```

```nginx
add_header Referrer-Policy "no-referrer";
```

* 服务端校验来源（防盗链 / 简易 CSRF 辅助）：

```js
const VALID = ['https://www.example.com'];
app.use((req, res, next) => {
  const referer = req.get('Referer');
  if (referer && VALID.some((v) => referer.startsWith(v))) return next();
  res.status(403).send('Forbidden');
});
```

* 前端读当前页来源：`document.referrer`（JS 不能直接改 Referer 头，可放进自定义头传给后端）。

## Cache-Control 指令速查

| 指令 | 含义 | 缓存行为 |
|--|--|--|
| `max-age=N` | N 秒内为强缓存 | 未过期不请求服务器 |
| `public` | 任何缓存均可存 | 浏览器、代理、CDN 都缓存 |
| `private` | 仅浏览器可存 | CDN / 共享缓存不缓存 |
| `no-cache` | 可存但必须先验证 | 每次协商（ETag / Last-Modified） |
| `no-store` | 什么都不存 | 永远回源 |
| `must-revalidate` | 过期后必须验证 | 不允许使用陈旧副本 |

## 缓存收益（量级感受）

* 带宽：10 次访问 5MB 资源，无缓存 50MB → 有缓存约 5MB（1 次下载 + 9 次 304 验证）。
* 速度：网络下载秒级 → 磁盘读取约 0.1s → 内存读取约 1ms。
* 服务器：百万用户下 90% 缓存命中率可把回源流量降一个数量级。

## 常见考点

* **哪些请求头不能被 JS 修改？** `Host`、`Origin`、`Referer`、`Cookie`（fetch 中）等由浏览器控制的「禁止修改头」——这是 CSRF 防御能信任 Origin 的原因。
* **Content-Type 常见取值？** `application/json`、`application/x-www-form-urlencoded`（表单默认）、`multipart/form-data`（文件上传）、`text/event-stream`（SSE）。
