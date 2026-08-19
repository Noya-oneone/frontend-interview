# `<label>` 标签

## 核心作用

| 特性 | 描述 |
|--|--|
| **描述控件** | 为表单控件提供描述性标签，帮助用户理解控件用途 |
| **扩大点击区域** | 点击 label 时，关联控件获得焦点（输入框）或被切换（checkbox / radio），减少操作成本 |
| **无障碍** | 屏幕阅读器聚焦控件时会朗读关联的 label 文本，符合 WCAG 要求 |

## 两种绑定方式

```html
<!-- 1. 显式绑定：for 指向控件的 id -->
<label for="username">用户名</label>
<input type="text" id="username" name="username" />

<!-- 2. 隐式绑定：label 直接包裹控件，无需 id -->
<label>
  <input type="checkbox" name="agree" /> 同意用户协议
</label>
```

* 显式绑定适合 label 与控件在布局上分离的场景（如表单左右两栏）。
* 隐式绑定写法更简洁，checkbox / radio 常用。

## 常见考点

* **为什么 checkbox 一定要配 label？** 裸 checkbox 点击热区只有十几像素，label 让整行文字可点击，移动端体验差距明显。
* **一个 label 能绑定多个控件吗？** 不能，`for` 只关联一个 id；但一个控件可以被多个 label 引用（不推荐）。
* **点击 label 触发了两次 click 事件？** 隐式绑定时点击 label 会把事件`转发`给控件，事件委托里要注意用 `e.target` 判断实际来源。
