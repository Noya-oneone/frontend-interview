# 脚手架CLI

## 开发脚手架原因
* 新开工程往往是自己去找外部框架，导致前端工程所用的框架太多，
* 业务交叉迭代时往往需要一定的工程理解成本
* 需要相关CLI来帮助我们生成工程模板，模板里边集成常用组件包、工具类等。使得前端代码结构统一化、规范化、标准化。

## 脚手架内容
* `代码规范`：开发人员有各自的代码开发习惯，需要有一套统一的代码规范。
  * eslint
  * stylelint
  * prettier
* `组件复用` （公司不同业务往往存在许多高频的功能模块，存在重复造轮子的现象。）
    * SPM 埋点
    * 三方登陆（google、facebook、apple）
    * lib-flexible + postcss-pxtorem自适应方案 
    * 邮件模板
* `常用的工具utils`（防抖、节流等）
* `运维配置文件`：
  * Dockerfile
  * nginx.conf
  * .npmrc指定 
  * .env.dev、env.prod、.env.testing

## 脚手架的使用

```bash
# 安装脚手架
npm i xcfe -g 

# 生成模板工程
xcfe create my-app
xcfe create .

# 生成页面和路由
xcfe page pageA

# 开发环境部署
xcfe p dev
```

## 脚手架开发用到的第三方

| 名称       | 简介                         |
|------------|------------------------------|
| `commander`  | 命令行自定义指令              |
| `inquirer`   | 询问用户问题，记录回答结果    |
| `figlet`     | 控制台打印logo                |
| `kolorist`   | console.log文字染色           |
| `Oclif`     | 创建命令行工具的框架          |
| `chalk`     | 颜色改变                     |
| `yargs`      | 命令行参数解析工具            |
| `Ora`       | loading状态显示               |


## 具体代码实现

```javascript
  // Step1:创建页面
  program.command('page <name>')
    .description('create a new page')
    .action(async name => {
        await addPage({
            pageName: name,
            routerLocation: path.join(process.cwd(), 'src', 'router.ts'),
            pageLocation: path.join(process.cwd(), 'src', 'pages'),
        })
        console.log(green('新增页面成功.'))
    })

  // Step2: addPage方法 (pageName:页面名称、routerLocation:router.ts文件所在位置、pageLocation:pages文件夹所在位置) 
  export const addPage = async ({
    pageName, routerLocation, pageLocation
  }) => {
    // 新建文件夹
    await fsPromises.mkdir(path.join(pageLocation, pageName))
    // 新建index.vue文件
    await fsPromises.writeFile(path.join(pageLocation, pageName, 'index.vue'), indexVue({pageName}))
    // 新建index.scss文件
    await fsPromises.writeFile(path.join(pageLocation, pageName, 'index.scss'), indexScss({pageName}))
    const output = generateRouterCodes({pageName, routerLocation})
    writeFile(routerLocation, output)
  }

  // // Step3: 利用babel生成目标代码
  export const generateRouterCodes = ({
    pageName, routerLocation
  }) => {
    const {ast} = babel.transformFileSync(routerLocation, { 
      ast: true,
      plugins: [tsBabelPath]
    })
    traverse.default(ast, {
      enter(path) {
        if (path.isArrayExpression()) {
          if (path?.parent?.id?.name === 'routes') {
            let field = t.objectExpression([
              t.objectProperty(t.identifier('path'), t.stringLiteral(`${Path.sep}${Path.join(pageName)}`)),
              t.objectProperty(t.identifier('component'), t.identifier(upperCaseFirstLetter(pageName))),
            ])
            path.node.elements.push(field)
          }
        } else if (path.node.type === 'Program') {
          // 需要插入的节点
          const node = t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(upperCaseFirstLetter(pageName)))],
            t.stringLiteral(`.${Path.sep}${Path.join('pages', pageName, 'index.vue')}`)
          )
          path.node.body.unshift(node)
        }
      },
    })
    let output = CodeGenerator.default(ast, {})
    return output.code
  }

  // Step4: 发布流水线
  program.command('p <env>')
    .description('help to restart the deployment flow.')
    .action(async(env) => {
        const configList = (await readFile(
            new URL(path.join(process.cwd(), `.env.${env}`), import.meta.url), 'utf-8'
        )).split('\n')
        for (let config of configList) {
            if (config) {
                let pair = config.split('=')
                let key = pair[0]
                if (key.trim() === 'VITE_FLOW_URL') {
                    let value = pair[1]
                    let res = await axios.post(value, {})
                    if (res?.data?.successful) {
                        console.log(green('流水线已开始运行.'))
                    }
                }
            }
        }
    })
```   


## 脚手架的基本概念

1、基于文本界面，通过`键盘输入命令执行`（脚手架本质上就是操作系统上的一个客户端 node node.exe）
2、最常见的脚手架 NPM、Webpack-CLI  、VUE-CLI、 REACT-CLI  
3、目的：研发提效、前端工程化（项目启动、项目构建流程）
  `项目创建`、`项目下载`、`项目测试`、`项目提交`、`项目发布`
  命令后特殊显示、命令行交互
  使用Node 开发脚手架（javascript、typescript、强大生态环境-三方库、包管理器）

* `Shell` 是计算机提供给用户与其他程序进行交互的接口
* `Shell` 是一个命令解释器，当你输入命令后，由Shell 进行解释后交给操作系统内核（OS Kernel）进行处理
* 图形操作系统是 GUI Shell
* `Bash`  是一种程序，它的职责是用来进行人机交互, 是shell 的一种实现
* `Bash` 和其他程序最大的区别在于，它不是用来完成特定任务（如计算器、文件管理等），我们通过bash Shell 来执行程序
* `Bash` 使用了一种与图形界面相反的方案：通过纯文本的控制台进行控制，它的主要交互方式通过键盘输入文本，文字反馈来实现人机交互 使用脚手架命令  ls cd
* Unix mac 都会提供CLI和GUI（Graphcial user interface）
* CLI是Bash 的运行环境
* CLI接收键盘输入、交给Bash 执行，结果返 回文本进行显示 、 （终端、 cmd.exe 都是CLI）
