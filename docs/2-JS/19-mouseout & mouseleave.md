# mouseout & mouseleave

## 核心区别

| | `mouseover / mouseout` | `mouseenter / mouseleave` |
|--|--|--|
| **触发条件** | 进入/离开元素`或其任一子元素`都会触发（从父元素移到子元素也算一次 out + over） | 只在`真正进入/完全离开`元素边界时触发一次，`在子元素间移动不触发` |
| **是否冒泡** | ✅ 冒泡 | ❌ 不冒泡 |
| **触发频率** | 子元素多时频繁触发 | 每次进出各一次 |

一句话：`mouseout` 会被子元素「打扰」，`mouseleave` 不会。

## 使用场景（注意别选反）

* **下拉菜单：鼠标离开整个菜单（含子菜单）才关闭** → 用 `mouseleave`。若用 mouseout，鼠标从菜单移到子菜单项就会误触发关闭。
* **事件委托：一个监听器处理一批子元素的悬停** → 用 `mouseover / mouseout`（它们冒泡，可以委托到父容器，用 `e.target` 判断落点）。

```js
// mouseleave：离开整个菜单才收起
menu.addEventListener('mouseleave', () => menu.classList.remove('open'));

// mouseover 委托：高亮列表中被悬停的行
list.addEventListener('mouseover', (e) => {
  const row = e.target.closest('li');
  if (row) row.classList.add('hover');
});
```

## 阻止事件冒泡

* `event.stopPropagation()`：阻止事件继续向上冒泡到父元素。
* `event.stopImmediatePropagation()`：除了阻止冒泡，还阻止`当前元素上后续注册的其他监听器`执行 —— 同一元素绑了多个处理函数、需要「一票否决」时使用。

## 常见考点

* **为什么 hover 菜单闪烁？** 用了 mouseout —— 移入子元素触发了「离开」；换 mouseleave 或判断 `e.relatedTarget` 是否仍在容器内。
* **`e.relatedTarget` 是什么？** mouseover 时表示来自哪个元素，mouseout 时表示去往哪个元素，可用于精确判断移动方向。
* **CSS 能替代吗？** 纯展示型 hover 优先 `:hover`（子元素移动天然不闪烁），需要 JS 逻辑时才用事件。
