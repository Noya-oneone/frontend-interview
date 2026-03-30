# SSR

## Next.js

* 应用程序中的代码流视为单向，换句话说，在响应期间，您的应用程序代码朝一个方向流动：从服务器到客户端

```bash
npx create-next-app@latest

Ok to proceed? (y)
What is your project named? my-app(输入你的项目名)
Would you like to use TypeScript? 选择Yes
Would you like to use ESLint? 选择Yes
Would you like to use Tailwind CSS? 选择no，没用到
Would you like to use `src/` directory? 这边默认推荐选No，我这边无所谓就选个No
Would you like to use App Router? (recommended) 选择Yes
Would you like to customize the default import alias? 这边默认选择否，我喜欢给项目根目录设置个别名，这样方便等项目目录层级深的时候引入，所以选择Yes
What import alias would you like configured? 就用它的默认推荐@/*，后续可以根据自己喜好去tsconfig.json中修改设置多个
```
 
### 路由系统 (约定大于配置)
1. 路由系统：类似Umi，通过文件夹路径
2. 默认page.tsx为页面，同级可放置loading.tsx（服务端组件页面异步数据未加载前）/error.tsx
文件夹为路由路径，页面默认为 page.tsx/jsx

### 传递数据

* `getServerSideProps`： 在服务器上获取数据并将其作为 props 传递给页面组件。
* `getInitialProps`： 在客户端上获取数据并将其作为 props 传递给页面组件。

### 部署

next export命令导出 SSG 的静态文件或使用平台特定的部署工具
* `next build`：编译项目，生成静态文件。
* `next start`：启动项目，监听文件变化并自动编译。
* `next export`：导出静态 HTML 文件。


* `CSR`: 客户端呈现 (CSR) 是在从服务器接收到初始 HTML、CSS 和 JavaScript 后，使用JavaScript在客户端浏览器上呈现网页的过程。
* `SSR`: SSR 和 CSR 之间的主要区别在于，SSR 向客户端浏览器发送一个完全呈现的 HTML 页面，而 CSR 发送一个由 JavaScript 填充的空 HTML 页面。
    * 服务器处理路由并将预渲染的页面发送给客户端，从而实现更快的页面加载和`更好的 SEO`。
    * 包括`服务器端渲染`、`自动代码拆分`、`静态站点生成`、`动态导入`、`优化的性能和易于部署`
* `SSG`: 静态网站生成 (SSG) 是在构建时为网站上的每个页面生成静态 HTML、CSS 和 JavaScript 文件的过程。 SSG 和 SSR 之间的主要区别在于，SSG 生成可从`内容分发网络 (CDN) 提供的静态文件`，而 SSR `在服务器上动态生成 HTML` 并将其发送到客户端的浏览器。