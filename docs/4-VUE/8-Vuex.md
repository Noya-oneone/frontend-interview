# 状态管理

状态管理 Vuex

* **状态管理 Vuex**
  * **nameSpace Module**： Vuex store 分割成模块（modules）。每个模块拥有自己的 state、mutation、action、getter，甚至可以嵌套子模块。
  * **Store**： Vuex 的状态存储是响应式的
  * **Getter：**： Getter 类似于 Vue 的计算属性
  * **Mutation**：Mutation 是更改 store 中状态的唯一方法
  * **Action：** Action 类似于 mutation，不同在于，Action 提交的是 mutation，而不是直接变更状态。Action 可以包含任意异步操作，**比如 API 调用**。
  
  * vuex：刷新就消失、响应式、组件内部传值 （**VUEX 存储在内存**）
  * localstorage：跨页面传递参数、刷新不消失 （**以文件的方式存储在本地-浏览器存储**） 用户的偏好设置、浏览记录、搜索历史
  * sessionStorage：跨页面传递参数、刷新不消失 （**以文件的方式存储在本地-浏览器存储**）
  * cookie：跨页面传递参数、刷新不消失、大小
  * IndexedDB:IndexedDB 则可以用来存储大量的数据，如用户的邮件、文档等，或者离线应用所需的所有数据。
  
* **Pina & Vuex**
  * 状态树：Vuex 使用单一状态树，所有的状态都存储在一个大的对象中。而 Pina 使用多状态树，每个模块都有自己的状态和方法。
  * 模块化：在 Vuex 中，你可以使用模块来组织你的状态和方法，但所有的模块都是注册到全局的 store 中的。而在 Pina 中，每个模块都是独立的，你可以在任何地方使用它，而不需要注册到全局的 store 中。
  * 异步操作：在 Vuex 中，异步操作需要通过 action 来处理。而在 Pina 中，你可以直接在方法中进行异步操作，而不需要使用 action。
  