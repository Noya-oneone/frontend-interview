// 一只青蛙一次可以跳上1级台阶，也可以跳上2级。
// 求该青蛙跳上一个n级的台阶总共有多少种跳法（先后次序不同算不同的结果）。

// 递归写法 直观简单，但对于较大的 n 会导致重复计算，时间复杂度为 O(2^n)

function frogJump(n) {
  if (n === 0) return 1; // 0级台阶有1种方式（不跳）
  if (n === 1) return 1; // 1级台阶有1种方式
  return frogJump(n - 1) + frogJump(n - 2); // 递归计算
}

// 示例
console.log(frogJump(5)); // 输出 8

// 非递归写法 - 动态规划 避免重复计算，时间复杂度为O(n), 空间复杂度为O(n),也可以优化为O(1)
function frogJump(n) {
  if (n === 0) return 1; // 0级台阶有1种方式
  if (n === 1) return 1; // 1级台阶有1种方式

  const dp = new Array(n + 1); // 创建数组保存结果
  dp[0] = 1; // 0级台阶
  dp[1] = 1; // 1级台阶

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]; // 动态规划状态转移
  }

  return dp[n]; // 返回结果
}

// 示例
console.log(frogJump(5)); // 输出 8

// 优化后的代码
function frogJump(n) {
  if (n === 0) return 1; // 0级台阶有1种方式
  if (n === 1) return 1; // 1级台阶有1种方式

  let prev1 = 1; // f(1)
  let prev2 = 1; // f(0)
  let current = 0; // f(n)

  for (let i = 2; i <= n; i++) {
    current = prev1 + prev2; // 状态转移
    prev2 = prev1; // 更新前两个状态
    prev1 = current; // 更新当前状态
  }

  return current; // 返回结果
}

// 示例
console.log(frogJump(5)); // 输出 8
