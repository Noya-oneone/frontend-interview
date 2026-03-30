# Canvas & SVG

## 一、Canvas

### 基本概念

Canvas 是**位图**（像素），通过 JavaScript 绘制，适合动态渲染大量图形（游戏、图表、图片处理）。

```html
<canvas id="c" width="500" height="300"></canvas>
```

### 宽高设置：属性 vs CSS

| 方式 | 效果 |
|------|------|
| `<canvas width="500">` | 设置绘图区域分辨率（像素） |
| `style="width: 500px"` | 设置显示尺寸（CSS 缩放），不改变分辨率 |

**坑：** 只用 CSS 设宽高会导致绘图模糊，因为默认分辨率是 300×150。应该同时设属性和 CSS。

### 常用 API

```javascript
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

// 矩形
ctx.fillStyle = '#f00';
ctx.fillRect(10, 10, 100, 50);

// 路径
ctx.beginPath();
ctx.arc(150, 75, 50, 0, Math.PI * 2);
ctx.fill();

// 文字
ctx.font = '20px sans-serif';
ctx.fillText('Hello', 10, 120);

// 图片
const img = new Image();
img.onload = () => ctx.drawImage(img, 0, 0);
img.src = 'photo.jpg';
```

### Canvas 图片压缩

```javascript
function compressImage(file, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
```

---

## 二、SVG

### 基本概念

SVG 是**矢量图**（XML 描述），缩放不失真，适合图标、Logo、数据可视化。

```html
<svg width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#e91e63" />
  <text x="50" y="55" text-anchor="middle" fill="#fff" font-size="14">Hello</text>
</svg>
```

### 常用元素

| 元素 | 用途 |
|------|------|
| `<rect>` | 矩形 |
| `<circle>` | 圆形 |
| `<ellipse>` | 椭圆 |
| `<line>` | 直线 |
| `<polyline>` | 折线 |
| `<polygon>` | 多边形 |
| `<path>` | 路径（最强大，可画任意形状） |
| `<text>` | 文本 |
| `<g>` | 分组 |
| `<use>` | 复用 |

### SVG 使用方式

```html
<!-- 1. 内联 -->
<svg>...</svg>

<!-- 2. img 标签 -->
<img src="icon.svg" alt="icon" />

<!-- 3. CSS 背景 -->
background-image: url('icon.svg');

<!-- 4. object 标签（可交互） -->
<object type="image/svg+xml" data="icon.svg"></object>
```

---

## 三、Canvas vs SVG 对比

| 维度 | Canvas | SVG |
|------|--------|-----|
| 类型 | 位图（像素） | 矢量图（XML） |
| 渲染 | JavaScript 绘制 | 浏览器解析 DOM |
| 缩放 | 会模糊 | 不失真 |
| 事件 | 只能监听整个 canvas | 每个元素可绑事件 |
| 动画 | requestAnimationFrame | CSS / SMIL / JS |
| DOM | 无 DOM 节点 | 每个图形是 DOM 节点 |
| 性能 | 图形多时更快 | 图形多时 DOM 负担重 |
| SEO | 不可索引 | 可索引 |
| 无障碍 | 差（需 aria） | 好（语义化） |

### 选择建议

| 场景 | 选择 |
|------|------|
| 游戏、粒子特效 | Canvas |
| 图表（大数据量） | Canvas |
| 图片处理/滤镜 | Canvas |
| 图标系统 | SVG |
| Logo、插图 | SVG |
| 地图 | SVG（交互多）/ Canvas（数据量大） |
| 图表（交互多） | SVG（D3.js） |

---

## 四、高频面试题

### Q1: Canvas 和 SVG 的区别？

Canvas 是位图、JS 绘制、无 DOM、适合大量图形和游戏；SVG 是矢量图、XML 描述、有 DOM、适合图标和需要交互的场景。

### Q2: Canvas 为什么会模糊？怎么解决？

CSS 设宽高不改变画布分辨率（默认 300×150）。解决：用属性设宽高，或者考虑 devicePixelRatio：

```javascript
const dpr = window.devicePixelRatio || 1;
canvas.width = 500 * dpr;
canvas.height = 300 * dpr;
canvas.style.width = '500px';
canvas.style.height = '300px';
ctx.scale(dpr, dpr);
```

### Q3: SVG 有哪些使用方式？各有什么区别？

内联（可 JS 操作）、img（简单展示，不可交互）、CSS 背景（装饰用）、object（可交互，有沙箱）。
