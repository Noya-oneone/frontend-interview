# -1-sring-convertString-进制转换

```javascript
// # HJ5.进制转换: 字母转换
// 输入一个字符串（长度<100），将其中所有大写字母改为小写字母，而所有小写字母全部改为大写字母其余字符原样输出然后输出前n个字符。
//  设计步骤
// ①输入字符串；
// ②用循环判断字符串中的每个字符是大写还是小写，若是大写要转换成小写，是小写要转换成大写：大写与小写字母的转换关系是“小写字母 = 大写字母 + 32”
//  ③用printf输出该字符串前n个字符。

// 输入描述：输入数据为1个数字，表示输出字符窜长度（n<100），接着输入1个字符串，其长度不限，可包含键盘上可见的所有字符
// 输出描述：输出为1个字符串，根据输入数据，将其中的大写字符转换成小写，小写转换成大写，其余字符不变
// 样式输入：5 FG56hj
// 样式输出：fg56H

function convertString(n, str) {
  // 定义一个名为 convertString 的函数，接收两个参数 n（整数）和 str（字符串）
  let result = ""; // 初始化一个空字符串，用于存储转换后的结果

  for (let i = 0; i < str.length; i++) {
    // 遍历字符串 str 的每个字符
    const char = str[i]; // 获取当前遍历到的字符
    if (char >= "A" && char <= "Z") {
      // 判断当前字符是否为大写字母
      result += String.fromCharCode(char.charCodeAt(0) + 32); // 将大写字母转换为小写字母，并添加到 result 字符串中
    } else if (char >= "a" && char <= "z") {
      // 判断当前字符是否为小写字母
      result += String.fromCharCode(char.charCodeAt(0) - 32); // 将小写字母转换为大写字母，并添加到 result 字符串中
    } else {
      // 如果当前字符不是字母
      result += char; // 保持字符不变，并添加到 result 字符串中
    }
  }
  return result.slice(0, n); // 返回转换后的字符串的前 n 个字符
}

// 示例调用
console.log(convertString(5, "FG56hj")); // 输出: fg56H

```
