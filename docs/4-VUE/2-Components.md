# Components

## 组件通信
* `组件通信`： props、emit、$parent、$children、$refs、$attrs、$listeners、vuex

  

## 组件导入方式

* `静态导入` 适用于那些在页面初始化时就必须使用的组件，能保证访问时的响应速度。
* `动态导入` 适用于那些不是马上需要使用的组件，可以优化页面的初始加载性能。

### 静态导入

* 这种引用方式属于静态导入，在代码编译阶段就会把这些组件导入进来。也就是说，在项目构建时，Webpack 等打包工具会把这些组件的代码打包到主文件里。
* 优点：组件会在页面加载时就被加载，访问时响应速度快，没有额外的加载延迟。
* 缺点：会增加主文件的体积，使得初始加载时间变长。要是某些组件在页面初始化时并不需要马上使用，就会造成资源的浪费。
* 适用场景：适用于那些在页面初始化时就必须使用的组件，像导航栏、页脚等
  
```js
import { DcsLocalPrice } from '@/share/js/components/common/dcsLocalPrice';
components: {
    DcsLocalPrice,
}
```

### 动态导入

* 原理：这是一种动态导入组件的方式，使用了 ES6 的动态导入语法 import()。在代码运行阶段，当需要用到这个组件时才会去加载它。Webpack 会把这个组件的代码分割成单独的文件（chunk），在需要时再异步加载。
* 优点：能够减少主文件的体积，加快页面的初始加载速度。只有在需要使用某个组件时才去加载它，节省了带宽和资源。
* 缺点：第一次访问该组件时会有加载延迟，因为需要等待组件的代码加载完成。
* 适用场景：适用于那些不是在页面初始化时就需要使用的组件，比如模态框、弹窗等。

```js
  PriceDiscountLabel: () =>
      import(
          /* webpackChunkName: 'PriceDiscountLabel' */ '@components/product/newProductDetail/PriceDiscountLabel.vue'
      )
```
