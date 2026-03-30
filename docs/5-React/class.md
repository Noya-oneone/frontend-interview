# React 里面为什么不能写 class，而一定要写成 className，有探究过原因吗？

React 官方文档中有提到，React 里面的 class 是一个保留字，不能用作组件的属性名。
在 JavaScript 中，class 是用来定义类的关键字。因为 React 是用 JavaScript 编写的，如果直接在 JSX 中使用 class，会与 JavaScript 的 class 关键字发生冲突，导致解析错误。
