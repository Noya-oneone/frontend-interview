# 岛屿数量

* 给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
* 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
* 此外，你可以假设该网格的四条边均被水包围。

```js
示例 1:
输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1

示例 2：

输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3
```

```js
function numIslands(grid) {
    if (grid.length === 0) return 0;

    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    // 深度优先搜索
    function dfs(grid, r, c) {
        // 边界检查和非陆地检查
        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') {
            return;
        }
        // 将访问过的陆地标记为'0'
        grid[r][c] = '0';

        // 递归地访问相邻的四个方向
        dfs(grid, r - 1, c); // 上
        dfs(grid, r + 1, c); // 下
        dfs(grid, r, c - 1); // 左
        dfs(grid, r, c + 1); // 右
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }

    return count;
}

// 示例
const grid = [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1']
];
console.log(numIslands(grid)); // 输出 3
```