# JS 生成 AST

## 什么是 AST
AST（Abstract Syntax Tree，抽象语法树）是源代码的一种抽象语法结构，它以树状结构表示源代码的语法结构，并能表示代码的语义结构。

## 为什么需要 AST
* 在编译器的实现中，AST 是一种重要的中间表示形式。它能够帮助编译器更好地理解代码的语义，并生成更高效的机器代码。
* 编译器是什么？
  * 编译器是一种程序，它能够将高级编程语言（如 JavaScript）转换成机器语言（如汇编语言）。
  * 浏览器 的 JavaScript 引擎是 JavaScript 编译器的一种实现，它能够将 JavaScript 代码转换成机器代码，并在浏览器中运行。
* React 和 vue 中什么场景用了AST
  * React 的 JSX 语法，React 组件的渲染，React 的 diff 算法，都需要 AST。
  * Vue 的模板语法，Vue 的编译器，Vue 的数据绑定，都需要 AST。

## 如何生成 AST

生成 AST 的过程通常分为两个步骤：

1. 词法分析（Lexical Analysis）：将源代码分割成一个个的词法单元，例如标识符、关键字、运算符、界符等。
2. 语法分析（Syntactic Analysis）：将词法单元按照语法规则进行组合，形成语法树。

## 常见的 AST 生成工具

- Esprima：Esprima 是 JavaScript 解析器的 JavaScript 实现，它能够生成 AST。
- acorn：Acorn 是一款快速、灵活的 JavaScript 解析器，它能够生成 AST。
- escodegen：Escodegen 是一款 JavaScript 代码生成器，它能够将 AST 转换成源代码。

## 示例：使用 acorn 生成 AST

```javascript

// 首先安装 acorn 库
// npm install acorn

const acorn = require("acorn");

const code = `
  function add(a, b) {
    return a + b;
  }
`;

const ast = acorn.parse(code, {
    ecmaVersion: 2020, // 指定 ECMAScript 版本
});

console.log(JSON.stringify(ast, null, 2));
```

## 生成的AST举例

生成的 AST 是一个 JSON 结构，描述了代码的语法结构。你可以将它用于代码分析、转换、优化等各种任务。例如，上面的函数 add(a, b) 的 AST 会包含函数声明、参数列表、返回语句等结构

* type：描述节点的类型。（ 根节点类型、 语句类型、 表达式类型、 模式类型）
* start 和 end：描述节点在源代码中的位置。` 按照源代码字符串的字符长度来计算` 。
* id：标识符（如变量名、函数名）。
* body：子节点数组。
* params：函数参数列表。
* init：变量的初始值。
* expression：表达式语句中的表达式。
* operator：运算符类型。
* left 和 right：二元运算符的左右操作数。
* callee：函数调用中的函数或方法。
* arguments：函数调用时传递的参数。

``` json
{
  "type": "Program",
  "start": 0,
  "end": 44,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 3,
      "end": 42,
      "id": {
        "type": "Identifier", // 函数名
        "start": 12,
        "end": 15,
        "name": "add"
      },
      ...
    }
  ]
}
```