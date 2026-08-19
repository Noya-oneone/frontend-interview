# `<meta>` 标签

`<meta>` 提供文档级元数据，放在 `<head>` 中，主要服务四类目的：**编码、视口、SEO / 分享、浏览器行为控制**。

## 编码

```html
<meta charset="UTF-8" />
```

* 必须出现在文档`前 1024 字节`内，否则浏览器可能用错误编码开始解析。
* UTF-8 是`可变长度`编码：ASCII 字符 1 字节，其他字符 2~4 字节（中文常见 3 字节）。

## 视口（移动端必备）

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

| 属性 | 说明 |
|--|--|
| `width` | 视口宽度，通常 `device-width`（设备逻辑宽度） |
| `initial-scale` | 初始缩放比例，`1` 即 100% |
| `maximum-scale` / `minimum-scale` | 缩放上下限 |
| `user-scalable` | 是否允许用户缩放；`no` 会伤害无障碍（低视力用户无法放大），慎用 |

不写 viewport 时，移动浏览器会按约 980px 的虚拟视口渲染再整体缩小，页面文字变得极小 —— 这就是老网站在手机上「一屏全是小字」的原因。

## SEO 与社交分享

```html
<meta name="description" content="页面摘要，展示在搜索结果里" />
<meta name="keywords" content="已被主流搜索引擎忽略，仅作历史了解" />

<!-- Open Graph：微信/Twitter/FB 等分享卡片 -->
<meta property="og:title" content="标题" />
<meta property="og:image" content="https://example.com/cover.png" />
<meta property="og:description" content="分享摘要" />
```

## 浏览器行为控制

```html
<!-- Referrer 策略：控制跳转时 Referer 头携带多少信息 -->
<meta name="referrer" content="no-referrer" />

<!-- 等价于 HTTP 响应头的 meta 版本 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />

<!-- SPA 中不推荐但要认识：定时刷新 / 跳转 -->
<meta http-equiv="refresh" content="5; url=https://example.com" />
```

* `Referer` 头提供`用户来源上下文`，可用于统计与防盗链；`referrer` meta 可按页面粒度收紧泄露范围（如 `strict-origin-when-cross-origin`，现代浏览器默认值）。

## 常见考点

* **`name` 与 `http-equiv` 的区别？** `name` 是纯文档元数据；`http-equiv` 模拟同名 HTTP 响应头的效果（但服务器真响应头优先级更高、能力更全）。
* **viewport 里 `width=device-width` 和 `initial-scale=1` 只写一个行不行？** 都写最稳：两者取值冲突时浏览器取较大的视口，只写其一在个别 WebView 上有兼容差异。
* **charset 写在 CSS/JS 里有用吗？** 外部资源编码优先看 HTTP 头 `Content-Type: ...; charset=`，其次才是文件内声明。
