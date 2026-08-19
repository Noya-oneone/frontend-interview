# `<img>` & Base64

## 图片格式对比

| 格式 | 优点 | 缺点 | 适用场景 |
|--|--|--|--|
| **WebP** | 高压缩率，支持有损/无损、透明和动画（Google 开发） | 老旧浏览器不支持（现代浏览器已全面支持） | `现代网页的默认选择` |
| **AVIF** | 压缩率比 WebP 更高，`支持透明和 HDR` | 兼容性仍在铺开，编解码较慢 | 追求极致体积的现代站点 |
| **JPEG/JPG** | 高压缩比，适合`色彩丰富`的照片 | `有损压缩`，不支持透明 | 照片类图像 |
| **PNG** | `无损压缩`，支持透明 | 体积较大 | 需要透明或像素精确的图标、截图 |
| **GIF** | 支持动画，兼容性极好 | 只有 256 色，体积大 | 简单动图（现多被 WebP/视频替代） |
| **SVG** | 矢量、无限缩放、`体积小`、可用 CSS/JS 控制 | 不适合表现照片级复杂图像 | 图标、Logo、简单插图 |

### 渐进增强写法

```html
<picture>
  <source srcset="photo.avif" type="image/avif" />
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.jpg" alt="产品照片" loading="lazy" width="800" height="600" />
</picture>
```

* `loading="lazy"`：原生懒加载视口外图片。
* 显式写 `width / height`（或 CSS `aspect-ratio`）：预留占位，避免布局偏移（CLS）。

## alt 和 title 的区别（高频考点)

| | `alt` | `title` |
|--|--|--|
| 作用 | 图片`无法显示时的替代文本` | 鼠标悬停时的提示气泡 |
| 无障碍 | 屏幕阅读器朗读的内容，**必写**（纯装饰图写 `alt=""`） | 辅助技术支持不稳定，不能替代 alt |
| SEO | 参与图片搜索索引 | 权重可忽略 |
| 适用元素 | `<img>`、`<area>`、`<input type="image">` | 几乎所有元素 |

## Base64 编码

* Base64 是把`二进制数据`转换为 `64 个可打印 ASCII 字符`文本的编码方式（不是加密、不是压缩）。
* 用途：在`只支持文本的环境`中传输二进制（JSON、HTML、XML、邮件 MIME）；网页中以 Data URI 内嵌小图，省一次 HTTP 请求。
* **代价：体积膨胀约 33%**（3 字节变 4 字符），且无法被浏览器单独缓存 —— 只适合内嵌`小图标`，大图得不偿失。

### 编码过程

1. 将二进制数据按`每 3 字节（24 位）`分组。
2. 24 位拆成 `4 组 × 6 位`。
3. 每组 6 位映射为一个 Base64 字符（字符集 `A-Z a-z 0-9 + /`）。
4. 末尾不足 3 字节时用 `=` 填充，保证长度是 4 的倍数。

```ts
const encoded = btoa('Hello, World!');  // "SGVsbG8sIFdvcmxkIQ=="
const decoded = atob(encoded);          // "Hello, World!"

// btoa 只接受 Latin-1，含中文需先转码
const zh = btoa(String.fromCharCode(...new TextEncoder().encode('你好')));

// 文件转 Data URL（常用于图片预览）
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);  // 结果形如 data:image/png;base64,iVBOR...
  });
}
```

### 使用场景

* 内嵌小图标 / 字体（Data URI，构建工具通常设 8KB 左右阈值自动内联）
* 在 JSON / URL 中携带二进制数据
* 邮件附件（MIME）

## 常见考点

* **Base64 是加密吗？** 不是，任何人都能解码；也不是压缩，体积反而 +33%。
* **什么时候该用 Base64 内嵌图片？** 只有体积小、复用率低的图；大图内嵌会阻塞 HTML/CSS 下载且无法独立缓存。
* **图片懒加载的实现方式？** 原生 `loading="lazy"`；自定义用 `IntersectionObserver` 进入视口再赋值 `src`。

## 拓展阅读

* [MDN - Image file type and format guide](https://developer.mozilla.org/zh-CN/docs/Web/Media/Guides/Formats/Image_types)
* [MDN - Base64](https://developer.mozilla.org/zh-CN/docs/Glossary/Base64)
