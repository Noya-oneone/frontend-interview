# redux

* Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
* 它最大的特点是，它通过一系列的 `reducer 函数来处理 state 的变化`，
* 并`通过 action 来描述 state 的变化`。

Redux 是一个单向数据流的架构，这意味着所有的 state 都只能通过 reducer 函数来修改，而不能直接修改。

Redux 包含以下几个部分：

- Store：Redux 的核心，它保存了应用的所有 state。
- Action：一个描述 state 变化的对象。
- Reducer：一个纯函数，它接收先前的 state 和 action，并返回新的 state。
- Dispatch：一个函数，用来触发 action，将 action 传给 reducer。
- Subscribe：一个函数，用来订阅 store 的变化。

Redux 的工作流程如下：

1. 调用 `createStore` 方法创建一个 Redux store。
2. 调用 `dispatch` 方法触发 action。
3. Store 调用 reducer 函数来计算新的 state。
4. Store 调用订阅函数来更新 UI。

## 举例说明 Redux 的工作流程

假设我们有一个计数器应用，它有两个按钮，分别是加一和减一。

```javascript
const initialState = {
  count: 0
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer);

const render = () => {
  const count = store.getState().count;
  document.getElementById('counter').innerHTML = count;
};

store.subscribe(render);

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});

document.getElementById('decrement').addEventListener('click', () => {
  store.dispatch({ type: 'DECREMENT' });
});
```

在这个例子中，我们创建了一个 Redux store，并订阅了渲染函数。

当用户点击加一按钮时，我们调用 `dispatch` 方法触发一个 `INCREMENT` action，

```javascript
store.dispatch({ type: 'INCREMENT' });
```

1. Store 调用 reducer 函数，并传入当前 state 和 action。
2. Reducer 根据 action 的类型，修改 state 的值。
3. Store 调用订阅函数，并传入新的 state。
4. 订阅函数更新 UI。

当用户点击减一按钮时，我们调用 `dispatch` 方法触发一个 `DECREMENT` action，

```javascript
store.dispatch({ type: 'DECREMENT' });
```

1. Store 调用 reducer 函数，并传入当前 state 和 action。
2. Reducer 根据 action 的类型，修改 state 的值。
3. Store 调用订阅函数，并传入新的 state。
4. 订阅函数更新 UI。


## Redux action 同步 和 异步

Redux action 可以是同步的，也可以是异步的。

* 同步 action 就是指 action 直接修改 state，不需要通过 reducer 函数。
    * 同步只返回一个普通 action 对象。
* 异步 action 就是指 action 触发后，需要通过网络或者其他异步操作来修改 state
    * 而异步操作中途会返回一个 promise 函数。当然在 promise 函数处理完毕后也会返回一个普通 action 对象。thunk 中间件就是判断如果返回的是函数，则不传导给 reducer，直到检测到是普通 action 对象，才交由 reducer 处理。
