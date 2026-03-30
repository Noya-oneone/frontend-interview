# composition api

* Composition API 是 Vue 3.0 一种新的组件逻辑组织方式，主要是相对于 Vue 2.x 中使用的 Options API 而言的

## 逻辑复用
* 它允许开发者将组件内相关的逻辑提取到一个独立的函数中，实现逻辑的复用。

## 代码组织
* 按照功能而不是选项来组织代码。在 Options API 中，数据、方法、生命周期钩子等是分散在不同选项中的，而 Composition API 可以将与某个功能相关的代码集中在一起，使代码结构更清晰。

## 核心特征 - 响应式数据
* 通过 reactive 和 ref 函数创建响应式数据。
    * reactive 用于创建对象的响应式版本
    * ref 则常用于创建单个值的响应式数据。

## 更好的类型推导
* 对于使用 TypeScript 的项目，Composition API 提供了更好的类型推导支持，能够减少类型错误，提高开发效率。