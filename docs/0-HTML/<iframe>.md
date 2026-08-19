# `<iframe>`

## 优缺点

| 优点 | 描述 |
|--|--|
| **隔离内容** | 嵌入页面与主页面有独立的文档环境（独立 DOM / JS 上下文），互不干扰 |
| **集成第三方** | 嵌入广告、地图、视频播放器、客服组件等第三方服务的标准方式 |
| **模块化** | 独立功能模块可单独开发部署（微前端的一种朴素实现） |
| **安全边界** | 配合 `sandbox` 可限制内嵌页面的能力 |

| 缺点 | 描述 |
|--|--|
| **性能问题** | 每个 iframe 是完整的文档加载，阻塞主页面 `onload`，共享连接池 |
| **安全隐患** | 嵌入不可信内容可能引入钓鱼 / 点击劫持风险 |
| **SEO 不友好** | 内嵌内容通常不计入主页面的搜索索引 |
| **跨域受限** | 跨域 iframe 无法直接读写其 DOM，只能消息通信 |
| **体验问题** | 移动端滚动、弹层定位、历史记录（后退按钮）行为难控制 |

## sandbox 属性（高频考点）

`sandbox` 默认施加`最严格限制`（禁脚本、禁表单、禁弹窗、视为独立源…），再按需逐项放开：

```html
<iframe src="https://third-party.com/widget"
        sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
```

| 常用值 | 放开的能力 |
|--|--|
| `allow-scripts` | 执行脚本 |
| `allow-same-origin` | 保留其真实源（否则被视为 opaque 独立源） |
| `allow-forms` | 提交表单 |
| `allow-popups` | window.open / target=_blank |
| `allow-top-navigation` | 允许把顶层页面导航走（危险，慎开） |

> 不要同时给不可信内容开 `allow-scripts + allow-same-origin`：若内嵌页与父页同源，脚本可以移除自己的 sandbox 限制。

## 跨域通信：postMessage

```ts
// 父页面 → iframe
const frame = document.querySelector('iframe')!;
frame.contentWindow!.postMessage({ type: 'init', userId: 1 }, 'https://child.com');

// iframe 内接收并回信
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://parent.com') return;  // 必须校验来源
  e.source?.postMessage({ type: 'ready' }, e.origin as string);
});
```

要点：发送时明确指定 `targetOrigin`（不要用 `*` 传敏感数据）；接收时`必须校验 e.origin`。

## 防点击劫持：不让自己的页面被 iframe 嵌套

* 响应头 `X-Frame-Options: DENY | SAMEORIGIN`（旧标准）
* CSP：`Content-Security-Policy: frame-ancestors 'none' | 'self' | https://trusted.com`（新标准，优先）
* 兜底 JS（frame busting）：`if (top !== self) top.location = self.location`，可被 sandbox 化解，只能算辅助手段。

## 常见考点

* **iframe 与父页面同源时能互访吗？** 能，`frame.contentWindow.document` / 子页 `window.parent` 均可直接操作；跨域则只剩 `postMessage`。
* **iframe 会阻塞父页面吗？** 会占用同域名连接数并阻塞父页面 `onload`；可用 `loading="lazy"` 延迟加载视口外的 iframe。
* **微前端为什么不全用 iframe？** 隔离性最好但代价大：弹层无法覆盖全屏、路由/通信繁琐、每次加载完整上下文白屏明显。

## 拓展阅读

* [MDN - `<iframe>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)
* [MDN - window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
