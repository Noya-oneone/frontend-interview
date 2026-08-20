# onload & DOMContentLoaded

| 事件 | 触发时机 | 挂在谁身上 |
|--|--|--|
| `DOMContentLoaded` | `DOM 树构建并解析完成`即触发，不等待图片、样式表等外部资源 | `document` |
| `load` | 页面`所有资源`（图片、样式、iframe 等）加载完毕后触发 | `window`（img、script 等元素也有各自的 load） |

时间线上：`DOMContentLoaded` 总是先于 `load`；`defer` 脚本执行完之后才触发 DOMContentLoaded（详见 [script](../0-HTML/<script>.md)）。

```html
<img id="large-image" src="large-image.jpg" alt="Large Image" />
<script>
  // 需要资源尺寸/内容 → 等 load
  window.addEventListener('load', () => {
    const img = document.getElementById('large-image');
    console.log('Image dimensions:', img.width, img.height);
  });

  // 只操作 DOM 结构、绑定事件 → DOMContentLoaded 足够，更早执行
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('content').style.color = 'blue';
  });
</script>
```

## 常见考点

* **该用哪个？** 绝大多数初始化逻辑用 `DOMContentLoaded`（更早、不被慢图片拖住）；只有依赖资源就绪（读图片尺寸、canvas 绘制外部图）才等 `load`。
* **脚本放在 `</body>` 前还需要监听 DOMContentLoaded 吗？** 不需要 —— 执行到该脚本时 DOM 已解析到这里；模块脚本（`type="module"`）天然 defer，同样保证 DOM 就绪。
* **性能指标关系**：DevTools Network 面板上蓝线是 DOMContentLoaded、红线是 load；两者相距过大通常意味着图片等资源过重。
