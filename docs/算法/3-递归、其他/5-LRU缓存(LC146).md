# LRU 缓存（LeetCode 146）

* 算法题：设计满足 `LRU`（最近最少使用）约束的缓存，`get` 和 `put` 都必须是 `O(1)`；容量满时淘汰`最久未使用`的键。
* 前端超高频：Vue `keep-alive` 的 `max` 属性、HTTP 缓存淘汰、图片/接口结果缓存都是 LRU。

* 核心思想：需要「O(1) 查找」+「O(1) 调整顺序」。JS 里 `Map` 天然`保持插入顺序`，删除再插入即可把 key 移到「最新」位置，不用手写双向链表。

## Map 解法 - get/put 均 O(1)

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key); // 删除再插入 → 移到 Map 末尾（最新）
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key); // 已存在：先删，保证顺序刷新
    } else if (this.cache.size >= this.capacity) {
      const oldest = this.cache.keys().next().value; // Map 第一个 key 即最久未使用
      this.cache.delete(oldest);
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1)); // 1（1 变为最新）
lru.put(3, 3); // 容量满，淘汰最久未用的 2
console.log(lru.get(2)); // -1
console.log(lru.get(3)); // 3
```

## 常见追问

* 不允许用 Map 怎么办？`哈希表 + 双向链表`：哈希表存 key → 链表节点；链表头是最新、尾是最旧，get/put 时把节点摘下挂到头部，淘汰时删尾节点。这是本题的「标准答案」，Map 解法是 JS 的语言红利。
* `keep-alive` 里的 LRU？Vue 源码用数组 `keys` 记录顺序，命中时 `remove + push`，超过 `max` 时删 `keys[0]` 对应的缓存实例——同一个思想。
* LRU vs LFU？LRU 按`最近使用时间`淘汰，LFU（LeetCode 460）按`使用频率`淘汰，实现更复杂。
