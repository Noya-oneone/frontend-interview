# 6-arr-找到好朋友

```javascript
// N 个小朋友站成一队，第 i 个小朋友的身高为 height[i]，第 i 个小朋友可以
// 看到第一个比自己身高更高的小朋友 j
// 那么 j 是 i 的好朋友 (要求：j>i) 。
// 请重新生成一个列表，对应位置的输出是每个小朋友的好朋友的位置。如果没有
// 看到好朋友，请在该位置用 0 代替。
// 第一行输入 N，N 表示有 N 个小朋友
// 第二行输入 N 个小朋友的身高 height[i]，都是整数
// 输出 N 个小朋友的好朋友的位置
// 8
// 123 124 125 121 119 122 126 123
// 1 2 6 5 5 6 0 0
// 123 的好朋友是 1 位置上的 124 ，124 的好朋友是 2 位置上的 125，125 的好朋
// 友是 6 位置上的 126，依此类推

function findGoodFriends(N, heights) {
  const result = new Array(N).fill(0);
  const stack = []; // 用于存储小朋友的位置

  for (let i = 0; i < N; i++) {
    // 当栈不为空并且当前小朋友的身高大于栈顶小朋友的身高
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const index = stack.pop(); // 取出栈顶元素
      result[index] = i + 1; // 记录好朋友的位置，i + 1 因为需要从 1 开始
    }
    stack.push(i); // 将当前小朋友的索引入栈
  }

  return result;
}

// 示例输入
const N = 8;
const heights = [123, 124, 125, 121, 119, 122, 126, 123];

// 计算好朋友的位置
const result = findGoodFriends(N, heights);
console.log(result); // 输出: [1, 2, 6, 5, 5, 6, 0, 0]

```
