# React Native

## 特点

* **代码更改后会自动刷新，节省等待时间**
* **支持热更新，更新无需重新安装App** CodePush（微软出品，服务器在海外）  Pushy（React Native中文社区出品）
* **跨平台，iOS/Android**
* **组件化开发，易于管理维护，代码复用率高**
* **JSX，声明式编程，易于学习**
* **丰富的UI组件库，提升开发效率**
 
* 系统适配方面， IOS版本略好，android发展较慢；
* 开发复杂应用必须精通原生开发，开发效率并不比原生开发的熟手快。很多问题（包括兼容性问题解决）任然需要原生开发。
* 升级RN版本或需要大动干戈，尤其向下兼容不好；
* RN组件库并不是全面，当遇到某些特殊功能，需要花费大量时间、精力进行插件开发 （`react-native-cli和react-native-create-library`）

* `异步存储`： Async Storage ：基于 Web 的本地存储版本，需要存储全局应用程序范围的变量、持久的 GraphQL 或 Redux 状态或我们`希望在用户关闭应用程序后保留的其他非敏感数据时`，异步存储非常有用



* 初始化电脑的一套标准 . kleco-installer --install --upgrade
* 开发规范： ticket->branch->commit->builds->pr->merge

* 0、React Native API 
* 1、bubble UI (一套公共组件库)
    * 
* 2、scripts （常见的脚本执行命令有哪些，怎么把项目跑起来）
* 3、story
   组件 UI 效果预览
* 4、sentry
   错误日志监控
* 5、cli (lint / type/  package / translation)
    lint：检查代码规范
    type：检查代码类型
    package：打包项目
    translation：翻译项目 (yarn translations:push)
* 6、screen shot
    快照对照 - 自动化测试过程
* 7、Jest
    单元测试
* 8、BFF
* 9、PR/CR
* 10、CI/CD
* 11、Event Tracking
    * 漏出一半及以上且停留一秒才算曝光
    * 与参数结合使用
     i.e：View shopping item and feature=recommendations and route = productCard（首页feed商品卡片曝光）
    * APP - mParticle - Amplitude (用户可根据用户id查询自己所做的每一步操作，延迟5s左右，类似于目前的阿里云日志平台,可搭建数据看板)
    * APP - mParticle - Lakehouse (数据湖，所有埋点数据最终归档在这里)


Flipper 调试工具链


```bash
# 纯JS 的RN项目
npm install -g expo
expo init expo-app

# 混合原声开发的RN项目
npm install -g react-native-cli
react-native init RNApp
```

## 混合开发

### 大型 Hybrid App 的目录分层

* Bin (脚手架 cli 执行文件)
* git-hooks(git 提交规范)
* pipeline （管道，Jenkins执行文件）
* services （服务层）
* lib 核心组件
* clients（客户端层）

### H5-flow

* service->bff->clients->jsBridge<->h5

## 架构分层

* 业务层
* 基础层
    * 网络层
    * 日志
    * 权限
    * 工具箱
    * 配置
    * 常量
    * 主题
    * 国际化
* Service
    * SP
    * API
    * sqlite
* 组件层
    * toast
    * banner
    * 刷新
* 扩展层
  * 埋点
  * 支付
  * IM
  * 分享
  * 缓存
  * 推送



