# <a>标签


* 禁用链接或让 <a> 标签不进行导航

| 方法| 描述 | 影响 |
|-----------|------|---------|
| **删除 `href` 属性**| 将 `href` 属性删除或设置为空字符串 (`href=""`)。 | `<a>` 标签将不再有超链接功能。 |
| **使用 `javascript:void(0)`** | 设置 `href` 属性为 `javascript:void(0);`。 | 禁用默认导航行为，但链接仍可点击。|
| **使用 `#`**| 设置 `href` 属性为 `#`。 | 会滚动到页面顶部，但不会导航到新页面。|
| **使用 `pointer-events: none`** | 使用 CSS 属性 `pointer-events: none;`。| 禁用所有鼠标事件，包括点击。|
| **使用 `onclick` 事件** | 在 `onclick` 事件处理程序中返回 `false` 或 `event.preventDefault()`。 | 阻止默认行为，使链接不执行导航。 |
| **使用 `role="button"` 和 `tabindex`** | 使用 `role="button"` 使其看起来像按钮，并设置 `tabindex="-1"`。 | 链接仍然可被访问，但看起来更像一个按钮。|

