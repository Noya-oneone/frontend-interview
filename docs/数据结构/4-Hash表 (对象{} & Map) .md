# 数据结构-Hash表

## 1. 什么是Hash表？

* 哈希表（Hash Table） 是一种数据结构
* 它通过将`键（Key）映射到对应的值（Value）`，实现`快速的查找、插入和删除操作`。
* 哈希表的核心思想是使用一个`哈希函数` 将`键`转换为数组中的`索引`，从而在常数时间内（平均情况下）进行数据的访问。

## 2. 哈希表的特点

- 哈希表是一种无序的动态集合，元素的位置是通过哈希函数计算出来的。
- 哈希表的元素是通过键值对（Key-Value）存储的，其中键是唯一的，值可以重复。
- 哈希表的查找、插入和删除操作的时间复杂度都为O(1)（平均）。
- 哈希表的空间复杂度为O(n)，其中n为元素的个数。


## 3. 哈希表实现

* `对象（Object）`：是一种基本的键值对存储结构，键通常是字符串，背后可能使用`哈希表机制`实现。
* `Map 对象`：是 JavaScript 中`更高级的哈希表实现`，允许使用`任意类型的键，并保持键值对的插入顺序`。
Map.has()、Map.get()、Map.set()、Map.delete()、Map.clear()等方法都支持链式调用。


## hash函数

* 哈希函数（Hash Function）：将任意长度的输入（如字符串、数字、对象等）转换为`固定长度的输出`，该输出被称为`哈希值（Hash Value）`。
* 哈希函数的作用：
  * 确定元素在哈希表中的位置。
  * 快速查找元素。
  * 避免碰撞。
* 常见的哈希函数：
  * 加法哈希：将键值对的键的ASCII码之和作为哈希值。
  * 乘法哈希：将键值对的键的ASCII码之积作为哈希值。
  * 除法哈希：将键值对的键的ASCII码之商作为哈希值。

代码

```javascript
function addHash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
  }
  return hash;
}

function multiplyHash(key) {
  let hash = 1;
  for (let i = 0; i < key.length; i++) {
    hash *= key.charCodeAt(i);
  }
  return hash;
}

function divideHash(key) {
  let hash = key.length;
  for (let i = 0; i < key.length; i++) {
    hash /= key.charCodeAt(i);
  }
  return hash;
}

console.log(addHash("hello")); // 532
console.log(multiplyHash("hello")); // 305419896
console.log(divideHash("hello")); // 0
```