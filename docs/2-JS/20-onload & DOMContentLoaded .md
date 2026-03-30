# onload & DOMContentLoaded

| 事件 | 触发时机 | 目标对象|
|----|----|-----|
| `onload` | `页面及所有资源（如图片、样式表等）完全加载后触发` | `window` 或 `image` 等 
| `DOMContentLoaded` | `DOM 完全加载和解析`完成后触发，但不等待样式表、图片等资源加载 |

```js
    // 页面中有图片，则使用 onload 事件
    <img src="large-image.jpg" alt="Large Image">
    <script>
        window.onload = function() {
        // 确保所有资源（包括图片）都加载完成后执行
        const img = document.getElementById('large-image');
        console.log('Page fully loaded');
        console.log('Image dimensions:', img.width, img.height);
        };
    </script>

  {/* 在 DOM 加载完成后立即操作 DOM 元素或绑定事件 */}
    <script>
        document.addEventListener('DOMContentLoaded', function() {
        // DOM 结构加载完成后立即执行
        const contentDiv = document.getElementById('content');
        contentDiv.style.color = 'blue';  // 修改 DOM 元素样式
        console.log('DOM fully loaded and parsed');
        });
    </script>
```