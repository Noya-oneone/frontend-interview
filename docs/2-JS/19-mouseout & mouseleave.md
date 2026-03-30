# mouseout & mouseleave

| 属性| `mouseout、mouseover`  | `mouseleave、mouseenter`  |
|---|---|---|
| **触发条件** | 当鼠标指针离开`目标元素或其子元素`时触发  | 当鼠标指针完全离开目标元素时触发（不包括子元素） |
| **事件冒泡** | 会在`目标元素及其子元素上触发`  | 只会在目标元素上触发，不会在子元素上触发 |
| **区别**  | `mouseout` 会触发在目标元素及其子元素上  | `mouseleave` 只会触发在目标元素上|

## mouseout

* 当鼠标`离开整个菜单（包括其子菜单）` 时关闭菜单。

## mouseleave

* 当鼠标从一个`按钮移到按钮的子元素（如图标）`时，需要处理离开的事件。


## 阻止事件冒泡

* 阻止事件冒泡可以确保事件不会继续传播到父元素或其他元素
* `event.stopPropagation()` ： 阻止事件继续向上冒泡到父元素
* `event.stopImmediatePropagation()` ： 阻止事件继续向上冒泡到父元素，同时阻止该元素的其他事件监听器被调用
    * stopImmediatePropagation 会阻止 child 元素上注册的其他点击事件处理程序以及父元素的事件处理程序。
    * 如果定义了多个点击事件的话，可以考虑stopImmediatePropagation