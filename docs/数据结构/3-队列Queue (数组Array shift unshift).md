# 队列Queue

队列是一种线性数据结构，它只允许在队尾添加元素，在队头删除元素。队列的操作有两种基本操作：入队（enqueue）和出队（dequeue）。入队操作是指在队尾添加一个元素，出队操作是指在队头删除一个元素。

定义：支持入队（enqueue）和出队（dequeue）操作的线性数据结构。
操作：enqueue, dequeue, front.
实现：可以使用数组或链表实现。

## 数组实现

数组实现的队列，队尾指针tail指向队尾，队头指针head指向队头，队尾指针tail指向队尾，队头指针head指向队头。入队操作是将新元素添加到队尾，出队操作是将队头元素删除，并返回队头元素。

```javascript
class Queue {

  constructor() {
    this.items = [];
    this.head = 0;
    this.tail = 0;
  }

  enqueue(item) {
    this.items[this.tail] = item;
    this.tail++;

  }

  dequeue() {
    if (this.head === this.tail) {
      return undefined;
    }
    const item = this.items[this.head];
    this.head++;
    return item;
  }

  front() {
    if (this.head === this.tail) {
      return undefined;
    }
    return this.items[this.head];
  }
}
```


## 链表实现

链表实现的队列，队尾指针tail指向队尾，队头指针head指向队头，队尾指针tail指向队尾，队头指针head指向队头。入队操作是将新元素添加到队尾，出队操作是将队头元素删除，并返回队头元素。

```javascript
class Node {
  constructor(item) {
    this.item = item;
    this.next = null;
  }
}

class Queue {

  constructor() {
    this.head = null;
    this.tail = null;
  }

  enqueue(item) {
    const node = new Node(item);
    if (this.tail) {
      this.tail.next = node;
    }
    this.tail = node;
    if (!this.head) {
      this.head = node;
    }
  }

  dequeue() {
    if (!this.head) {
      return undefined;
    }
    const item = this.head.item;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    return item;
  }

  front() {
    if (!this.head) {
      return undefined;
    }
    return this.head.item;
  }
}
```