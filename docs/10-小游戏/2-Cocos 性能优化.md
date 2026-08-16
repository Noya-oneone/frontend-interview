# Cocos 性能优化

小游戏跑在中低端安卓机上，性能预算比 Web 苛刻得多。优化分三条线：
**渲染（DrawCall）、内存（资源与 GC）、启动（首屏时长）**。

## 一、DrawCall 与合批

DrawCall = CPU 通知 GPU 绘制一次的调用。移动端 DrawCall 过高直接掉帧，
一般把 UI 场景控制在 **50 以内**，复杂战斗场景 100 以内。

### 合批（Batching）成立的条件

相邻渲染的节点满足以下条件才会合并成一次 DrawCall：

* **同一张贴图**（或同一图集）
* **相同材质 / Shader**
* **渲染顺序连续**（中间没有插入不同贴图的节点）

```
坏：图集A → 图集B → 图集A → 图集B     → 4 个 DrawCall
好：图集A → 图集A → 图集B → 图集B     → 2 个 DrawCall
```

### 实操手段

* **打图集（Auto Atlas）**：把碎图合成大图，这是提升合批率最有效的一招
* **调整节点层级顺序**：把同图集的元素在树里排到一起
* **`cacheMode` 设置**
  * `NONE`：默认，每帧参与合批计算
  * `BITMAP`：静态节点烘焙成一张图，适合**不变的背景、静态面板**
  * `CHAR`：文本按字符缓存，适合**频繁变化的数字**（分数、倒计时）
* **少用 Mask**：`Mask` 会打断合批并增加两次 DrawCall（写模板 + 清模板），
  能用 `Sprite` 的 `FILLED` 类型或裁切图代替就代替
* **富文本 RichText 很贵**：内部按段落拆成多个 Label，能用普通 Label 就别用

## 二、内存与资源

小游戏内存超限会被系统直接杀进程（iOS 尤其严格，一般安全线 **iOS 1G / 低端安卓 512M**）。

### 资源释放

```typescript
// 场景切换时释放上个场景的资源
director.loadScene('Game', () => {
  assetManager.releaseUnusedAssets();  // 释放引用计数归零的资源
});

// 手动管理长期持有的资源
spriteFrame.addRef();   // 我要用，别释放
spriteFrame.decRef();   // 我用完了
```

**贴图变白块**几乎都是释放错误：资源被 release 了但还有节点在引用。
排查思路：看是不是 `releaseAsset` 强制释放了仍在使用的资源，改用引用计数。

### 贴图压缩

原始 PNG 在内存里是**解压后的 RGBA8888**，一张 1024×1024 就是 4MB，
和文件大小无关。压缩纹理能同时降低包体和显存：

| 格式 | 平台 | 说明 |
|------|------|------|
| ASTC | iOS + 现代安卓 | 首选，质量好压缩率高 |
| ETC2 | 安卓（OpenGL ES 3.0+） | 安卓兜底 |
| PVRTC | 老 iOS | 要求 2 的幂次方且正方形 |

Cocos 编辑器里对图集设置压缩格式，构建时自动生成对应平台的版本。

### GC 与对象池

小游戏 JS 引擎的 GC 停顿会造成**可感知的卡顿**。核心原则：**避免在 `update` 里产生垃圾**。

```typescript
// 坏：每帧 new，每秒 60 个垃圾对象
update(dt) { this.node.setPosition(new Vec3(x, y, 0)); }

// 好：模块级复用
const _v3 = new Vec3();
update(dt) { _v3.set(x, y, 0); this.node.setPosition(_v3); }
```

**对象池**：子弹、特效、列表项这类高频创建销毁的节点必须池化。

```typescript
import { NodePool, instantiate, Prefab } from 'cc';

class BulletPool {
  private pool = new NodePool();
  constructor(private prefab: Prefab) {}

  get(): Node {
    // 池空了才 instantiate，否则复用
    return this.pool.size() > 0 ? this.pool.get() : instantiate(this.prefab);
  }
  put(node: Node): void {
    this.pool.put(node);  // 内部会 removeFromParent，节点触发 onDisable
  }
}
```

注意：池化节点复用时走的是 `onEnable` 而不是 `onLoad`，
**状态重置逻辑要写在 `onEnable` 或 `reuse()` 里**，否则会带着上次的残留状态出场。

## 三、启动性能（首屏）

小游戏的留存和首次打开时长强相关，超过 5 秒流失显著。

### 优化手段

* **主包只放首屏必需资源**：登录页、Loading 页、核心引擎代码
* **分包 + 预下载**：玩法资源放分包，在 Loading 阶段后台预载
* **远程资源（CDN）**：大图、音频、Spine 动画走 `loadRemote`，配合本地缓存
* **首屏骨架图**：先出一张静态背景图，再异步加载真实资源，感知等待变短
* **引擎裁剪**：Cocos 构建时勾掉用不到的模块（物理、3D、Tween 等），能省几百 KB

### 加载进度

```typescript
assetManager.loadBundle('game', (err, bundle) => {
  if (err) { this.showRetry(); return; }   // 弱网必须有重试入口
  bundle.loadDir('prefabs', (finished, total) => {
    this.progressBar.progress = finished / total;   // 真实进度，别用假动画
  }, (err, assets) => { /* 完成 */ });
});
```

## 四、定位问题的工具

* **Cocos 内置 Profiler**：`director` 打开 stats 面板，看 FPS / DrawCall / 内存 / 三角面数
* **微信开发者工具性能面板**：真机调试看 CPU、内存曲线
* **抖音开发者工具**：同上，另有包体分析
* **Chrome DevTools**：Cocos 预览走浏览器，可以直接用 Performance 火焰图定位 JS 热点

排查顺序：**先看 FPS 掉在哪一帧 → 看是 CPU 还是 GPU 瓶颈 → CPU 看 JS 火焰图，GPU 看 DrawCall 和填充率**。

## 拓展阅读

- [UI 合批规则](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/ui-batch.html)
- [自动图集（Auto Atlas）](https://docs.cocos.com/creator/3.8/manual/zh/asset/atlas.html)
- [纹理压缩](https://docs.cocos.com/creator/3.8/manual/zh/asset/compress-texture.html)
- [资源释放与引用计数](https://docs.cocos.com/creator/3.8/manual/zh/asset/release-manager.html)
