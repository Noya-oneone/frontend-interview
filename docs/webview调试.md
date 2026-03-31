
## IOS webview 调试


*  菜单栏点击：Safari > 偏好设置（Preferences） > 高级
* 勾选最底下的 ✅「在菜单栏中显示“开发”菜单」
*  开启 Web 检查器（Web Inspector）
* 使用数据线连接手机和 Mac
* 打开你手机里的 App（WebView 页面）
* 等待电脑上 Safari 中的“开发”菜单出现设备信息


#### **第一步：iPhone设置**

**1. 开启Web检查器**
```
iPhone设置 → Safari → 高级 → Web检查器 (开启)
```

**2. 开启开发者选项（可选）**
```
iPhone设置 → 隐私与安全性 → 开发者模式 (如果有的话)
```


#### **第二步：Mac Safari设置**

**1. 开启开发者菜单**
```
Safari → 偏好设置(⌘,) → 高级 → "在菜单栏中显示开发菜单" (勾选)
```

#### **第三步：连接设备**

**1. USB连接**
- 用USB线连接iPhone和Mac
- iPhone会弹出"要信任此电脑吗？"
- 点击"信任"
- 可能需要输入iPhone密码

**2. 验证连接**
- 在Mac的Safari菜单栏会出现"开发"菜单
- 点击"开发"应该能看到你的iPhone设备名

---

### **🚀 开始调试**

#### **步骤1：在iPhone打开网页**
```
在iPhone Safari中访问你要调试的网页
例如：http://192.168.1.100:3000 (你的本地开发服务器)
```

#### **步骤2：在Mac连接调试器**
```
Mac Safari → 开发菜单 → [你的iPhone名称] → [网页标题]
```

#### **步骤3：调试面板**
会弹出Web Inspector调试面板，包含：
- **元素**：查看/修改HTML和CSS
- **控制台**：JavaScript错误和日志
- **源代码**：查看源文件和断点调试
- **网络**：监控HTTP请求
- **时间线**：性能分析
- **存储**：LocalStorage、SessionStorage、Cookie


## 安卓webview 

* chrome://inspect/#devices



## 常见问题解决

#### **问题1：iPhone设备不显示在开发菜单中**
**解决方案：**
```
1. 重新插拔USB线
2. 重启iPhone Safari
3. 重启Mac Safari
4. 检查USB线是否支持数据传输
5. 尝试不同的USB端口
```

#### **问题2：无法访问本地开发服务器**
**解决方案：**
```bash
# 1. 启动服务器时绑定所有网络接口
npm run dev -- --host 0.0.0.0

# 2. 获取Mac的IP地址
ifconfig | grep "inet " | grep -v 127.0.0.1

# 3. 在iPhone中访问
http://你的IP地址:端口号
```

#### **问题3：HTTPS网站调试**
**解决方案：**
```bash
# 生成本地HTTPS证书
npm run dev -- --https

# 或者在iPhone中信任自签名证书
设置 → 通用 → 关于本机 → 证书信任设置
```


