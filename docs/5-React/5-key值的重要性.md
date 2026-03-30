<!-- react 中key值的重要性 -->

**key值的重要性**


React 官方文档中有这么一句话：

> Keys are a special property of React elements that help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside the array to give the elements a stable identity.

翻译过来就是：

> 键是React元素的一个特殊属性，它可以帮助React识别哪些元素发生了变化、被添加、或被删除。在数组中给元素赋予键可以赋予元素一个稳定的标识。

这句话的意思是说，React使用键来识别数组中元素的变化、添加、删除。如果没有键，React将无法区分数组中元素的变化。

举个例子：

```javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>{number}</li>
);
```

在这个例子中，我们使用map方法将数组中的数字转换为列表项。我们给列表项添加了键，键的值是数字的字符串形式。这样React就可以识别哪些元素发生了变化、被添加、或被删除。

如果没有键，React将无法区分数组中元素的变化，导致列表项的顺序会被打乱。
所以，在使用React时，给数组中的元素赋予键是非常重要的。

