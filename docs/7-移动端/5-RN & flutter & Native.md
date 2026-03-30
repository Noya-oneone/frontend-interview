# flutter & react native & Native 

flutter Dart语言： Google
react native JavaScript语言 : Facebook
Native: IOS  & Android: Apple & Google

## Flutter、React Native 和 Native 开发语言对比

| 特性 | Flutter | React Native | Native |
|---|---|---|---|
| 编程语言 | Dart | JavaScript | Swift (iOS), Kotlin/Java (Android) |
| 开发速度 | 快速 | 快速 | 较慢 |
| 性能 | 接近原生 | 接近原生 | 原生性能 |
| 跨平台支持 | 优秀 | 优秀 | 不支持 |
| 热重载 | 支持 | 支持 | 不支持 |
| UI一致性 | 高 | 中等 | 高 |
| 社区支持 | 逐渐增长 | 成熟 | 成熟 |
| 学习曲线 | 平滑 | 平滑 | 较陡 |
| 支持厂家 | Google | Facebook | Apple (iOS), Google (Android) |

## 底层原理对比

| 特性 | Flutter | React Native | Native |
|---|---|---|---|
| 渲染方式 | Skia 图形引擎 | 原生组件 | 原生渲染 |
| 编译方式 | AOT 和 JIT 编译 | JIT 编译 | AOT 编译 (iOS), JIT 编译 (Android) |
| 代码运行 | Dart VM | JavaScriptCore（iOS），Hermes（可选，Android） | 原生运行 |
| 桥接机制 | 无需桥接，直接绘制到屏幕 | 通过桥接调用原生组件 | 无需桥接 |
| 性能优化 | 高度优化的绘制和编译过程 | 依赖于 JavaScript 运行时优化 | 原生优化 |
| 内存管理 | Dart 的垃圾回收机制 | JavaScript 的垃圾回收机制 | iOS 使用 ARC，Android 使用垃圾回收 |


![alt text](image.png)

![alt text](image-1.png)

* 都是表现层
* 使用的语法不一样
* 需要大量的不同经验的人进来解决对应的问题
* AI系统


* **Flutter 和 react Native 的优劣**
  * 性能优秀：Flutter 使用 **Dart 语言**，拥有**自己的渲染引擎**，因此在运行效率和性能上优于 React Native。
  * Flutter 使用的渲染引擎是 Skia。
  * **Skia 是一个开源的 2D 图形处理库**，包括字体、文本、路径、图片、效果等，由 **Google**开发并维护。Skia 提供了一套完整的 API，Flutter 通过这套 API 实现了所有的 UI 绘制。这也是为什么 Flutter 可以跨平台并保持 UI 的一致性的原因。
  * UI 一致性：Flutter 自带一套丰富的 Widget，可以保证在不同平台上的 UI 一致性。
  * 热重载：Flutter 支持热重载，可以在开发过程中实时看到修改的效果。
  * React Native javascript
  * flutter包直接嵌入React native 包里面

在Flutter与React Native（RN）之间的技术选型问题上，实际上并没有绝对的“最优解”，因为这主要取决于具体项目的需求、团队的技能和经验、以及期望的应用性能和用户体验等因素

**1. 性能表现：**
Flutter：在渲染技术上，Flutter选择了自己实现GDI，并且使用了新的语言Dart。这种设计避免了通过桥接器与JavaScript通讯导致的效率低下问题，因此在性能方面通常优于RN。特别是在低端手机上，Flutter的性能优势更为明显。
React Native：RN的效率通过将View编译成原生View来提高，这使其效率高于基于Cordova的HTML5。然而，RN的渲染机制基于前端框架的考虑，对于复杂的UI渲染需要依赖多个view叠加，这可能导致在某些情况下性能不如Flutter。

**2. 第三方库支持：**
React Native：由于RN出现时间较早，一些库可以与Web共用，因此在第三方库支持方面，RN可能优于Flutter。然而，这也可能导致在项目中出现重复造轮子的情况。
Flutter：尽管Flutter的生态系统在不断扩大，但与RN相比，它可能在某些方面仍显得稍显不足。

**3. 热更新：**
React Native：RN支持热更新，这对于需要频繁更新应用内容的场景来说是一个重要优势。热更新可以减少用户下载和安装更新的麻烦，提高用户体验。
Flutter：目前Flutter暂不支持热更新，这可能在某些情况下成为选择Flutter的阻碍。

**4. 学习曲线与团队技能：**
Flutter：Flutter使用Dart语言，这对于已经熟悉Java或C++的开发者来说可能是一个新的学习曲线。然而，Dart语言的简洁和强大也可能吸引一些开发者。
React Native：RN使用JavaScript和React，这对于已经熟悉Web开发的团队来说可能更容易上手。然而，这也可能引入一些与原生开发相关的问题和挑战。

**uni-app** 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。
