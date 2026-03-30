# 两数之和

* 算法题：从数组 [1, 5, 8, 10, 12] 中找到两个数和为 9，返回 [1, 8] 这样的结果。

* `暴力枚举`：简单但效率较低，适用于`小规模数组`。
* `哈希表`：适合`无序数组`，时间复杂度较低。
* `双指针法`：适合`已排序的数组`，效率高且不需要额外的存储空间。

## 暴力枚举 - 时间复杂度：O(n^2)
```js
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}

const nums = [1, 5, 8, 10, 12];
const target = 9;
const result = twoSum(nums, target);
console.log(result); // [1, 8]
```

## 哈希表 - 时间复杂度：O(n)
```js
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i]; // 一个是target-的那个数的下标，一个是当前数的下标
    }
    map.set(nums[i], i);
  }
}

const nums = [1, 5, 8, 10, 12];
const target = 9;
const result = twoSum(nums, target);
console.log(result); // [1, 8]
```

## 双指针法 - 时间复杂度：O(n)

* 如果数组是`排序好的`，可以使用双指针方法。时间复杂度为 O(n)，空间复杂度为 O(1)。
* `双指针法`的核心思想是通过`设置两个指针`，通常一个指针从数组的`开始位置出发`，另一个指针从数组的`末尾位置出发`，通过移动指针来`缩小查找范围`，以达到高效解决问题的目的。
    * `指针的移动`：在每次循环中，我们根据当前两个指针指向的元素之和是否满足条件，决定移动哪一个指针。这种方法利用了数组的排序特性，能高效地找到符合条件的两个数。(`left++ right--`)
    * while 循环：`while (left < right)` 是双指针法`常见的循环结`构，确保指针不会越过彼此，同时不断缩小搜索范围。

```js
function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
}

const nums = [1, 5, 8, 10, 12];
const target = 9;
const result = twoSum(nums, target);
console.log(result); // [1, 8]
```