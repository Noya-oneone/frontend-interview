# Android

* Android 平台确实存在一些情况下不支持或限制使用 Cookies 的问题，尤其是在使用 WebView 或某些特定的网络请求库时。这会影响到会话管理、用户身份验证等功能

* 使用 Web Storage (LocalStorage 或 SessionStorage)
* 通过 HTTP Headers 传递 Token
* 在 WebView 中启用 Cookies
如果你在 Android 的 WebView 中加载网页，可以通过以下方法启用 Cookies 支持
* 使用 SharedPreferences 或 EncryptedSharedPreferences 进行本地存储

```java
WebView webView = findViewById(R.id.webview);
WebSettings webSettings = webView.getSettings();
webSettings.setJavaScriptEnabled(true);

CookieManager cookieManager = CookieManager.getInstance();
cookieManager.setAcceptCookie(true);  // 启用 Cookies
cookieManager.setAcceptThirdPartyCookies(webView, true);  // 启用第三方 Cookies (API 21+)
```

## 单位

###  sp（Scale-independent Pixels） - Android
用途：sp 是 Android 平台上用于字体的推荐单位。它类似于 dp（Density-independent Pixels），但会根据用户的字体大小偏好进行缩放。
原因：使用 sp 可以确保字体大小适应不同屏幕密度和用户设置的字体缩放比例，从而提高可读性和可访问性。这样，如果用户在系统设置中调大或调小了字体大小，应用中的字体也会相应调整。

### dp（Density-independent Pixels） - Android
用途：虽然 dp 主要用于布局尺寸，但在某些情况下（如固定大小的按钮或标题），也可以用作字体单位。
原因：dp 是根据屏幕密度进行缩放的单位，通常不受用户字体设置的影响。在少数情况下，你可能希望字体大小不受用户偏好的影响，此时可以使用 dp。