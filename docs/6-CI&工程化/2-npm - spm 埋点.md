# NPM 埋点包

## 使用
<!--初始化 -->
```javascript
import { track } from '@guang/vue-track';
export const config = {
 spmPrefix: 's0.c5',
 uploadUrl: '<https://front-log-v1.starblink.co/app>',
 pageConfig: {
'/collection-gifts': 10001,
 },
 elementConfig: {
termsBtn: 20001,
try:20002
 }
}
app.use(track, { config, router }); // 埋点注册
```

## 元素点击上报

### 指令上报
```javascript
// 元素 clickvalue为elementConfig的key
<div v-track:click="'termsBtn'">按钮</div>
// 元素 click带参数value为elementConfig的key
<div v-track:click="{name:'termsBtn',params:'1111'}">b</div>
// 元素click 且立即上传数据
<div v-track:click.immediate="'termsBtn'">c</div>
// 元素的值为可更新 clickvalue为elementConfig的key 
<div v-track:update.click :data-track-value="content===0?`termsBtn`:'try'"></div>
```

### useHooks上报
```javascript
import {useTrack} from '@guang/vue-track';
const {trackClickElement} = useTrack()
// 元素上报key为termsBtn，且立即上报，并且返回当前spm信息
const spmInfo = trackClickElement('termsBtn',true)
// 元素上报key为termsBtn并携带参数，并且返回当前spm信息
const spmInfo = trackClickElement({name:'termsBtn',...params})
```


## 元素曝光上报

```javascript
 <div v-track:exposure="'termsBtn'">c</div>
  <div v-track:exposure.immediate="'termsBtn'">c</div>
  // 曝光和点击都会上报>  
  <div v-track:event.click.exposure="'termsBtn'">d</div>
  // 曝光和点击都会上报, 也可以传对象
  <div v-track:event.click.exposure="{name:'termsBtn',...params}">6</div>
```

## 页面曝光上报

### 路由自动页面曝光
* 初始化传入的router对象,会监听自动根据history.location.path路径曝光

```vue
router.afterEach
```

###  指令爆曝光

* 若要曝光当前页面并携带参数，请关闭router自动页面曝光功能
* 同一个page-key的页面曝光，请三选一，不要同时使用

```vue
<!-- 当前页面的router地址，当做key去生成spm，若和router重合，会去重处理 -->  
 <div v-track:page.exposure>a</div>
 <!-- 页面曝光携带参数 -->  
 <div v-track:page.exposure.extra="{status:0}">a</div>
 ```

 <!-- 页面关闭自动曝光 -->
```typescript
  {    
     path: '/pageOne',   
     component: () => import('./pages/pageOne.vue'),    
     meta: { hideTrack: true },
   },
 ```

 ### useHooks上报

 ```typescript
  import {useTrack} from '@guang/vue-track';
  const {trackPage} = useTrack()
  // 如果已经关闭了router自动曝光，name最好和当前路由同名
  trackPage({name:'/page-path',...params})
 ```

## 页面停留时间上报

* 页面停留时间，根据当前的pageKey计算页面停留时间，所以，用何种方式上报的页面曝光，就要调用相应的停留时间。

* 1. 若页面是router自动曝光
`会自动计算当前的页面停留时间`
* 2. 指令曝光
`当当前元素销毁的时候，会去计算停留时间`
* 3. useHooks曝光
`需要手动计算曝光时间`

 ```typescript
  import {useTrack} from '@guang/vue-track';
  const {trackPage,leavePage} = useTrack()
  onMounted(()=>{  
      trackPage({name:'/page-path'})
  })
  onUnmounted(()=>{ 
      leavePage({name:'/page-path'})
  })
 ```


## Config API

| 参数 | 说明 | 类型 | 默认 | 示例 |
|--|--|--|--|--|
| `spmPrefix`| A:站点 B:端 的值| string | 必填| s0.c2|
| `uploadUrl`| 埋点数据上传地址| string | 必填 | https://test-front-log-v1.starblink.co/app |
| `thresholdInterval` | 页面曝光上传时间阈值| number | 5000| |
| `pageConfig` | spm对应页面配置字典(飞书页面表，更新) | object | 必填| 页面SPM表-H5 |
| `elementConfig` | spm对应元素配置字典(飞书元素表，更新) | object || 元素控件-H5|
| `baseInfo` | 全局配置，额外的埋点参数 | object || baseInfo: { deviceId: '******', userId: '******', token: () => { return localStorage.getItem('token'); }, } |
| `closePageStay`| 关闭页面停留时间计算| boolean| false | |
| `custom`| 开启自定义数据上传(若开启自定义上传，spm将不上传) | function || custom: (props) => {}|
| `both`| 同时开启自定义数据上传和spm数据上传 | boolean| false | |
