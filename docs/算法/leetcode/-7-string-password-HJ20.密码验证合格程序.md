# -7-string-password-HJ20.密码验证合格程序

```javascript
// 描述
// 密码要求:
// 1.长度超过8位
// 2.包括大小写字母.数字.其它符号,以上四种至少三种
// 3.不能有长度大于2的包含公共元素的子串重复 （注：其他符号不含空格或换行）

// 数据范围：输入的字符串长度满足 1≤n≤100
// 输入描述：一组字符串。
// 输出描述：如果符合要求输出：OK，否则输出NG

// 示例1
// 输入：
// 021Abc9000
// 021Abc9Abc1
// 021ABC9000
// 021$bc9000

// 输出：
// OK
// NG
// NG
// OK

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function checkPassword(password) {
  const lengthValid = password.length > 8; // 检查长度
  const hasUpper = /[A-Z]/.test(password); // 检查大写字母
  const hasLower = /[a-z]/.test(password); // 检查小写字母
  const hasNumber = /\d/.test(password); // 检查数字
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password); // 检查其他符号

  const characterTypes = [hasUpper, hasLower, hasNumber, hasSymbol];
  const typeCount = characterTypes.filter(Boolean).length; // 计算符合的字符类型

  // 检查重复子串
  const seenSubstrings = new Set();
  for (let i = 0; i < password.length - 2; i++) {
    const substring = password.slice(i, i + 3); // 获取长度为3的子串
    if (seenSubstrings.has(substring)) {
      return "NG"; // 如果已存在，则返回NG
    }
    seenSubstrings.add(substring);
  }

  // 判断密码有效性
  if (lengthValid && typeCount >= 3) {
    return "OK"; // 符合要求
  }
  return "NG"; // 不符合要求
}

async function main() {
  for await (const line of rl) {
    const result = await checkPassword(line.trim()); // 去掉首尾空白
    console.log(result); // 输出结果
  }
}

main();

```
