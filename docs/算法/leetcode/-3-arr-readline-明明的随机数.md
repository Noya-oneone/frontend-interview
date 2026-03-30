# -3-arr-readline-明明的随机数

```javascript
// 明明生成了N个1到500之间的随机整数。
// 请你删去其中重复的数字，即相同的数字只保留一个，把其余相同的数去掉，
// 然后再把这些数从小到大排序，按照排好的顺序输出。

// 数据范围1≤n≤1000
// 输入的数字大小满足 1≤val≤500
// a 输入描述
// 第一行输入一个整数 N，表示随机整数的个数。
// 接下来的 N 行，每行输入一个整数，代表明明生成的随机数。
// b 输出描述
// 输出多行，表示处理后的结果，从小到大排序，每行输出一个数字。

const readline = require("readline"); // 引入 readline 模块，用于读取输入

const rl = readline.createInterface({
  // 创建 readline 接口
  input: process.stdin, // 设置输入来源为标准输入
  output: process.stdout, // 设置输出目标为标准输出
});

const nums = []; // 存待排序的所有数字

rl.on("line", function (line) {
  // 监听每一行输入
  nums.push(Number(line)); // 将输入的数字转换为 Number 类型并存储到 nums 数组中

  if (nums.length - 1 === nums[0]) {
    // 检查是否已读取 N 个数字
    nums.shift(); // 去掉首位表示输入数据数量的数字

    const uniqueNums = Array.from(new Set(nums)); // 使用 Set 去重，转换为数组
    uniqueNums.sort((a, b) => a - b); // 对去重后的数字进行升序排序

    uniqueNums.forEach((num) => console.log(num)); // 输出排序后的每个数字
  }
});

// 输入
// 3
// 2
// 2
// 1

// nums 变为 [3, 2, 2, 1]。
// 去掉 3 后，nums 变为 [2, 2, 1]。
// 使用 Set 去重后，uniqueNums 为 [2, 1]。
// 排序后变为 [1, 2]。
// 最终输出：
// 1
// 2

```
