# 35-GPU 执行时长

```javascript
// # GPU 执行时长

// 数组元素表示在这 1s 内新增的任务个数，且每秒都有新增任务，
// 假设 GPU 最多一次执行 n 个任务，一次执行耗时 1s，在保证 Gpu 不空闲的情况
// 下，最少需要多长时间执行完成。
// 第一个参数为 gpu 最多执行的任务个数
// 第二个参数为任务数组的长度
// 第三个参数为任务数组
// 输出描述：执行完所有任务需要多少秒
// 3
// 5
// 1 2 3 4 5
// 输出：6

function gpuExecutionTime(n, m, tasks) {
  let totalTasks = 0; // 累计任务总数
  let time = 0; // 执行所需时间

  // 遍历每秒的任务
  for (let i = 0; i < m; i++) {
    totalTasks += tasks[i]; // 累加当前秒新增的任务
    // 每秒执行最多 n 个任务
    if (totalTasks > n) {
      time += Math.ceil(totalTasks / n); // 计算所需的时间
      totalTasks = 0; // 重置任务计数
    }
  }

  // 如果还有未执行的任务
  if (totalTasks > 0) {
    time += Math.ceil(totalTasks / n); // 计算最后剩余任务的时间
  }

  return time; // 返回执行完成所需的总时间
}

// 示例输入
const n = 3; // 每次最多执行的任务数
const m = 5; // 任务数组长度
const tasks = [1, 2, 3, 4, 5]; // 每秒新增的任务

const result = gpuExecutionTime(n, m, tasks);
console.log(result); // 输出：6

```
