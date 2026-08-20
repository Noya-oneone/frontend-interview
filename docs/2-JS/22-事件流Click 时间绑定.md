# 事件流与 Click 事件绑定

## 事件流三阶段

事件流描述页面`接收事件的顺序`：

1. **捕获阶段（Capturing）**：从 `window → document → ... 沿 DOM 树向下`传到目标元素的父级 —— 点击子元素时，父元素以`捕获方式`注册的监听器先触发。
2. **目标阶段（Target）**：到达实际触发事件的元素。
3. **冒泡阶段（Bubbling）**：从目标元素`沿 DOM 树向上`传回 document —— 父元素以默认（冒泡）方式注册的监听器此时触发。

```js
// 第三个参数：true = 捕获阶段触发，false（默认）= 冒泡阶段触发
parent.addEventListener('click', onCapture, true);
parent.addEventListener('click', onBubble, false);
```

捕获阶段的典型用途：在事件`到达目标之前拦截`（全局权限控制、统一埋点），以及监听那些`不冒泡`的事件（如 focus/blur 用捕获实现委托）。

## 触发顺序示例

```html
<div id="div1">
  <p id="p1">我是p1</p>
</div>
<script>
  div1.onclick = () => console.log('div1 onclick');                        // 冒泡
  div1.addEventListener('click', () => console.log('div1 冒泡监听'));       // 冒泡
  div1.addEventListener('click', () => console.log('div1 捕获监听'), true); // 捕获
</script>
```

* **点击 p1**（div1 是祖先）：`div1 捕获监听` →（p1 自身监听器）→ `div1 onclick` → `div1 冒泡监听`。捕获先于冒泡。
* **点击 div1 空白处**（div1 即目标）：处于`目标阶段`，捕获/冒泡标记不再区分先后，按`注册顺序`执行：`div1 onclick` → `div1 冒泡监听` → `div1 捕获监听`。

## 两种绑定方式

| 方式 | 写法 | 特点 |
|--|--|--|
| DOM0 直接绑定 | `el.onclick = fn` | 只能绑一个（后赋值覆盖前者），只在冒泡阶段 |
| DOM2 监听器 | `el.addEventListener('click', fn, options)` | 可绑多个、可选捕获/冒泡、可 `removeEventListener`、支持 `once / passive` 选项 |

## 阻止传播与默认行为

* `event.stopPropagation()`：阻止事件继续传播（捕获或冒泡都停）。
* `event.stopImmediatePropagation()`：额外阻止`当前元素上后续注册的监听器`。
* `event.preventDefault()`：阻止默认行为（表单提交、链接跳转），`不影响传播` —— 两者职责不同，别混淆。

## 事件委托（高频考点）

利用冒泡，把大量子元素的监听收敛到父容器上：

```js
// 1000 行的列表只需 1 个监听器；动态新增的行自动生效
list.addEventListener('click', (e) => {
  const item = e.target.closest('li');
  if (item && list.contains(item)) {
    console.log('点击了', item.dataset.id);
  }
});
```

优点：省内存（监听器数量 O(1)）、动态子元素无需重新绑定。注意：`e.target` 是实际点击的最深元素，`e.currentTarget` 是绑定监听器的元素。

## 常见考点

* **哪些事件不冒泡？** `focus / blur`（委托用 focusin/focusout 或捕获）、`mouseenter / mouseleave`、load、unload。
* **`once: true` 与 `passive: true`？** 前者触发一次后自动移除；后者承诺不调用 preventDefault，让浏览器不必等 JS 就滚动（滚动性能优化）。
* **React 的合成事件？** React 17+ 把事件统一委托到根容器（17 前是 document），自建合成事件系统抹平浏览器差异。
