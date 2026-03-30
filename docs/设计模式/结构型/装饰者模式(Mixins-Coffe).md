# 装饰者模式(Mixins & HOC)

## 什么是装饰者模式？

* 装饰者模式是结构型设计模式，它允许向一个现有对象`添加新的功能，同时又不改变其结构`。
* 这种模式创建了一个`装饰类`，该类包装着`被装饰的对象`，并在保持对象结构不变的情况下，动态地给对象添加额外的功能。
* 开闭原则（**对扩展开放，对修改封闭**）。

## 装饰者模式的结构

- `Component（抽象组件）`：它是定义了对象接口的抽象类或接口。
- `ConcreteComponent（具体组件）`：它是实现了抽象组件接口的具体类。
- `Decorator（装饰器）`：它是抽象类或接口，它定义了具体组件的功能扩展。
- `ConcreteDecorator（具体装饰器）`：它是装饰器的具体实现，它包装具体组件并添加额外的功能。

```javascript
Component
   |
   v
ConcreteComponent
   |
   v
Decorator
   |
   v
ConcreteDecorator
```

## 装饰者模式的优点

- 动态地给对象添加额外的功能。
- 避免创建大量的子类： 子类重写父类方法时，可能出现意外的行为或冲突，尤其是在多态环境中。
- 避免过度使用继承：子类依赖于父类的具体实现，任何对父类的修改都可能影响所有子类，导致意外的错误和行为。
- 降低耦合度。

## 装饰者模式的缺点

- 多层装饰会导致代码臃肿。
- 装饰者和被装饰对象有相同的接口，这会导致客户端代码混乱。

## 示例
* 在 Vue.js 中，`mixins 是一种将组件的功能代码复用到多个组件中的机制`。它可以被视为装饰者模式的一种实现，因为它允许你在不修改组件本身的情况下，动态地为组件添加额外的功能
* 在 Vue 中，mixins 允许你将多个组件的通用逻辑提取到一个独立的 mixin 对象中，然后在多个组件中使用这些 mixin，从而实现功能的复用。mixin 可以包含组件的生命周期钩子、数据、方法等。


```javascript
// 基本组件
class Coffee {
    cost() {
        return 5; // 基础咖啡的价格
    }
}

// 装饰者基类
class CoffeeDecorator {
    constructor(coffee) {
        this._coffee = coffee; // 持有一个 Coffee 对象的引用
    }

    cost() {
        return this._coffee.cost(); // 默认返回被装饰对象的价格
    }
}

// 具体装饰者：牛奶
class MilkDecorator extends CoffeeDecorator {
    cost() {
        return super.cost() + 2; // 在原有价格基础上增加牛奶的价格
    }
}

// 具体装饰者：糖
class SugarDecorator extends CoffeeDecorator {
    cost() {
        return super.cost() + 1; // 在原有价格基础上增加糖的价格
    }
}

// 使用装饰者模式
const myCoffee = new Coffee();
console.log('Basic Coffee Cost:', myCoffee.cost()); // 输出: Basic Coffee Cost: 5

const milkCoffee = new MilkDecorator(myCoffee);
console.log('Milk Coffee Cost:', milkCoffee.cost()); // 输出: Milk Coffee Cost: 7

const milkAndSugarCoffee = new SugarDecorator(milkCoffee);
console.log('Milk and Sugar Coffee Cost:', milkAndSugarCoffee.cost()); // 输出: Milk and Sugar Coffee Cost: 8
```