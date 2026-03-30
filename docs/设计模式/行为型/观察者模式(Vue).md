# 观察者模式（Vue）

* 观察者模式（Observer Pattern）是一种行为型设计模式，它定义了`一种一对多的依赖关系`，让`多个观察者对象同时监听某一个主题对象`，当主题对象发生变化时，它的所有观察者都会收到通知并进行相应的处理。在前端开发中，观察者模式经常用于`实现事件监听和响应式系统`

## 结构
* `Subject（被观察者）`：它是观察者模式的核心，维护一个观察者列表，并提供一个接口来增加和删除观察者对象。
* `Observer（观察者）`：它是观察者模式的参与者，它是一个接口，用于接收来自 Subject 的通知并进行相应的处理。


## 示例代码

```javascript
// 定义被观察者类
class Subject {
    constructor() {
        this.observers = []; // 存储所有的观察者
    }
    // 添加观察者
    addObserver(observer) {
        this.observers.push(observer);
    }
    // 移除观察者
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // 通知所有观察者
    notifyObservers(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

// 定义观察者类
class Observer {
    constructor(name) {
        this.name = name;
    }

    // 接收到通知后的处理逻辑
    update(data) {
        console.log(`${this.name} received data: ${data}`);
    }
}

// 创建被观察者对象
const subject = new Subject();

// 创建观察者对象
const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

// 添加观察者
subject.addObserver(observer1);
subject.addObserver(observer2);

// 触发通知，所有观察者都会收到更新
subject.notifyObservers('Hello, Observers!');

// 移除一个观察者
subject.removeObserver(observer1);

// 再次触发通知，只有剩余的观察者会收到更新
subject.notifyObservers('Second update');

// 输出结果：
// Observer 1 received data: Hello, Observers!
// Observer 2 received data: Hello, Observers!
// Observer 2 received data: Second update
```