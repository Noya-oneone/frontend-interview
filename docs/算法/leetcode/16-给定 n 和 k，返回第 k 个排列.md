# 16-给定 n 和 k，返回第 k 个排列

```javascript
// 给定参数 n 从 1 到 n 会有 n 个整数 1，2，3，…n 这 n 个数字共有 n!种排列 按
// 大小顺序升序列出所有排列情况
// 并 一 一 标 记 。 当 n=3 时 ， 所 有 排 列 如 下
// “123”,“132”,“213”,“231”,“312”,“321”
// 给定 n 和 k 返回第 n 个排列
// 第一行为 n
// 第二行为 k
// 输出排列第 k 位置的数字
// 3
// 3
// 213

function getPermutation(n, k) {
  const nums = Array.from({ length: n }, (_, i) => i + 1); // 生成数组 [1, 2, ..., n]
  const factorial = (x) => (x <= 1 ? 1 : x * factorial(x - 1)); // 计算阶乘

  k--; // 转换为 0-indexed
  let result = "";

  // 生成第 k 个排列
  for (let i = 0; i < n; i++) {
    const fact = factorial(n - 1 - i); // 计算 (n-i-1)!
    const index = Math.floor(k / fact); // 选择当前数字的索引
    result += nums[index]; // 添加当前数字到结果
    nums.splice(index, 1); // 移除已选择的数字
    k %= fact; // 更新 k
  }

  return result; // 返回第 k 个排列
}

// 示例输入
console.log(getPermutation(3, 3)); // 输出: 213

```
