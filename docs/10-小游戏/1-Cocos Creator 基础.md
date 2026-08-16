# Cocos Creator 基础

Cocos Creator 是「编辑器 + 引擎 + 构建工具链」一体的方案。当前主流是 3.x（TypeScript + 组件化），
2.x 还有大量存量项目（`cc.Class` 写法，API 不兼容）。

## 核心概念：Node + Component

和 Unity 的 GameObject/Component 是同一套心智模型：

* **Node（节点）**：只负责树形层级和 Transform（position / rotation / scale）
* **Component（组件）**：挂在节点上提供能力（渲染、碰撞、脚本逻辑）
* **Scene（场景）**：节点树的根，一个游戏由多个场景组成
* **Prefab（预制体）**：可复用的节点子树，运行时 `instantiate()` 出实例

```typescript
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
  @property          // 暴露到编辑器面板，可视化配置
  speed: number = 100;

  @property(Node)    // 引用类型必须显式声明类型
  target: Node = null;

  onLoad() {}        // 节点首次激活，早于 start，做初始化
  start() {}         // 首次 update 前，做依赖其他组件的初始化
  update(dt: number) {
    // dt 是「距上一帧的秒数」，一切位移都要乘 dt，否则高刷屏上速度翻倍
    const p = this.node.position;
    this.node.setPosition(p.x + this.speed * dt, p.y, p.z);
  }
  onDestroy() {}     // 清理定时器、事件监听、外部引用
}
```

### 生命周期顺序（高频考点）

```
onLoad → onEnable → start → update(dt) → lateUpdate(dt) → onDisable → onDestroy
```

* `onLoad`：节点及其子节点初始化完毕，**拿引用、初始化数据**放这
* `onEnable` / `onDisable`：每次激活/禁用都触发（对象池复用时会多次触发，注意幂等）
* `start`：只执行一次，在第一次 `update` 前。依赖别的组件 `onLoad` 结果的逻辑放这
* `lateUpdate`：所有 `update` 之后，**相机跟随**这类要等目标位置定稿的逻辑放这

## 坐标系与节点变换

* 3.x 用 **右手系**，Y 轴向上，2D 游戏 Z 恒为 0
* `node.position` 是**本地坐标**（相对父节点），`worldPosition` 才是世界坐标
* 频繁改变换用 `setPosition(x, y, z)` 而不是 `node.position = new Vec3(...)`，避免每帧 new 对象

```typescript
// 坏：每帧产生垃圾对象，GC 压力大
node.position = new Vec3(x, y, 0);
// 好：复用临时变量
const _tmp = new Vec3();
_tmp.set(x, y, 0);
node.setPosition(_tmp);
```

## UI 系统

* **Canvas**：UI 根节点，挂 `UITransform`，负责屏幕适配
* **Widget**：相对父节点对齐（上下左右居中），做**刘海屏 / 不同宽高比适配**的主力
* **Layout**：自动排列子节点（水平/垂直/网格）
* **UITransform**：尺寸和锚点，`anchorPoint` 默认 (0.5, 0.5)

### 屏幕适配

Canvas 上的 `ResolutionPolicy` 决定缩放策略：

| 策略 | 行为 | 适用 |
|------|------|------|
| `FIT_WIDTH` | 宽度铺满，高度可能溢出 | 竖屏游戏主流 |
| `FIT_HEIGHT` | 高度铺满，宽度可能留黑边 | 横屏游戏 |
| `SHOW_ALL` | 完整显示，可能双向留黑 | 保证不裁切 |

竖屏小游戏常用做法：设计分辨率 750×1334，`FIT_WIDTH`，
然后**关键 UI 用 Widget 贴边**，中间内容允许高度上被裁切。

## 事件系统

```typescript
// 触摸事件
this.node.on(Node.EventType.TOUCH_END, this.onTap, this);
// 自定义事件：向上冒泡
this.node.emit('score-changed', 100);
// 全局事件总线（跨模块通信）
import { director } from 'cc';
director.on('game-over', this.onGameOver, this);
```

**注意**：`on` 的第三个参数 `this` 必须传，否则回调里 `this` 丢失。
`onDestroy` 里要 `off` 掉，尤其是 `director` 上的全局监听，否则节点销毁后回调仍会触发导致空引用崩溃。

## 资源加载

3.x 用 `resources` 目录 + `assetManager`：

```typescript
import { resources, SpriteFrame, Prefab, instantiate } from 'cc';

// 动态加载（路径不含 resources/ 前缀和扩展名）
resources.load('ui/icon/coin/spriteFrame', SpriteFrame, (err, sf) => {
  if (err) { console.error('加载失败', err); return; }  // 必须处理 err，网络包很容易失败
  sprite.spriteFrame = sf;
});

// 远程资源（CDN 上的图，减小包体的关键手段）
assetManager.loadRemote<ImageAsset>(url, (err, img) => { /* ... */ });
```

**引用计数**：`assetManager` 用引用计数管理释放。手动 `addRef()` / `decRef()`，
或者用 `resources.release(path)`。释放错了会出现「贴图变白块」——这是最常见的线上事故之一。

## 与 Web 前端的心智差异

| Web | Cocos |
|-----|-------|
| DOM 树 + CSS 布局 | Node 树 + Widget/Layout |
| 事件冒泡到 document | 事件冒泡到 Scene 根 |
| `requestAnimationFrame` | `update(dt)` |
| 打包器管依赖 | 编辑器管资源引用（uuid + meta） |
| 内存交给 GC | 资源需手动管引用计数 |

## 拓展阅读

- [Cocos Creator 官方手册](https://docs.cocos.com/creator/3.8/manual/zh/)
- [生命周期回调](https://docs.cocos.com/creator/3.8/manual/zh/scripting/life-cycle-callbacks.html)
- [多分辨率适配方案](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/multi-resolution.html)
- [动态加载资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/dynamic-load-resources.html)
- [Cocos Creator API 文档](https://docs.cocos.com/creator/3.8/api/zh/)
