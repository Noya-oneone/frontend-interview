# <meta> 标签

| 特性                | 描述                                       |
|---------------------|--------------------------------------------|
| **作用**            | 控制网页在移动设备上的缩放和显示方式           |
| **基本格式**        | `<meta name="viewport" content="...">`      |
| **常用属性**        | `width`, `height`, `initial-scale`, `maximum-scale`, `minimum-scale`, `user-scalable` |
| **`width` 属性**    | 设定视口的宽度。常用值有 `device-width` 或具体像素值 |
| **`height` 属性**   | 设定视口的高度。通常使用 `device-height` 或具体像素值 |
| **`initial-scale` 属性** | 设置初始缩放比例，例如 `1` 表示100%            |
| **`maximum-scale` 属性** | 设置最大缩放比例，例如 `3` 表示300%            | 
| **`minimum-scale` 属性** | 设置最小缩放比例，例如 `0.5` 表示50%           |
| **`user-scalable` 属性** | 设置用户是否可以缩放网页，`yes` 允许缩放，`no` 禁止缩放 |
| **示例**            | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| **主要用途**        | 提供良好的移动设备浏览体验，确保页面在不同设备上可读性和操作性 |


## 网页元数据

### SEO、社交分享预览以及浏览器行为控制
* 页面描述：通过 <meta name="description" content="..." /> 标签，描述网页内容，常用于搜索引擎结果摘要。
* 关键词：通过 <meta name="keywords" content="..." /> 标签，指定与网页内容相关的关键词，已不常用。
* 作者信息：通过 <meta name="author" content="..." /> 标签，标明网页作者。

### 响应式
* 视口设置：通过 <meta name="viewport" content="..." /> 标签，控制网页在不同设备上的显示方式。
    * <meta name="viewport" content="width=device-width, initial-scale=1.0">
    * width=device-width（设定视口宽度为设备宽度）
    * initial-scale=1.0（设定初始缩放比例）。

### 网页编码格式
* 编码设置：通过 <meta charset="UTF-8"> 标签，指定网页的编码格式。
* UTF-8 是一种`可变长度`的字符编码格式
    * 对 ASCII 字符使用 1 个字节
    * 对非 ASCII 字符使用 2 到 4 个字节

`Referer`：发起请求的页面的 URL， Referer 头部在 HTTP 请求中`提供了用户来源的上下文`，可以用于安全验证、流量分析等目的。

<!-- HTML 页面中的 Referrer-Policy 设置 -->
<meta name="referrer" content="no-referrer">