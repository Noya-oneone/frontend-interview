# sortColors

```javascript
// 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
// 我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

function sortColors(nums) {
  let low = 0;  // 指向当前已经排好的 0 的最右边界的下一个位置
  let high = nums.length - 1;  // 指向当前已经排好的 2 的最左边界的上一个位置
  let i = 0;  // 用于遍历数组

  while (i <= high) {
    if (nums[i] === 0) {
      [nums[i], nums[low]] = [nums[low], nums[i]];  // 将 0 交换到左边
      low++;
      i++;
    } else if (nums[i] === 2) {
      [nums[i], nums[high]] = [nums[high], nums[i]];  // 将 2 交换到右边
      high--;
    } else {
      i++;
    }
  }
}

```
