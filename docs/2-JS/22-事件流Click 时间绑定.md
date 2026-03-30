# 事件流

* 事件流描述的是从页面中**接受事件的顺序**
* 事件流分为三个阶段：
    * `事件捕获阶段`：从document对象开始，沿着DOM树向下传递，直到目标元素，触发事件的元素
        事件捕获（event capturing）：通俗的理解就是，当鼠标点击或者触发dom事件时，浏览器会从根节点开始由外到内进行事件传播，即点击了子元素，如果父元素通过事件捕获方式注册了对应的事件的话，会先触发父元素绑定的事件
    * `处于目标阶段`：触发事件的元素
    * `事件冒泡阶段`：从触发事件的元素开始，沿着DOM树向上传递，直到document对象，触发事件的元素
    事件冒泡（dubbed bubbling）：与事件捕获恰恰相反，事件冒泡顺序是由内到外进行事件传播，直到根节点


    全局捕获：**需要在事件传播到目标元素之前拦截，比如全局的输入验证、权限控制等逻辑**。
    * 防止冒泡阶段的干扰

<!-- addEventListener的第三个参数决定把事件注册在捕获（true）还是冒泡(false) -->

<!-- event.preventDefault()：取消事件对象的默认动作以及继续传播。
event.stopPropagation()/ event.cancelBubble = true：阻止事件冒泡。 -->

<!-- preventDefault告诉浏览器不用执行与事件相关联的默认动作（如表单提交）
stopPropagation是停止事件继续冒泡，但是对IE9以下的浏览器无效 -->
<!-- stopImmediatePropagation 同样也能实现阻止事件，但是还能阻止该事件目标执行别的注册事件 -->

```html
<!DOCTYPE html> 
<html>
<head>
    <title>事件流</title>
</head>
<body>
    <div id="div1">
        <p id="p1">我是p1</p>
        <p id="p2">我是p2</p>
    </div>
    <script>
        // 直接绑定
        document.getElementById('div1').onclick = function () {
            console.log('div1被点击了1');
        }
        // 事件监听器
        document.getElementById('div1').addEventListener('click', function () {
            console.log('div1被点击了2');
        }, false);
        // 事件捕获
        document.getElementById('div1').addEventListener('click', function () {
            console.log('div1被点击了3');
        }, true);
    </script>
</body>
</html>
```

点击div1，控制台输出：

```bash
div1被点击了1
div1被点击了2
div1被点击了3
```


事件捕获阶段 处于目标阶段 事件冒泡阶段 addeventListener 最后这个布尔值参数如果是true，表示在捕获阶段调用事件处理程序；如果是false，表示在冒泡阶段调用事件处理程序。
因为js是单线程的。浏览器遇到etTimeout 和 setInterval会先执行完当前的代码块，在此之前会把定时器推入浏览器的
待执行时间队列里面，等到浏览器执行完当前代码之后会看下事件队列里有没有任务，有的话才执行定时器里的代码

| 方式 | 绑定方式  触发顺序 | 备注|
| ------------- | ---------- | ----------------------- | ------------------------ |
| 直接绑定 | `element.onclick = function () {}` | **冒泡阶段** | 绑定在捕获后触发 |
| 事件监听器 | `element.addEventListener('click', callback)` | **可以指定冒泡或捕获阶段** | 默认为冒泡，可通过第三个参数控制 |
