# -19-leetcode 77.组合

```javascript
// <!-- # leetcode 77.组合

// 给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。

// 你可以按 任何顺序 返回答案。

// 1 <= n <= 20
// 1 <= k <= n
// 示例 1：

// 输入：n = 4, k = 2
// 输出：
// [
//   [2,4],
//   [3,4],
//   [2,3],
//   [1,2],
//   [1,3],
//   [1,4],
// ]
// 示例 2：

// 输入：n = 1, k = 1
// 输出：[[1]] -->

/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  const result = [];
  const combination = [];

  function backtrack(start) {
    // 如果组合的长度达到了 k，则将其加入结果集
    if (combination.length === k) {
      result.push([...combination]);
      return;
    }

    for (let i = start; i <= n; i++) {
      combination.push(i); // 选择当前数字
      backtrack(i + 1); // 继续选择下一个数字
      combination.pop(); // 撤销选择
    }
  }

  backtrack(1); // 从 1 开始
  return result;
};

```
