# 错误监控

https://starblink.feishu.cn/wiki/wikcnMPJruOq1E1xl2AcbOlgXBh

* 现成开源框架：web-see
* **错误告警监控**：sentry 错误日志监控、自研日志错误监控
* **JavaScript错误**： 运行时错误、语法错误、引用错误、类型错误
* **异步错误**：Promise错误、异步函数错误
* **跨域错误**： 资源加载错误、跨域请求被阻止
* **资源加载错误**：图片加载错误、CSS加载错误、JavaScript文件加载错误
* **监控方式**：window.onerror捕获、try...catch捕获、错误事件监听
* **错误信息上报**： 错误类型、错误堆栈、浏览器信息
* **数据处理与分析**： 错误统计、错误分类与归并、错误趋势分析
* **实时告警与通知**： 告警策略、错误次数阈值、错误率阈值
* **通知方式**：邮件通知、短信通知、微信/钉钉机器人通知

## Sentry https://juejin.cn/post/6875955097864994823

```javascript
Sentry.captureMessage('Hello, world!'); // 上报信息
Sentry.captureException(new Error('Good bye')); // 上报异常
Sentry.captureEvent({ // 上报事件
    message: 'Manual',  
    stacktrace: [     
        // ...  
    ], 
});
```

## 步骤

* 监控错误 -> 搜集错误 -> 存储错误 -> 分析错误 -> 错误报警-> 定位错误 -> 解决错误
* sentry 是一个实时事件日志记录和聚合平台。它专门用于监视错误和提取执行适当的事后操作所需的所有信息, 而无需使用标准用户反馈循环的任何麻烦。