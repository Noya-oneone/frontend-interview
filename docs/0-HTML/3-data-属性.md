# data-* 属性

## 核心概念

* `data-*` 是 HTML5 新增的自定义数据属性，用于在元素上存储页面私有的自定义数据，不影响布局和样式。
* 命名规则：以 `data-` 开头，后跟自定义名称（建议小写 + 连字符）。
* **属性值永远是字符串**：写 `data-age="30"` 读出来是 `"30"`，布尔、数字、对象都需要自行转换（对象/数组要先 `JSON.stringify`）。

```html
<div id="user" data-name="John" data-age="30" data-is-student="true">
  Hello, my name is John and I am 30 years old.
</div>
```

## 读写方式

### dataset（推荐）

`element.dataset` 是一个 DOMStringMap，属性名遵循`驼峰转换规则`：`data-is-student` → `dataset.isStudent`。

```ts
const el = document.querySelector<HTMLDivElement>('#user')!;

// 读
const name = el.dataset.name;                       // "John"
const age = Number(el.dataset.age);                 // 30（手动转数字）
const isStudent = el.dataset.isStudent === 'true';  // true（手动转布尔）

// 写 / 删
el.dataset.role = 'admin';    // 生成 data-role="admin"
delete el.dataset.role;       // 移除该属性
```

### getAttribute / setAttribute

```ts
el.getAttribute('data-name');         // "John"
el.setAttribute('data-age', '31');
```

## 在 CSS 中使用

```css
/* 属性选择器 */
[data-is-student="true"] { color: green; }

/* attr() 把属性值渲染到内容里，常用于纯 CSS tooltip */
[data-tip]:hover::after { content: attr(data-tip); }
```

## 常见考点

* **`dataset` 与 `getAttribute` 的区别？** `dataset` 只能访问 `data-*` 属性且自动做驼峰映射；`getAttribute` 可访问任意属性、名称原样。
* **典型使用场景**：事件委托中携带业务 ID（`data-id`）、埋点参数（`data-track`）、CSS 状态钩子（`[data-state="open"]`）。
* **不要滥用**：大量结构化数据应放在 JS 状态里而非 DOM 属性上；`data-*` 适合少量、与该 DOM 节点强绑定的数据。
