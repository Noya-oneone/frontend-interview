
## React 18

**并发模式（Concurrent Mode**）‌：
React 18 全面启用了**并发模式，这是一种异步可中断的更新机制**，它允许 React 在执行渲染和布局时可以中断和恢复任务，从而提供更平滑和响应式的用户体验
这使得 React 应用能够在用户交互和数据处理之间取得更好的平衡，特别是在**处理缓慢的操作（如异步请求）时，不会阻塞用户界面的响应**1。

**新的渲染 API**：React 18 引入了 **createRoot** 方法，用于创建根 React 实例2。与之前的 ReactDOM.render 方法相比，
使用 createRoot 可以自动启用并发模式，并提供了一系列并发模式下的新特性13。

**自动批处理**：React 18 对状态更新进行了优化，所有的状态更新现在都会自动进行批处理，无论是来自事件处理函数、Promise 链还是原生事件处理3。这意味着在多个状态更新发生时，React 会尽可能地合并这些更新，以减少不必要的渲染，从而提高性能1。

**Suspense 支持 SSR**：React 18 增强了 Suspense 组件的功能，使其支持服务端渲染（SSR）
这意味着在服务端渲染过程中，组件可以根据数据的可用性逐步渲染，从而加快首屏加载速度，并改善用户体验1。

**新的 Hooks**：React 18 引入了几个新的 Hooks，如 useTransition、useDeferredValue 和 useId。
  **useTransition** 允许开发者在处理潜在的延迟操作时控制异步更新的优先级，
  **useDeferredValue** 可以将某个状态的更新推迟到未来的帧中，这对于处理与用户输入相关的操作非常有用1。
  **useId** 则用于生成稳定的唯一 ID，这在服务端渲染中尤其有用，因为它可以确保在客户端和服务端生成相同的 ID23。

提供给第三方库的 Hooks：React 18 还为第三方库提供了一些专用的 Hooks，如 useSyncExternalStore 和 useInsertionEffect。这些 Hooks 分别用于同步外部状态存储和优化 CSS-in-JS 库的性能3。
