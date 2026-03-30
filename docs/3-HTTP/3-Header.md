# HTTP Header

## 常见请求头

* `User-Agent`：客户端的信息，如 User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3。
* `Accept`：客户端能够接收的内容类型，如 Accept: text/html。
* `Accept-Encoding`：客户端能够接收的编码方式，如 Accept-Encoding: gzip, deflate。
`Accept-Language`：客户端的语言设置，如 Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7。
`Authorization`：用于 HTTP 认证的凭证，如 Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==。
`Cache-Control`：**指定缓存策略**，如 **Cache-Control: no-cache**。
`Connection`：**指定是否需要持久连接**，如 **Connection: keep-alive**。
`Content-Length`：请求体的长度，如 Content-Length: 348。
`Content-Type`：请求体的媒体类型，如 Content-Type: application/json。
`Cookie`：客户端存储的 Cookie，如 Cookie: name=value。
`Host`：请求的目标服务器，如 Host: <www.example.com。>
`Referer`：发起请求的页面的 URL， Referer 头部在 HTTP 请求中提供了用户来源的上下文，可以用于安全验证、流量分析等目的。

<!-- HTML 页面中的 Referrer-Policy 设置 -->
<meta name="referrer" content="no-referrer">

# `在 Nginx 配置文件中设置 Referrer-Policy`
add_header Referrer-Policy "no-referrer";

* `在服务器端验证 Referer：`

```javascript
    const express = require('express');
    const app = express();
    const VALID_REFERRERS = ['https://www.example.com', 'https://www.anotherdomain.com'];
    app.use((req, res, next) => {
    const referer = req.get('Referer');
    if (referer && VALID_REFERRERS.some(validReferrer => referer.startsWith(validReferrer))) {
        next(); // 允许请求继续
    } else {
        res.status(403).send('Forbidden'); // 拒绝请求
    }
    });

    app.get('/', (req, res) => {
    res.send('Hello, world!');
    });

    app.listen(3000, () => {
    console.log('Server running on port 3000');
    });
```


* `在前端使用 Referer `（前端代码通常不会直接修改 Referer 头部，但可以通过 JavaScript 获取当前页面的 URL，并作为请求的一部分：）

```javascript
const referer = document.referrer; // 获取当前页面的 Referer

fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Referer': referer, // 将 Referer 添加到自定义头部中
  },
  body: JSON.stringify({ some: 'data' }),
})
```

## Cache-Control

* https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control

### 指令


| Cache-Control 属性 | 含义说明 | 缓存行为 |
|-------------------|----------|----------|
| max-age=秒数 | 指定资源在多少秒内为强缓存 | 未过期前直接使用缓存，不请求服务器 |
| public | 资源可被任何缓存缓存 | 浏览器、代理、CDN 都可以缓存 |
| private | 资源仅允许浏览器缓存 | CDN / 共享缓存不可缓存 |
| no-cache | 禁止直接使用缓存，必须重新验证 | 每次请求都会进行协商缓存（ETag / Last-Modified） |
| no-store | 禁止缓存任何内容 | 浏览器和中间缓存都不存储，永远回源 |
| must-revalidate | 缓存过期后必须重新验证 | 过期缓存不能被直接使用 |


### 缓存好处

#### 节省带宽

```
无缓存：
用户访问 10 次 → 下载 10 次 5MB 视频 = 50MB 流量

有缓存：
用户访问 10 次 → 下载 1 次 5MB + 9 次验证 = ~5MB 流量
```

#### 提升速度

```
从网络下载：  5 秒
从磁盘读取：  0.1 秒（快 50 倍）
从内存读取：  0.001 秒（快 5000 倍）
```

#### 减轻服务器压力

```
100 万用户 × 5MB × 无缓存 = 5 PB 流量
100 万用户 × 5MB × 有缓存 = 50 TB 流量（90% 命中率）
```
