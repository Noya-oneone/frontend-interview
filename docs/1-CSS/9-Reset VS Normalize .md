# reset.css VS normalize.css

## 核心区别

| 特性 | CSS Reset | Normalize.css |
|--|--|--|
| **目的** | `清零`浏览器默认样式，从白纸开始 | `统一`各浏览器差异，`保留有用的默认样式` |
| **手段** | 粗暴归零（margin/padding 全 0，标题字号拉平） | 精准修补：只改有差异或有 bug 的地方 |
| **代价** | 所有元素样式需重新定义（h1 和 p 长得一样） | 几乎零成本，语义元素开箱可用 |
| **可读性** | 一堆通配规则 | 每条规则都有注释说明修的是哪个浏览器的什么问题 |
| **典型代码** | `* { margin: 0; padding: 0; }` | `h1 { font-size: 2em; margin: 0.67em 0; }` |

## 现状与演进

* 老式激进 reset（Eric Meyer Reset）已少用；`normalize.css` 曾是标配（Bootstrap 4 的 Reboot 基于它）。
* 现代项目常用`折中方案`：
  * `modern-normalize`：normalize 的精简现代版（放弃老 IE）。
  * Tailwind 的 `Preflight`、各设计系统自带的 base 层：normalize + 少量有主见的 reset（如 `box-sizing: border-box` 全局化）。

```css
/* 当代项目常见的最小 base 层 */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
img, video { max-width: 100%; display: block; }
```

## 常见考点

* **选哪个？** 强定制设计系统（所有元素都会重定义）→ reset 思路；常规业务 → normalize / modern-normalize 底座 + 项目级 base 补充。
* **为什么全局 `box-sizing: border-box`？** 让 width 即所见宽度（含 padding/border），布局心智简单，见 [盒模型](../0-HTML/1-BFC、盒模型（flex&grid）.md)。
