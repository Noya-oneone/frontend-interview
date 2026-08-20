# 如何将 JS 代码抽象成 AST

## 什么是 AST

抽象语法树（Abstract Syntax Tree）是用`树状结构表示源代码语法结构`的数据结构：每个节点代表代码中的一个构造（表达式、语句、函数声明、变量声明等）。

解析分两步：`词法分析（tokenize）`把字符流切成 token，`语法分析（parse)` 把 token 流组装成树。

## 为什么要 AST

* **分析与转换**：Babel 转译新语法、codemod 批量改写代码。
* **优化与压缩**：Terser 的压缩混淆、打包器的 tree-shaking（静态分析 import/export）。
* **检查与格式化**：ESLint 的规则、Prettier 的重排版都基于 AST。

## 工具与流程（Babel 三段式）

常用 parser：`@babel/parser`、Acorn（Vite/Rollup 底层）、Esprima、SWC/esbuild（Rust/Go 实现）。

```js
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

const code = 'const answer = 40 + 2;';

// 1. parse：源码 → AST
const ast = parse(code);

// 2. traverse：访问者模式遍历并修改节点
traverse(ast, {
  NumericLiteral(path) {
    path.node.value += 1;          // 所有数字字面量 +1
  },
});

// 3. generate：AST → 源码
console.log(generate(ast).code);   // const answer = 41 + 3;
```

一段 `const a = 1` 的 AST 骨架：

```
Program
└── VariableDeclaration (kind: "const")
    └── VariableDeclarator
        ├── Identifier (name: "a")
        └── NumericLiteral (value: 1)
```

在 [AST Explorer](https://astexplorer.net/) 里粘代码即可交互查看。

## 常见考点

* **Babel 的工作原理？** parse → transform（插件在 traverse 中改节点）→ generate，写 Babel 插件就是写访问者。
* **tree-shaking 为什么依赖 ESM？** `import/export` 是静态语法，parse 阶段即可从 AST 确定依赖关系；CommonJS 的 require 是运行时函数调用，静态分析不了。

## 参考

* [维基百科 - 抽象语法树](https://zh.wikipedia.org/wiki/抽象语法树)
* [Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)
