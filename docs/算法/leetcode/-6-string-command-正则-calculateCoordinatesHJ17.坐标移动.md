# -6-string-command-正则-calculateCoordinatesHJ17.坐标移动

```javascript
// 开发一个坐标计算工具， A表示向左移动，D表示向右移动，W表示向上移动，S表示向下移动。
// 从（0, 0）点开始移动，从输入字符串里面读取一些坐标，并将最终输入结果输出到输出文件里面。
// 输入：合法坐标为A(或者D或者W或者S) + 数字（两位以内），
// 坐标之间以; 分隔。非法坐标点需要进行丢弃。如AA10; A1A;  %; YAD; 等。
// 下面是一个简单的例子 如：
// A10;S20;W10;D30;X;A1A;B10A11;;A10;
// 处理过程：
// 起点（0,0）
// +   A10   =  （-10,0）
// +   S20   =  (-10,-20)
// +   W10  =  (-10,-10)
// +   D30  =  (20,-10)
// +   x    =  无效
// +   A1A   =  无效
// +   B10A11   =  无效
// +  一个空 不影响
// +   A10  =  (10,-10)
// 结果 （10， -10）

// 输入描述：
// 一行字符串

// 输出描述：
// 最终坐标，以逗号分隔

function calculateCoordinates(input) {
  let x = 0; // 初始横坐标
  let y = 0; // 初始纵坐标

  // 分割输入字符串为命令数组
  const commands = input.split(";");

  commands.forEach((command) => {
    // 使用正则表达式验证命令格式
    const match = command.match(/^([ADSW])(\d{1,2})$/); // 合法格式：字母 + 数字（1-2位）

    if (match) {
      const direction = match[1]; // 方向
      const value = parseInt(match[2]); // 数值

      // 根据方向更新坐标
      switch (direction) {
        case "A":
          x -= value; // 向左
          break;
        case "D":
          x += value; // 向右
          break;
        case "W":
          y += value; // 向上
          break;
        case "S":
          y -= value; // 向下
          break;
      }
    }
    // 非法命令自动忽略
  });

  // 返回最终坐标
  return `${x},${y}`;
}

// 示例输入
const input = "A10;S20;W10;D30;X;A1A;B10A11;;A10;";
const result = calculateCoordinates(input);
console.log(result); // 输出: "10,-10"

```
