# 三方登录NPM包


* starblink-third-login三方登录现接入平台含有google、facebook、apple。
* 因为三方登录`需要传入的配置`，和登录api都不相同。
* `starblink-third-login lib `的目的是将这些差异封装起来，
通过提供统一的API进行三方登录调用，它使开发人员的操作过程变得更加便捷。

## 使用

### 使用这些三方登录之前，必须先在各自的开发者平台中注册域名。

```javascript 
    import thirdLogin from 'starblink-third-login';
    // init 预加载js文件，不预加载时候socialLogin.auth('facebook');的时候会加载js
    thirdLogin.init('facebook');
    const onClick = async () => {
    const token = await thirdLogin.auth('facebook');
    console.log(token);
    };
```

### 三方登录方法

| name  | 说明           | 类型                   |
|-------|----------------|------------------------|
| `init`  | 预加载三方登录的js | (type) => Promise      |
| `config` | 修改三方登录的配置| (type, option) => this |
| `auth`  | 调用登录        | (type, option) => Promise |


### 示例

<!-- Init  -->
```javascript
    // 预加载所有的三方登录js
    thirdLogin.init();
    // 只加载传参的js
    thirdLogin.init('facebook');
    thirdLogin.init(['facebook','apple']);
```

<!-- Config -->
```javascript
    //单独配置
    thirdLogin.config('google',{client_id:'********'})
    //更新多个配置
    thirdLogin.config({
        apple:{clientId: 'com.starblink.web.guang',},
        google:{client_id:'********'}
    })
```

<!-- Auth -->
```javascript
//直接调用登录接口,并返回三方登录的token
const token = await thirdLogin.auth('google') 
//修改配置登录

const token = await thirdLogin.auth('google',{client_id:'********'}) 
const token = await thirdLogin.config('google',{client_id:'********'}).auth('google')
```

### 初始化配置

<!-- Apple登录 -->
```typescript
    {
        clientId: 'com.starblink.web.guang',
        redirectURI: window ? window?.location?.origin : '',
        scope: 'email name',
        usePopup: true,
    };
```

<!-- Google登录 -->
```typescript
{
  client_id: '132150157594-ogbdei64tp8pberbm6ugadmot3hrfi6b.apps.googleusercontent.com',
};
```

<!-- - Facebook -->
```typescript
{
  appId: '1764509210599908',
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v17.0',
};
```

## 例子

```typescript
    import thirdLogin from 'starblink-third-login';
    const thirdLogin = async (type: string, token:string)=> {
        const query = `
            mutation {
                thirdLoginAccountV2(
                    channel: ${type}
                    thirdToken: "${token}"
                ) {
                    loginSuccess
                    guangToken
                    email
                    channel
                    thirdToken
                }
            }
        `;
        const { data, errors } = await fetch('/graphql/thirdLoginAccountV2', query);
        return  data.thirdLoginAccountV2.guangToken
    }

    const onClick = async () => {
        const thirdLogintoken = await thirdLogin.auth('facebook');
        const token = await thirdLogin('facebook',thirdLogintoken)
    };
```