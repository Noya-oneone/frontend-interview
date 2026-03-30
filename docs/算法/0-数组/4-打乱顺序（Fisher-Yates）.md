# 打乱顺序

## 题目描述

给定一个数组，将数组中的元素随机打乱。
提供一个数字 n，生成一组 0~n-1 的整数，打乱顺序组成数组，打乱几次，如何能够看起来平衡，说出你能想到的所有方法。

平衡性的考量
* `多次洗牌`：多次使用 Fisher-Yates 或多种方法组合洗牌，可以确保结果更平衡。
* `均匀性检查`：可以通过统计分布来确保生成的结果在不同区间内均匀分布。
* `避免模式重复`：使用组合方法（如交换法和插入法）减少模式重复的概率。

## 随机数的排序法

javascript 代码

```javascript
function randomSortShuffleArray(n) {
    const array = Array.from({ length: n }, (_, i) => i);
    return array.sort(() => Math.random() - 0.5);
}

// 示例
console.log(randomSortShuffleArray(10));
```

## Fisher-Yates 算法 (洗牌算法)

Fisher-Yates 算法是一种常用的随机数生成算法，它是一种基于置换的算法，它将数组中的元素随机排列，使得每一个元素都有机会成为下一个元素。

```javascript
function fisherYatesShuffleArray(n) {
    const array = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 同时把 array[i] 和 array[j] 的值互换。它通过解构赋值一次性完成交换操作，而不需要额外的临时变量。
    }
    return array;
}
// 示例
console.log(fisherYatesShuffleArray(10));
```

## 多次洗牌

* 多次使用 Fisher-Yates 算法，可以确保结果更平衡。

```javascript
function multiShuffleArray(n, times = 10) {
    const array = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < times; i++) {
        fisherYatesShuffleArray(array);
    }
    return array;
}
// 示例
console.log(multiShuffleArray(10));
```

## 轮换法
* 将数组分成几个子块，分别打乱，然后将它们连接起来。可以避免某些算法可能出现的连续值或重复模式。

```javascript
function blockShuffleArray(n, blockSize = 3) {
    const array = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < n; i += blockSize) {
        let block = array.slice(i, i + blockSize);
        block = block.sort(() => Math.random() - 0.5);
        array.splice(i, blockSize, ...block);
    }
    return array;
}
// 示例
console.log(blockShuffleArray(10));
```

## 随机选择并插入法

* 从未处理的数组中随机选择一个元素，插入到新数组中的随机位置。重复直到所有元素都处理完

```javascript
function insertShuffleArray(n) {
    const array = Array.from({ length: n }, (_, i) => i);
    let shuffledArray = [];
    while (array.length > 0) {
        const randomIndex = Math.floor(Math.random() * array.length);
        shuffledArray.push(array.splice(randomIndex, 1)[0]);
    }
    return shuffledArray;
}
// 示例
console.log(insertShuffleArray(10));
```
