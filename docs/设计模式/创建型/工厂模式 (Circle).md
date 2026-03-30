# 工厂模式

* 工厂模式（Factory Pattern）是一种`创建型设计模式`，它提供了一种`创建对象的最佳方式`。
* 在工厂模式中，我们在创建对象时`不会对客户端暴露创建逻辑`，而是通过工厂类来负责创建对象。
* 在传统工厂模式中，工厂`通常返回一个实例化的对象`

## 优点
* 工厂模式提供了一种`创建对象`的最佳方式。
* 它提供了一种`封装对象创建`的机制，并`隐藏了创建逻辑`，使得代码`易于维护和扩展`。
* 它`可以对创建过程进行`参数化`，并`可以返回不同类的对象`。
* 它`可以避免构造函数的`参数过多，`可读性差`的问题。

## 缺点
* 工厂模式`违反了依赖倒置原则`，因为客户端代码`依赖于接口`，而不是具体的实现。
* 工厂模式`会增加系统的`复杂度`，因为要引入一个新的类来负责对象的创建，这会引入一些`额外的开销`。


## 应用场景
* 假设我们有一个场景，需要根据不同的类型创建不同的形状对象（如圆形、正方形等）
* react 中的createElement：`类似于工厂模式`
    * `创建对象的接口`：createElement 提供了一个通用接口，用于创建不同类型的 React 元素。
    * `封装了对象创建的细节`：createElement 隐藏了元素创建的复杂性，开发者只需提供元素类型和属性。
    * `根据输入条件返回不同对象`：当传入不同的 type 时，createElement 会创建不同类型的元素（如 HTML 元素或自定义组件）。
    <!-- 
        type:这个参数可以是一个字符串（表示原生 HTML 标签，如 div、span），也可以是一个 React 组件（函数组件或类组件）。
        props: 一个包含元素属性的对象。
        children: 子元素，可以是单个子元素、多个子元素或嵌套的元素。 
        createElement 的主要目的是构建 UI 的虚拟表示（Virtual DOM），而不是直接创建类实例。它是 React 核心架构的一部分，用于构建组件树和最终的渲染。
    -->
    ```javascript
        React.createElement(type, [props], [...children])
    ```

## 实现方式
```javascript
// 定义不同的形状类
class Circle {
    constructor() {
        this.shape = 'Circle';
    }

    draw() {
        console.log('Drawing a Circle');
    }
}

class Square {
    constructor() {
        this.shape = 'Square';
    }

    draw() {
        console.log('Drawing a Square');
    }
}

class Rectangle {
    constructor() {
        this.shape = 'Rectangle';
    }

    draw() {
        console.log('Drawing a Rectangle');
    }
}

// 工厂类
class ShapeFactory {
    createShape(type) {
        switch(type) {
            case 'circle':
                return new Circle();
            case 'square':
                return new Square();
            case 'rectangle':
                return new Rectangle();
            default:
                throw new Error('Invalid shape type');
        }
    }
}

// 使用工厂模式创建对象
const factory = new ShapeFactory();

const shape1 = factory.createShape('circle');
shape1.draw();  // 输出: Drawing a Circle

const shape2 = factory.createShape('square');
shape2.draw();  // 输出: Drawing a Square

const shape3 = factory.createShape('rectangle');
shape3.draw();  // 输出: Drawing a Rectangle
```