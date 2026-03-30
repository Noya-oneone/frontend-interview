# Case Websocket

Websocket 通信问题、 WebSockets 心跳监听

https://starblink.feishu.cn/wiki/wikcn5GOFIH7ZmLrBqBkY8igWYd
https://starblink.feishu.cn/wiki/wikcnNS3ytPMvun1o9Vq9d4bTDg


## Websocket 通信问题、 WebSockets 心跳监听
* `握手过程`：
  * 客户端通过 HTTP 请求发起握手，包括 Upgrade: websocket 头部。
  * 服务器回应 HTTP 101 状态码，完成协议的升级。

* `数据传输`：
  * 一旦连接建立，数据以帧的形式传输。每个帧可以包含文本、二进制数据或控制信息。
  * 客户端和服务器都可以随时发送和接收数据，支持双向通信。

* `连接管理`：
  * Ping/Pong：用于保持连接的活跃状态和测量延迟。
  * 关闭：使用关闭帧正常终止连接，确保数据完整传输。

* `安全性`：
  * 数据传输通过 wss://（WebSocket Secure）进行加密，确保数据的安全。
  * 可能结合其他认证机制进行连接验证。


