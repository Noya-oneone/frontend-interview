## 路由 (Router)
  * router: hash、history、abstract
  * 嵌套路由
  * **hash**: 使用 URL 的 hash 来模拟一个完整的 URL，于是，其显示的网路路径中会有 “#” 号。
    * **兼容所有的浏览器和服务器**
    * **不美观**
    * **当 URL 改变时，页面不会重新加载** 、 不需要任何服务端配置
    * **URL 的改变不会导致浏览器向服务器发送请求**
  * **history**:
    * 利用 **HTML5 History API** 来实现 URL 路由。
    * 在服务器端配置 history 模式主要是为了解决直接访问或刷新非根路径下的页面时，服务器返回 404 错误的问题。这是因为在 history 模式下，URL 是正常的路径，服务器会尝试去寻找对应的文件。如果找不到，就会返回 404 错误。解决这个问题的方法是配置服务器，**对于所有的页面请求，都返回同一个 HTML 文件，通常是你的 Vue 应用的入口文件**。
    * `location / {try_files $uri $uri/ /index.html;}`
    * `app.get('*', (req, res) => {`
        `res.sendFile(path.resolve(__dirname, 'index.html'));`
      `});`
  * **abstract**:
    * 实现一个抽象的路由，在不同环境中使用不同的实现。
    * 适用于所有JavaScript环境，例如服务器端使用Node.js\如果没有浏览器API，路由器将自动被强制进入此模式
    * 主要用于服务器端渲染或者在不支持 HTML5 History API 和 hash 改变的环境中
    * Vue Router 2.0 及之后的版本中，已经移除了 abstract 模式
  * **路由传参**
    * Router-LINK
    * params ,name
    * query , path
    * /:id
  * **全局守卫：**
    * router.beforeEach （判断是否登录、全局路由loading）、router.beforeResolve、router.beforeEnter、router.afterEach（跳转之后滚动条回到顶部）
  * **组件内部钩子：**
    * beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave
  * **单个路由钩子：**
    * beforeEnter、beforeResolve、beforeLeave、afterEnter、afterResolve、afterLeave





  

activeclass是哪个组件的属性，嵌套路由怎么定义？
