# 单例模式（Vuex store & Redux store）

## 定义
* 单例模式（Singleton Pattern）：保证一个类仅有一个实例，并提供一个全局访问点。
* `不能重复` new Store() 来`创建多个实例`。
* 即使你`多次调用 new Store()，也应该只返回已经存在的那个唯一实例`，而不会创建新的实例。

## 场景
* 全局状态管理（Vuex store）
* 事件管理（Redux store）

## 实现方式
* Vuex store：使用单例模式实现全局状态管理，将共享的状态存储在单例对象中，并通过全局访问点对外提供访问接口。
* Redux store：使用单例模式实现事件管理，将共享的事件存储在单例对象中，并通过全局访问点对外提供访问接口。


## 优点
* 保证一个类仅有一个实例，避免因实例化过多而造成内存开销过大。
* 提供一个全局访问点，方便其他模块访问实例。

```javascript
class Store {
    constructor() {
        if (Store.instance) {
            return Store.instance;
        }

        // 初始状态
        this.state = {
            user: null,
            theme: 'light',
        };

        Store.instance = this; // 缓存实例
    }

    // 获取 state 的方法
    getState() {
        return this.state;
    }

    // 更新 state 的方法
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
}

// 获取单例 store 的方法
const getStoreInstance = () => {
    return new Store();
};

// 使用示例

// 第一次获取 store 实例
const store1 = getStoreInstance();
console.log(store1.getState()); // 输出: { user: null, theme: 'light' }

// 更新 store 的 state
store1.setState({ user: 'John Doe' });
console.log(store1.getState()); // 输出: { user: 'John Doe', theme: 'light' }

// 再次获取 store 实例
const store2 = getStoreInstance();
console.log(store2.getState()); // 输出: { user: 'John Doe', theme: 'light' }

// 检查 store1 和 store2 是否是同一个实例
console.log(store1 === store2); // 输出: true
```

