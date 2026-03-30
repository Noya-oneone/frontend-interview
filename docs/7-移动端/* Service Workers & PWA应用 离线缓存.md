# H5 离线缓存加载

* 浏览器对 HTML5 离线存储的管理和加载涉及到不同的存储机制

  * 包括应用缓存（**Application Cache**，已逐步弃用）
  * **Service Workers**。

## Service Workers （兼容度超过 96%）

* `Service Workers 离线缓存`： 浏览器把`缓存管理`开放一层接口给开发者 （淘宝首页
            网易新闻 wap 文章页
            百度的 Lavas
            fullstory ... ）
  * 现代的离线缓存机制，可以缓存大量静态资源，提高页面加载速度。
  * 网络不稳定甚至断网的环境下，也能瞬间加载并展现
  * 可以操作本地缓存，如 CacheStorage，IndexedDB
  * 能接受服务器推送的离线消息
  * 快速响应，具有平滑的过渡动画及用户操作的反馈
  * PWA（Progressive Web Apps）： Web App Manifest，Web Push，Service Worker 和 Cache Api 
  * `改写默认行为`： 浏览器默认在刷新时，会对所有资源都重新发起请求，即使缓存还是有效期内，而使用了SW，就可以改写这个行为，直接返回缓存
  * `缓存和更新并存`： 要让网页离线使用，就需要整站使用长缓存，包括HTML。而HTML使用了长缓存，就无法及时更新（浏览器没有开放接口直接删除某个html缓存）。而使用SW就可以，每次先使用缓存部分，然后再发起SW js的请求，这个请求我们可以实施变更，修改HTML版本，重新缓存一份。那么用户下次打开就可以看到新版本了。
  * `最优的版本控制`： HTML中记录所有js css的文件名（HASH），然后按需发起请求。每个资源都长缓存
  * `额外缓存`：HTTP缓存空间有限，容易被冲掉。虽然部分浏览器实现SW的存储也有淘汰机制，但多一层缓存，命中的概率就要更高了。
  * `离线处理`： 当监测到离线，可以做特殊处理，返回离线的提示
  * `预加载资源`： 类似prefetch标签
  * `前置处理`： 例如校验html/JS是否被运营商劫持？js文件到了UI进程执行后，就无法删除恶意代码，而在SW中，我们可以当作文本一样，轻松解决。当然，在HTTPS环境下出现劫持的概率是极低的。
 
* Service Workers 是一种现代的`离线缓存机制`，提供更灵活的缓存控制和后台功能
* 使用 JavaScript 注册 Service Worker，并在其脚本中编写缓存逻辑
* 浏览器在加载时会注册 Service Worker，Service Worker 的安装、激活和运行过程会被触发。
* Service Worker 可以拦截网络请求，并根据缓存策略返回缓存的资源或从网络中获取资源
Service Workers 提供了更精细的缓存管理，通过编程控制缓存的生命周期和更新。
事件处理：
    * `install`: 安装阶段，可以缓存资源。
    * `activate`: 激活阶段，清理旧缓存。
    * `fetch`: 拦截和处理网络请求。
    * `sync`: 后台同步。
    * `push`: 处理推送通知。

```javascript
// service-worker.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/index.html',
        '/style.css',
        '/script.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

| 应用场景 | 描述 |
|--------|-----|
| **离线支持** | 使应用在离线或网络断开的情况下仍能提供基本功能和内容，例如离线浏览和操作。|
| **性能优化** | 加快页面加载速度，减少网络请求，提升用户体验。|
| **重复访问优化** | 通过缓存静态资源（如 HTML、CSS、JavaScript 和图片），减少每次加载时的网络流量。|
| **数据缓存** | 缓存用户的数据和状态，使其在离线状态下仍能使用，如缓存表单数据或用户输入。|
| **渐进式 Web 应用** | 实现渐进式 Web 应用（PWA）的核心功能，包括离线访问、后台同步和推送通知。|
| **用户体验**| 提高用户体验，特别是在网络条件不稳定的情况下，通过缓存保证应用的可用性。|
| **跨平台应用** | 在不同设备和平台间保持一致的用户体验，例如通过离线缓存支持移动设备和桌面设备。|
| **异步数据同步** | 使用后台同步功能，在设备重新连接时更新或提交离线期间的数据。|
| **可靠性** | 提高应用的可靠性和稳定性，确保在网络波动或中断时用户能够继续访问重要功能或数据。|
| **节省带宽** | 减少不必要的网络请求，从而节省带宽，特别是在数据流量成本高昂的环境中。|

## 应用缓存（Application Cache）

* 使用 `manifest` 文件来定义需要缓存的资源列表和其他缓存策略
* 浏览器在`首次加载时会下载` manifest 文件及其中指定的所有资源，并缓存它们。
* 当网络不可用时，浏览器会从缓存中加载这些资源。
* 应用缓存的`更新机制较为繁琐`，需要重新下载和更新 manifest 文件。
* 使用 window.applicationCache 对象可以管理应用缓存，例如检查缓存状态。
常用事件：
    * `cached`: 缓存已完成。
    * `checking`: 开始检查更新。
    * `error`: 更新失败。
    * `noupdate`: 无需更新。
    * `updateready`: 更新准备好。

```javascript
    <!DOCTYPE html>
    <html manifest="example.appcache">
    <head>
    <title>My App</title>
    </head>
    <body>
    <h1>Welcome to My App</h1>
    </body>
    </html>
```

* 缓存文件必须与 HTML 文件同源
* 缓存文件必须以 `.appcache` 扩展名
* 缓存文件必须在服务器上，不能使用本地文件
* 缓存文件必须在第一次加载页面时下载，之后更新缓存文件不会自动更新
* 缓存文件不会被压缩，因此应尽量减少缓存文件的大小
* 缓存文件不会被缓存到磁盘，因此无法访问缓存文件

缓存文件内容示例：
```javascript
CACHE MANIFEST
/index.html
/style.css
/script.js
```




* `Cache API` 是为资源请求与响应的存储量身定做的
  * 它采用了`键值对`的数据模型存储格式，
  * 以`请求对象`为键、`响应对象`为值
  * 正好对应了发起网络资源请求时请求与响应一一对应的关系。
  * 因此 Cache API 适用于`请求响应`的本地存储。
* `IndexedDB` 则是一种非关系型（NoSQL）数据库，它的存储对象`主要是数据`，
  * 比如数字、字符串、Plain Objects、Array 等，
  * 以及少量特殊对象比如 Date、RegExp、Map、Set 等等，
  * 对于 Request、Response 这些是无法直接被 IndexedDB 存储的。

* 可以看到，`Cache API 和 IndexedDB 在功能上是互补的`。
* 在设计本地资源缓存方案时通常以 Cache API 为主，但在一些复杂的场景下，Cache API 这种请求与响应一一对应的形式存在着局限性，因此需要结合上功能上更为灵活的 IndexedDB，通过 IndexedDB 存取一些关键的数据信息，辅助 Cache API 进行资源管理。

<!-- https://juejin.cn/post/7067113836372819982 -->
<!-- https://fed.taobao.org/blog/taofed/do71ct/workbox3/ -->
* 使用 IndexedDB 及 CacheStorage 来为 Service Worker 的离线存储`提供底层服务`
  * 网站静态资源使用：`CacheStorage`
  * 其他资源使用 `IndexedDB`
* `Workbox` ： 一个开源的库，可以帮助开发者更容易地实现 Service Worker 的离线缓存功能。
  * 它被定义为 PWA 相关的工具集合，包括缓存、路由、消息推送等功能。
  * workbox-webpack-plugin：webpack 插件，可以自动生成 Service Worker 文件，并将其注册到浏览器。
    * 给预缓存打hash，开发的时候动态更新 hash
    * 更方便的接口去动态缓存配置方式，自动生成和更新 sw
* 缓存规则
  * 图片建议使用 Cache First，并设置一定的失效事件，请求一次就不会再变动了
  * 静态资源建议使用 Cache First，并设置长期缓存，更新频率低
  * 动态资源建议使用 Network First，并设置失效事件，请求时会重新请求
  * 对于一些不重要的资源，可以设置长期缓存，更新频率低，比如字体文件
