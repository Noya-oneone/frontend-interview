# 微前端

## iframe

**实现方式**：iframe 是 HTML 提供的一个元素，可以用于在当前文档中嵌入另一个 HTML 页面。single-spa 是一个 JavaScript 库，可以用于将多个单页面应用（SPA）组合成一个单一的应用。

**隔离性**：iframe 提供了很好的隔离性，**每个 iframe 都有自己的 JavaScript 运行环境和 CSS 上下文，互不影响**。而 single-spa 则需要各个应用**共享一个** JavaScript 运行环境和 CSS 上下文，可能会有**命名冲突或样式污染的问题**。

**通信**：iframe 之间的通信需要通过 **postMessage API**或者服务器进行，相对复杂。而 single-spa 则可以直接通过 **JavaScript 变量**或者事件进行通信，更加简单。

**性能**：iframe 会创建新的 HTTP 请求，加载完整的 HTML、CSS 和 JavaScript，性能较差。而 single-spa 则可以复用已有的 JavaScript 和 CSS，只加载必要的代码，性能更好。

**路由**：iframe 的路由需要自己管理，而 single-spa 则提供了**一套统一的路由管理机制**。

iframe 更适合于**需要高度隔离，但对性能要求不高的场景**。而 single-spa 则更适合于需要高性能，对隔离性要求不高的场景。

## single-spa

single-spa 是由 Canopy 提出的一个用于构建微前端的 JavaScript 框架。

single-spa 的主要原理是将一个**大型的单页面应用（SPA）分解为多个小型的 SPA**，每个 SPA 负责自己的生命周期（加载、卸载、更新等），并且可以独立开发、独立部署。single-spa 提供了一套**统一的生命周期钩子**，用于管理这些 SPA 的加载和卸载。

以下是 single-spa 的主要工作流程：

**注册应用**：首先，你需要使用 singleSpa.registerApplication 方法注册你的应用，指定应用的名称、入口文件、激活条件等。

**启动**：然后，你需要使用 singleSpa.start 方法启动 single-spa。

**路由匹配**：当 URL 发生变化时，single-spa 会根据注册的应用的激活条件，决定哪些应用需要被加载、卸载或更新。

**加载应用**：对于需要被加载的应用，single-spa 会加载应用的入口文件，然后调用应用的 bootstrap、mount 钩子，将应用挂载到 DOM 中。

**卸载应用**：对于需要被卸载的应用，single-spa 会调用应用的 unmount 钩子，将应用从 DOM 中移除。

通过这种方式，single-spa 实现了微前端的核心功能，即将一个大型的单页面应用分解为多个可以独立开发、独立部署的小型应用。

## qiankun

* 改造了sing-spa

qiankun他解决了**JS沙盒环境**，不需要我们自己去进行处理。在single-spa的开发过程中，我们需要自己手**动的去写调用子应用JS的方法**（如上面的 createScript方法），而qiankun不需要，乾坤**只需要你传入响应的apps的配置即可**，会帮助我们去加载。还有一个就是他们本质的区别
**路由分发**: 一种是**JS entry**，另外一种是**html entry**

**JS Entry**的方式通常是子应用将资源打成一个 entry script，但这个方案的限制也颇多，如要求子应用的所有资源打包到一个 js bundle 里，包括 css、图片等资源。除了打出来的包可能体积庞大之外的问题之外，资源的并行加载等特性也无法利用上。

**HTML Entry**则更加灵活，直接将子应用打出来 HTML 作为入口，主框架可以通过 fetch html 的方式获取子应用的静态资源，同时将 HTML document 作为子节点塞到主框架的容器中。这样不仅可以极大的减少主应用的接入成本，子应用的开发方式及打包方式基本上也不需要调整，而且可以天然的解决子应用之间样式隔离的问题(后面提到)。

## webpack5模块联邦

* 引入了一个新的功能叫做模**块联邦**（Module Federation）。这是一种 JavaScript 微前端解决方案，允许一个 JavaScript 应用程序动态地运行另一个应用程序的代码。`ModuleFederationPlugin`
  * **共享模块**：可以在不同的 Webpack 构建之间共享模块，无需复制和粘贴代码。
  * **动态加载**：可以在运行时动态地加载另一个应用程序的代码，而无需提前打包到一起。
  * **独立部署**：每个应用程序可以独立开发和部署，无需协调和等待其他应用程序。
