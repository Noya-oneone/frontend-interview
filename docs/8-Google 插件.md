## Google 插件

### 第一步： 创建  manifest.json 

* - 有必须属性（Require）、推荐属性(Recommended)、和可选择配置属性(optional)

* background
  - 在清单中注册一个后台脚本会告诉扩展程序引用哪个文件，以及该文件应该如何运行。
  - 用于的脚本"service_worker"必须位于扩展的根目录中。
  - 您可以选择指定一个额外的字段，"type": "module"以将service_worker含为 ES 模块，这允许您import进一步编码。

* web_accessible_resources

* permission 、optional_permissions、host_permissions

* content_security_policy

* externally_connectable

### 第二步：建立入口文件、写代码
### 第三步： 调试Google 插件
### 第四步：发布Google插件
 
## Chrome 插件开发 通信
```javascript
// 1、content_scripts和background的通信
- 接收消息：`chrome.runtime.onMessage.addListener`
- 发送消息：`chrome.runtime.sendMessage`
// 2、background.js 和右上角弹出框的通信

- 在background中: `chrome.extension.getViews()` 获取当前插件内每个运行页面的窗口数组([window, window])
- 在右上角弹出框中：c`hrome.extension.getBackgroundPage()` 获取背景页面的窗口对象(window)

// 3、右上角弹出框和content_scripts之间的通信
- 右上角弹出框：chrome.tabs.connect，链接content_scripts的脚本通信
- content_scripts：`chrome.runtime.onConnect`
```

