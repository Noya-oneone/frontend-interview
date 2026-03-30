## useEffect

react 副作用：
**发起网络请求**：这是一个异步操作，它可能会改变组件的状态。
**订阅事件**：订阅的事件可能在任何时候触发，导致组件的状态改变。
**修改 DOM**：虽然在 React 中我们通常不直接操作 DOM，但在某些情况下，如使用第三方库或进行性能优化时，可能需要直接操作 DOM。
**使用定时器**：定时器可能在任何时候触发，导致组件的状态改变。

生命周期： componentDidMount（传入空数组） componentDidUpdate（不传参数） componentWillUnmount（return）
在编程中，"副作用"（Side Effect）是指函数或表达式在计算结果的同时，对外部世界产生的影响。这种影响可能是**修改了全局变量**，改变了某个对象的状态，或者执行了诸如 **I/O 操作**等。

| 生命周期阶段         | `useEffect` | `useLayoutEffect` |
|--------------------|----------|-----|
| **创建**| `useEffect(() => { }, [])` | `useLayoutEffect(() => {  }, [])` |
| **挂载** | `useEffect(() => {  }, [])` | `useLayoutEffect(() => {  }, [])` |
| **更新**| `useEffect(() => {  }, [deps])` | `useLayoutEffect(() => {  }, [deps])` |
| **卸载**| `useEffect(() => { return () => {  } }, [])` | `useLayoutEffect(() => { return () => { } }, [])` |
| **错误处理**| `useEffect` 和 `useLayoutEffect` 本身没有错误边界功能，需要在组件外部处理 | 同上 |
