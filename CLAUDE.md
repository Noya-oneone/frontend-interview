# CLAUDE.md

面向 Claude Code 的项目约定。用户视角的介绍见 [README.md](./README.md)。

## 项目性质

零构建的单文件知识库阅读器。`index.html` 一个文件包含全部 HTML/CSS/JS，`docs/` 下是 350 篇 Markdown。
**没有 package.json、没有构建步骤、没有测试框架** —— 不要引入打包器、框架或 npm 依赖来"改进"它，
这个零依赖特性是刻意的，保证 clone 下来双击就能用。

## 本地预览

```bash
python3 -m http.server 8080
```

`.claude/launch.json` 已配好同样的命令，可直接用 preview 工具启动。

注意：`file://` 直接打开时 `fetch('catalog.json')` 会失败，此时会回退到 `INLINE_CATALOG`
（见下方「目录数据双轨制」）。验证目录相关改动时务必用 HTTP 服务器，否则测的是内联那份旧数据。

## 目录数据双轨制（易踩坑）

目录数据同时存在于两处，**修改时必须同步更新，否则两种打开方式下表现不一致**：

| 位置 | 用途 | 何时生效 |
|------|------|----------|
| `catalog.json` | 主数据源 | HTTP 访问时 |
| `index.html` 内的 `INLINE_CATALOG` | 回退副本 | `file://` 打开、fetch 失败时 |

新增或删除文档后，两处都要改。`catalog.json` 的 fetch 带 `cache: "no-cache"`，
是为了避免目录更新后浏览器读到旧缓存。

## 分类顺序

侧栏与首页索引共用 `index.html` 里的 `CAT_ORDER` 常量，按学习路径排列：

```
基础(HTML→CSS→JS→HTTP) → 框架(Vue→React→Node) → 工程(工程化→移动端→调试监控)
→ AI → 算法体系(数据结构→算法→设计模式→面向对象) → 综合专题
```

`sortCatalog()` 按此顺序重排；未在 `CAT_ORDER` 中登记的新分类自动排到末尾，不会丢失。
新增分类时同时更新 `CAT_ORDER` 和 `CAT_NAMES`。

## 设计约定

配色是**墨色 + 冷象牙 + 古铜鎏金**，全部走 `:root` CSS 变量，不要写死颜色值。

- 强调色是古铜鎏金 `--accent`，**不是红色**。红色只保留一处：品牌印章 `--seal-red`，作为唯一视觉落款
- 深墨侧栏用 `--gold` 系列，纸面正文用 `--accent` 系列，两套不要混用
- 侧栏分类不使用 emoji 图标，用 EB Garamond 衬线序号（01/02…）
- 字体：中文标题 Noto Serif SC，数字/西文眉题 EB Garamond，正文系统无衬线

改配色时用对比度校验，正文文字保持 WCAG AA（≥4.5）。刻意弱化的次要信息
（面包屑、计数、代码注释）允许在 3.5–4.1 区间，提太高反而抢主体。

## 代码高亮

`highlight()` 是自己实现的轻量 tokenizer，不依赖 highlight.js。输入是 marked 转义后的 HTML，
**单趟扫描**：注释/字符串优先整体消费，避免生成的 `<span>` 标签被后续规则二次匹配。

修改高亮逻辑后必须验证**代码文本零改动**（`code.textContent === 原始源码`），
这是最容易出错的地方 —— 两趟正则会互相污染，把标签本身当成待处理文本破坏代码。
边界用例：字符串内含关键字、HTML 代码块、注释内含引号、TS 泛型。

## Git

- 远端走 SSH 别名 `git@github.com-personal:...`，**push 不需要切 gh 账号**
- 仅当使用 `gh` CLI 时才需 `gh auth switch --user Noya-oneone`，用完切回 `noya-liu`
- commit message 用简体中文，前缀 `docs:`（内容）/ `feat:`（功能）/ `fix:` / `refactor:` / `chore:`
