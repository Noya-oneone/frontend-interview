# 2-arr-去重排序

```javascript
// 给定一个乱序的数组，删除所有的重复元素，使得每个元素只出现一次，并且按
// 照出现的次数从高到低进行排序，
// 相同出现次数按照第一次出现顺序进行先后排序。
// 1 3 3 3 2 4 4 4 5
// 3 4 1 2 5

function sortByFrequency(arr) {
  const frequencyMap = new Map();

  // 计算每个元素的出现次数
  arr.forEach((num) => {
    frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
  });

  // 将元素按出现次数和首次出现顺序排序
  const sortedArray = [...frequencyMap.entries()]
    .sort((a, b) => {
      // 按出现次数排序
      if (b[1] === a[1]) {
        // 如果出现次数相同，按首次出现顺序排序
        return arr.indexOf(a[0]) - arr.indexOf(b[0]);
      }
      return b[1] - a[1]; // 从高到低排序
    })
    .map((entry) => entry[0]); // 只保留元素

  return sortedArray;
}

// 示例输入
const inputArray = [1, 3, 3, 3, 2, 4, 4, 4, 5];
const result = sortByFrequency(inputArray);
console.log(result); // 输出: [3, 4, 1, 2, 5]

```
