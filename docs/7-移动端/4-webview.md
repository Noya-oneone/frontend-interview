# webview

## 区分网页是通过普通浏览器访问还是在 App 的 WebView 中加载的
* 在 App 的 WebView 中，你可以通过设置`自定义的 User-Agent` 来标识请求是来自 WebView 而不是普通的浏览器
* 通过 URL 参数判断: `webView.loadUrl("https://www.example.com?source=app");`
* 通过 JavaScript Bridge 通信
* 专用的文件路径或域名：通过检查 window.location 或 document.referrer 来区分页面访问来源。