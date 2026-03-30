## 链表（Linked List）

想象你在一个宴会上，每个人都戴着一个特殊的胸牌，胸牌上写着他们的名字，并且有一个小钩子可以挂另一个胸牌。这个宴会就像是链表：

* **每个人**：代表链表中的一个节点。
* **胸牌上的名字**：代表节点存储的数据。
* **胸牌上的小钩子**：代表指向下一个节点的指针。
  
如果你想找到宴会上的某个人，你需要从第一个人开始，顺着他们胸牌上的钩子一个接一个地查看，直到找到那个人。这个过程就像是遍历链表。

NULL <- [数据1] <-> [数据2] <-> [数据3] -> NULL

<!-- 链表code题 -->


标题
实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。完善代码中Scheduler类，使得以下程序能正确输出

题目描述
class Scheduler {​
add(promiseCreator) {​
// TODO​
}​
// TODO​
}​
const timeout = (time) => new Promise(resolve => {​
setTimeout(resolve, time)​
})​
const scheduler = new Scheduler();​
const addTask = (time, order) => {​
scheduler.add(() => timeout(time))​
.then(() => console.log(order))​
}​

addTask(1000, '1')​
addTask(500, '2')​
addTask(300, '3')​
addTask(400, '4')​

// output: 2 3 1 4​
// 一开始，1、2两个任务进入队列​
// 500ms时，2完成，输出2，任务3进队​
// 800ms时，3完成，输出3，任务4进队​
// 1000ms时，1完成，输出1​
// 1200ms时，4完成，输出4​
