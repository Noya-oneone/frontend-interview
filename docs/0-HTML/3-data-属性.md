# data-属性

## 存储自定义数据
* data-属性是HTML5中新增的属性，用于存储自定义数据。
* data-属性可以与任何HTML元素一起使用，并不会影响页面的布局和样式。
* data-属性的命名规则是以data-开头，后面跟上自定义的名称。
* data-属性的值可以是任何有效的JavaScript数据类型，如字符串、数字、布尔值、对象、数组等。

```html
<div data-name="John" data-age="30" data-is-student="true">
  Hello, my name is John and I am 30 years old.
</div>
```


## 读取自定义数据
* 读取data-属性的值可以使用JavaScript中的getAttribute()方法。

```javascript
var name = document.querySelector('div').getAttribute('data-name');
var age = document.querySelector('div').getAttribute('data-age');
var isStudent = document.querySelector('div').getAttribute('data-is-student');
```

* 也可以使用dataset属性，该属性是一个对象，可以方便地读取data-属性的值。

```javascript
var data = document.querySelector('div').dataset;
var name = data.name;
var age = data.age;
var isStudent = data.isStudent;
```