## URI、URL 和 URN

三者是`包含关系`，不是并列关系：`URI = URL ∪ URN`

* **URI**（Uniform Resource Identifier，统一资源`标识`符）：用来唯一标识一个资源，是抽象的父概念
* **URL**（Uniform Resource Locator，统一资源`定位`符）：通过`位置`来标识资源 —— 告诉你资源在哪、用什么协议去拿
* **URN**（Uniform Resource Name，统一资源`名称`）：通过`名字`来标识资源 —— 只说它是谁，不关心它在哪

一句话区分：`URL 回答「在哪里」，URN 回答「是什么」，URI 是两者的统称`。

```
                    URI
        ┌────────────┴────────────┐
       URL                       URN
   （靠位置定位）              （靠名字标识）
https://a.com/x.png        urn:isbn:9787115428028
```

### URL 的组成

```javascript
// 完整结构
scheme://user:password@host:port/path?query#fragment

// 实例
https://www.example.com:443/docs/index.html?id=1&tab=2#section
```

| 部分 | 示例 | 说明 |
| --- | --- | --- |
| scheme | `https` | 协议，决定用什么方式获取资源 |
| host | `www.example.com` | 域名或 IP |
| port | `443` | 端口，http 默认 80、https 默认 443，默认时可省略 |
| path | `/docs/index.html` | 资源在服务器上的路径 |
| query | `id=1&tab=2` | 查询参数，`?` 开头、`&` 分隔 |
| fragment | `section` | 锚点，`只在浏览器端生效，不会发送给服务器` |

### URN 的组成

```
urn:<NID>:<NSS>
```

* `NID`：命名空间标识（namespace identifier），如 `isbn`、`uuid`
* `NSS`：命名空间内的具体名称（namespace specific string）

```javascript
urn:isbn:9787115428028          // 一本书，不管它在哪个网站上卖
urn:uuid:6e8bc430-9c3a-11d9     // 一个 UUID
urn:ietf:rfc:3986               // RFC 3986 文档本身
```

URN 的价值在于`资源迁移后标识不变` —— 网站换域名 URL 就失效了，但 ISBN 永远指向同一本书。

### 常见追问

**Q：日常写的 `https://a.com` 到底算 URL 还是 URI？**
都算。它是 URL，而 URL 是 URI 的子集，所以叫它 URI 也没错。规范里更推荐统称 URI（RFC 3986 就叫 *URI Generic Syntax*）。

**Q：为什么实际开发中几乎见不到 URN？**
URN 只标识不定位，`光有 URN 拿不到资源`，还需要额外的解析服务把它映射到真实位置。而 URL 自带定位能力，浏览器直接就能取，所以 Web 上是 URL 一统天下。

**Q：URI 和 URL 在前端代码里怎么体现？**
```javascript
const url = new URL('https://a.com:8080/p/x?id=1#top');

url.protocol  // 'https:'
url.hostname  // 'a.com'
url.port      // '8080'
url.pathname  // '/p/x'
url.search    // '?id=1'
url.hash      // '#top'        仅前端可见，不进请求
url.origin    // 'https://a.com:8080'   同源判断看这个
```

**Q：中文和特殊字符怎么处理？**
URL 只允许 ASCII，其余字符必须百分号编码：

```javascript
encodeURI('https://a.com/前端')
// 'https://a.com/%E5%89%8D%E7%AB%AF'  保留 :/?#& 等结构字符

encodeURIComponent('a=1&b=2')
// 'a%3D1%26b%3D2'  连结构字符一起转义

// 用错的后果：拼接参数时用 encodeURI，& 不会被转义，参数被截断
`?q=${encodeURIComponent(keyword)}`   // ✅ 拼参数用这个
```
