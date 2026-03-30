# 迭代器模式

## 定义

* 迭代器模式（Iterator Pattern）是一种行为设计模式
* 它提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。
* 迭代器模式允许客户端通过迭代器访问集合中的元素，而不需要知道集合的内部结构。这种模式特别适用于集合类和数据结构，它提供了一种统一的方式来遍历集合中的元素。
* 在 JavaScript 中，`内置的 for...of 循环`实际上是基于迭代器模式的。集合类如`数组、字符串和 Map 都实现了迭代器接口`。
* 能获取`聚合对象的顺序和元素`，并允许在遍历集合的同时，对集合进行修改。

## 结构

* 迭代器（Iterator）：它是一种接口，为遍历集合中的元素提供统一的接口。
* 聚合（Aggregate）：它是集合的接口，定义了集合的基本操作，如添加、删除元素等。
* 具体迭代器（Concrete Iterator）：它实现了迭代器接口，并为集合中的元素提供遍历。
* 客户端（Client）：它使用迭代器来遍历集合中的元素。

## 优点

* 提供一种遍历集合元素的统一方式。
* 简化了客户端代码，无需知道集合内部的结构。
* 允许在遍历集合的同时，对集合进行修改。

## 缺点

* 由于迭代器模式中包含多个类，因此增加了系统的复杂性。
* 迭代器模式的使用不一定总是合适的。

## 适用场景

* 访问一个聚合对象的内容而无需暴露它的内部表示。
* 需要为聚合对象提供多种遍历方式。
* 遍历一个复杂的数据结构（如树、图）。

```javascript
// 迭代器接口
class Iterator {
    next() {}
    hasNext() {}
}

// 聚合接口
class Aggregate {
    createIterator() {}
}

// 具体迭代器
class ConcreteIterator extends Iterator {
    constructor(aggregate) {
        super();
        this.aggregate = aggregate;
        this.currentIndex = 0;
    }

    next() {
        if (this.hasNext()) {
            return this.aggregate.items[this.currentIndex++];
        }
        return null;
    }

    hasNext() {
        return this.currentIndex < this.aggregate.items.length;
    }
}

// 具体聚合
class ConcreteAggregate extends Aggregate {
    constructor() {
        super();
        this.items = [];
    }

    add(item) {
        this.items.push(item);
    }

    createIterator() {
        return new ConcreteIterator(this);
    }
}

// 使用示例
const aggregate = new ConcreteAggregate();
aggregate.add('Item 1');
aggregate.add('Item 2');
aggregate.add('Item 3');

const iterator = aggregate.createIterator();

while (iterator.hasNext()) {
    console.log(iterator.next());  // 输出: Item 1, Item 2, Item 3
}

```