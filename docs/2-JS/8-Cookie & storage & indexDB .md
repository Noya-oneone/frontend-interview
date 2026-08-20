# Cookie & Storage & IndexedDB

## 四种存储对比（高频考点）

| 维度 | Cookie | localStorage | sessionStorage | IndexedDB |
|--|--|--|--|--|
| **容量** | 约 4KB | 约 5~10MB | 约 5~10MB | 数百 MB 起（按磁盘配额） |
| **生命周期** | 可设过期时间（`Expires/Max-Age`），默认会话级 | `永久`，除非主动删除 | `标签页关闭即清除` | 永久，除非主动删除 |
| **随请求发送** | ✅ `每次同源请求自动携带`（增加带宽开销） | ❌ | ❌ | ❌ |
| **数据类型** | 字符串 | 字符串（对象需 JSON 序列化） | 字符串 | `结构化数据`（对象、二进制），支持索引与事务 |
| **API 形态** | `document.cookie` 手动解析，难用 | 同步、简单键值 | 同步、简单键值 | `异步`（事件/Promise 封装），可在 Worker 中使用 |
| **典型场景** | 会话标识、需要随请求带给服务端的小数据 | 主题偏好、token（有 XSS 风险） | 一次性表单暂存、单页会话状态 | 离线数据、大量结构化缓存（IM 消息、PWA） |

补充要点：

* `localStorage / sessionStorage 是同步 API`，读写在主线程完成，大值频繁读写会阻塞渲染；IndexedDB 是异步的，不阻塞。
* 同源策略：Storage 与 IndexedDB 严格`按源隔离`；Cookie 按`域 + 路径`，可通过 `Domain` 设置让子域共享。
* `sessionStorage` 的“会话”指`单个标签页`：同站新开标签不共享（从当前页新开的标签会复制一份初始值，此后独立）。

## Cookie 的安全属性（面试必答）

| 属性 | 作用 |
|--|--|
| `HttpOnly` | JS 无法通过 `document.cookie` 读取 —— 防 XSS 窃取会话 |
| `Secure` | 只在 HTTPS 连接中发送 |
| `SameSite` | `Strict / Lax（默认）/ None` 控制跨站请求是否携带 —— 防 CSRF；`None` 必须搭配 Secure |
| `Domain / Path` | 限定发送范围 |

安全性辨析：三种 Web 存储（Storage/IndexedDB）都能被同源 JS 读取，`同样受 XSS 威胁`；「Cookie + HttpOnly」是唯一能对 JS 隐藏的方案，因此`敏感凭证首选 HttpOnly Cookie`。

## 常见考点

* **token 放哪里？** HttpOnly + Secure + SameSite Cookie 防 XSS 窃取（需另防 CSRF）；放 localStorage 便于 JS 控制但 XSS 一偷一个准 —— 答出权衡即可。
* **localStorage 跨标签页同步？** 监听 `window.addEventListener('storage', ...)`，其他标签页修改时触发（本页修改不触发自身）。
* **cookie 增删改？** 服务端 `Set-Cookie` 响应头；前端 `document.cookie = 'k=v; max-age=3600; path=/'`，删除即设置过期时间为过去。
