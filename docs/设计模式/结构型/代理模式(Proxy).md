# 代理模式

* 代理模式（Proxy Pattern）是一种`结构型设计模式`，它通过`创建一个代理对象来控制对另一个对象的访问`。
* 代理对象可以在不改变原对象的情况下，提供额外的功能或控制其访问。
* 这种模式常用于以下场景
    * 延迟加载
    * 安全控制
    * 日志记录
    * 访问控制等。

* `真实对象（Real Object）`：实际要操作的对象，它实现了某些具体的业务逻辑。
* `代理对象（Proxy）`：代替真实对象进行操作，控制对真实对象的访问。代理对象可以实现额外的功能，如访问控制、缓存、日志记录等。

## 代理模式类型

* 虚代理（Virtual Proxy）：用于`延迟加载真实对象的创建和初始化，直到真正需要时才进行操作`。常用于需要大量资源的对象的延迟加载。
* 保护代理（Protective Proxy）：用于控制对真实对象的访问，确保`只有满足某些条件的用户才能操作真实对象`。常用于权限控制和安全管理。
* 缓存代理（Cache Proxy）：用于缓存对真实对象的访问结果，`减少重复计算或请求的次数，提高效率`。
* 远程代理（Remote Proxy）：用于在网络上代表真实对象进行操作，处理网络通信等远程操作的细节。

## 优点：

* `增强功能`：代理可以在不改变真实对象的情况下，为其增加额外的功能，如日志记录、缓存等。
* `控制访问`：代理可以控制对真实对象的访问，提供额外的`安全和权限控制`。
* `延迟加载`：虚代理可以延迟加载真实对象，`节省资源，提高性能`。

## 缺点：

`增加复杂性`：引入代理对象会增加系统的复杂性，`增加了对象间的关系和层级`。


```javascript
// RealObject.js
class RealObject {
    constructor() {
        console.log('RealObject created');
    }

    performOperation() {
        console.log('Performing operation');
    }
    performSensitiveOperation() {
        console.log('Performing sensitive operation');
    }
}

// Proxy.js
class Proxy {
    constructor() {
        this.realObject = null;
        this.user = user;
    }

    performOperation() {
        if (!this.realObject) {
            this.realObject = new RealObject(); // 延迟加载
        }
        this.realObject.performOperation();
    }
   performSensitiveOperation() {
        if (this.user.isAdmin) {
            this.realObject.performSensitiveOperation();
        } else {
            console.log('Access denied');
        }
    }
}

// Usage
const proxy = new Proxy();
proxy.performOperation(); // 只有在这里才创建 RealObject

const adminUser = { isAdmin: true };
const normalUser = { isAdmin: false };

const adminProxy = new Proxy(adminUser);
adminProxy.performSensitiveOperation(); // 允许访问

const normalProxy = new Proxy(normalUser);
normalProxy.performSensitiveOperation(); // 访问被拒绝
```