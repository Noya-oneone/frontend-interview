# Typescript

增加了静态类型，可以在开发人员编写脚本时检测错误，使得代码质量更好，更健壮。
优势:
1. 杜绝手误导致的变量名写错;
2. 类型可以一定程度上充当文档;
3. IDE自动填充，自动联想;


### type 与 interface
相同点：
1. 都可以描述 '对象' 或者 '函数' 
2. 都允许拓展(extends)
不同点：
1. type 可以声明基本类型，联合类型，元组
2. type 可以使用 typeof 获取实例的类型进行赋值
3. 多个相同的 interface 声明可以自动合并
使用 interface 描述‘数据结构’，
使用 type 描述‘类型关系’

## 类型系统

TypeScript 包含以下类型系统：
  * **interface**: ```可以被声明合并、可class 实现（implements）或扩展（extends）```
  * **type** ：可以用来描述所有可用的类型、可以表示更复杂的类型，如联合类型、交叉类型、元组等，而 interface 不可以。
  * **联合类型**：```type StringOrNumber = string | number;```
  * **交叉类型**： ```type StringAndNumber = { stringField: string } & { numberField: number };``` // * StringAndNumber 类型的值同时具有 stringField 和 numberField 属性
  * **元组类型**：元组类型中，类型的顺序是重要的 ```let x: [string, number]; x = ["hello", 10];``` // OK
  * **any 类型**是 TypeScript 的一种特殊类型，表示可以是任何类型，但是，这也意味着你失去了类型检查的保护，可能会引入运行时错误
    * 为编程阶段还不清楚类型的变量指定一个类型。 
    这些值可能来自于动态的内容，比如来自`用户输入或第三方代码库`。 
    这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。
    
  * **泛型**是一种创建可重用组件的工具，这些组件可以适用于多种类型，而不仅仅是单一类型。泛型提供了一种方式，使得类型可以由使用者在使用时指定，而不是在定义时就确定。

```typescript
  function identity<T>(arg: T): T {
    return arg;
  }

  const num = identity<number>(42); // 类型安全，num 是 number 类型
  const str = identity<string>("hello"); // 类型安全，str 是 string 类型


  function identity(arg: any): any {
      return arg;
  }

  const num = identity(42); // num 的类型是 any，不安全
  const str = identity("hello"); // str 的类型是 any，不安全
  ```

### const 与 readonly

| 特性 | const| readonly |
|-|-|-|
| 描述 | 防止变量的值被修改 | 防止变量的属性被修改 |
| 使用场景 | 声明不可变的变量 | 声明不可变的属性 |
| 示例 | `const a = 10;` | `readonly name: string = "John";`|

### 枚举与常量枚举

| 特性| 枚举 | 常量枚举 |
|--|--|--|
| 描述| 常规的枚举，允许包含计算成员 | 只能使用常量枚举表达式，编译阶段会被删除|
| 编译阶段处理| 保留在编译后的代码中 | 编译阶段被删除，成员在使用的地方被内联进来|
| 示例| `enum Color {Red, Green, Blue}`| `const enum Direction {Up, Down, Left, Right}` |

### 接口与类型别名

| 特性| 接口 | 类型别名 |
|--|--|--|
| 描述| 用来描述对象或函数的类型 | 可以描述对象、函数、基本类型、联合类型、元组等 |
| 扩展性| 支持继承和实现（extends、implements）| 支持交叉类型和联合类型，但不支持继承和实现 |
| 示例| `interface Person {name: string; age: number;}` | `type Person = {name: string; age: number;}` |


* **typescript 优点**
* 提供了**静态类型检查**，这是 JavaScript 缺少的特性。
* TypeScript 的类型注解和接口定义可以作为良好的文档，使得代码更易于理解和维护
* 强大的智能提示






## 特殊类型
* **any**: 动态的变量类型（失去了类型检查的作用）。
* **never**: 永不存在的值的类型。例如：never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
* **unknown**: 任何类型的值都可以赋给 unknown 类型，但是 unknown 类型的值只能赋给 unknown 本身和 any 类型。
* **null & undefined**: 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和  undefined 赋值给 number 类型的变量。当你指定了 --strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自。
* **void**: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为void。



## TypeScript 中的 this 和 JavaScript 中的 this 有什么差异？
```JSON
{
  "compilerOptions": {
    "noImplicitThis": true,
    // 其他配置选项
  }
}
```
* TypeScript：noImplicitThis: true 的情况下，必须去声明 this 的类型，才能在函数或者对象中使用this。
* Typescript 中箭头函数的 this 和 ES6 中箭头函数中的 this 是一致的。