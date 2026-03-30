

## 跨端应用 JS Bridge

## General
  * Share
  * Get app config
## UI
  * Set status bar style
  * Get dimensions
## Navigation
  * Navigate back
  * Navigate to browser
  * Navigate to path

## Data
```javascript
  * Fetch data by id
  * id: fetchPageRuleGoods, fetchActivityPageDetail, test (方法名称)
  * {
      type: 'data', 
      method: 'fetch',
      dataId: 'fetchActivityPageDetail',
      messageId: string,
      data: any // The actual type of the data will be implemented later
    }
```
## Analytic events
  * Impression event
  * Interaction event 
  * Click event
  * View h5 screen event

* **JS Bridge 离线包**
  * JS bridge： 即JavaScript桥接，是Hybrid App开发中的一个关键技术，它允许JavaScript代码与原生模块之间进行交互。其工作原理主要基于两个方向：JavaScript调用Native和Native主动调用JavaScript。
  * **离线包方案**
    webpack 打包、使用Webpack的HashPlugin来为输出文件生成哈希值，并将其嵌入到资源的URL中
    在HTML或其他入口文件中，动态地引用带有版本号的资源URL。这样，当资源内容发生变化时，版本号随之更新，引用的URL也会相应改变。
    在H5端，可以通过定时检查或者后台推送的方式来监控自己的版本是否有更新。如果发现新版本，就可以通过JS Bridge通知移动端去拉取更新文件。
    版本检查、版本比较



在Klarna的项目中，我们使用了JS Bridge技术来实现H5页面与原生APP之间的通信。这是为了让用户在APP中使用`WEB页面`时，能够享受到与原生页面无缝衔接的体验。以下是我们在项目中具体运用JS Bridge的几个关键点：


**通信桥梁的建立**

* 我们在WEB页面和原生APP之间创建了一个JS Bridge，用于双向通信。
* WEB页面可以通过JS Bridge调用原生功能，原生APP也可以通过JS Bridge与WEB页面进行交互。

例如，用户在WEB页面上点击一个按钮，JS Bridge会触发原生APP中的相机功能，从而实现拍照或上传图片。

**数据传输和接口调用**

* UI 层 (hideAppBar、全屏、是否隐藏按钮)
* Route (来回跳转路由)
* Networking （网络请求）
* GetData （直接获取用户信息）
* Common （公共方法）

* 比如在H5页面中需要获取用户的地理位置，我们通过JS Bridge向原生APP发送请求，
* 原生APP获取到位置信息后再通过JS Bridge返回给H5页面。

**性能优化**

我们对H5页面的加载进行了优化，例如使用懒加载和预加载技术。

* `懒加载`确保了只有在需要时才加载资源，
* `预加载` 则提前加载可能需要的资源，提高了页面响应速度。

- 减少请求数量：合并资源，减少HTTP请求，懒加载，内联资源等
- 减少请求资源大小：压缩资源，gzip，web图片，减少cookie等
- 提高请求速度：DNS预解析，资源预加载，CDN加速等
- 缓存：浏览器缓存，manifest缓存等
- 渲染：css、js加载顺序

通过减少DOM操作和优化CSS动画，我们确保了H5页面在APP中的流畅运行。

几乎所有的应用最先遇到的性能瓶颈都是网络请求，所以能减少请求的缓存就显得比较重要。
浏览器的缓存机制这里就不做赘述，主要有通过设置Cache-Control等HTTP请求头的方式，和PWA中利用Service Worker的方式。利用浏览器缓存机制，页面再次请求资源时，可以从缓存中获取，减少网络请求。


### 为什么webview 尤其的慢
- 在浏览器中，我们输入地址时（甚至在之前），浏览器就可以开始加载页面。
- 而在客户端中，客户端需要先花费时间初始化WebView，初始化完成后，才开始加载。
而这段时间，由于WebView还不存在，所有后续的过程是完全阻塞的。
webview 是移动端浏览器实例，几乎具备 PC 端浏览器的绝大多数能力，客户端在使用 webview 打开 H5 页面前，需要实例化 webview 对象，其初始化的过程在 android 系统中需要大约 500ms 以上的时间。
有一种优化手段是：使用对象复用机制，提前创建 webview 对象池，需要使用 webview 时，直接从池中获取初始化完毕的对象，这种方式，可以避免每次打开 H5 页面都要初始化 webview 实例，从而提升页面打开速度。

#### 1，提前初始化全局webView
- 当App刚启动时，就初始化全局webView并隐藏，
- 当用户访问了webView时，直接使用这个 webView加载对应网页。
**优点：**这种方法可以比较有效的减少WebView在App中的首次打开时间。当用户访问页面时，不需要初始化WebView的时间。
**缺点：**是需要额外消耗内存。还有需要webView切换时需要清除页面痕迹，容易造成内存泄漏。

#### 2， 设置webView缓冲池
App启动后，在webView的缓冲池，初始化多个webView。
需要加载网页时，可以去缓冲池中去取出新的webView。不需要时就可以直接销毁，同时初始化新的webView放进缓冲池中。
缺点：是相比而言需要更大的额外内存消耗。但是确保减少webView初始化消耗的时间和降低清除页面所造成的内存泄漏

#### 3， 客户端代理数据请求
在初始化webview的同时，通过 Native 来完成一些网络请求等，然后再回传给WebView，使得 WebView初始化不是完全的阻塞后续过程。
特点：
此方法虽然不能减小WebView初始化时间，但数据请求和WebView初始化可以并行进行，总体的页面加载时间就缩短了；缩短总体的页面加载时间。
 
**安全性措施**

在通信过程中，我们对数据进行了加密处理，防止数据被截获或篡改。
同时，对调用的接口进行了权限控制，只有经过授权的功能才能被调用，提升了系统的安全性。

例如，只有在用户登录并通过权限验证后，才能调用涉及用户隐私的接口，如获取通讯录或相册。

**用户体验提升**

通过JS Bridge技术，我们实现了H5页面与原生APP的无缝交互，用户在操作过程中几乎感受不到差异，提升了整体用户体验。

例如，在购物过程中，用户可以直接从H5页面调用原生支付功能，快速完成支付而无需跳转页面。

