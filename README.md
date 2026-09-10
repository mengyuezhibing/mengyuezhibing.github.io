# Endfield 风格 · GitHub 作品展示站

抓取解析 [https://endfield.hypergryph.com/#home](https://endfield.hypergryph.com/#home)（明日方舟：终末地官网）后，用纯 HTML/CSS/Vanilla JS 复刻其动态网页设计语言，改造为可直接在 GitHub Pages 上托管的个人作品站。

---

## 更新日志

### v3 左侧菜单栏与轮播调优

- 新增**左侧固定菜单栏**（终末地风格）：贯穿竖线轨道 + 编号 + 名称，当前板块用金色高亮段标记，滚动自动跟随，与顶部导航双向同步，≥1200px 显示
- 轮播切换从 5.2s 放慢到 **8s**，并修复切换间隔不一致：进度条与切换共用同一起点、切换后重新调度（实测间隔稳定 8000ms）
- 悬停暂停改为 `paused` 标志控制，暂停期间点击导航不会意外重启计时
- 移除「GitHub 实时仓库」板块（首屏数据指标改为直接读 `config.js`）

### v2 沙绿主题与真实作品轮播

- 配色改为沙绿 / 奶油 / 金瞳三色系，标题改用衬线字体
- 首屏接入 `assets/hero.jpg` 作为氛围背景
- 作品区左侧竖线菜单 + 右侧轮播展示应用界面截图
- 4 张应用界面统一裁剪为 1600×1000 JPEG，存放于 `assets/works/`
- 作品 / 技术栈 / 经历 / 日志全部替换为 GitHub 真实数据

---

## 一、原站解析结论

### 技术栈（从产物反推）

| 项 | 结论 |
| --- | --- |
| 框架 | **Next.js App Router**（`/_next/static/chunks/...`、`__next_f.push` RSC 流式载荷） |
| 样式 | **CSS Modules**，类名带 `00-`~`20-` 板块编号，如 `_02-Operator_*`、`_04-Information_*` |
| 路由 | 多语言动态段 `/[lang]/(main)/(home)`，`zh-cn` / oversea 双版本 |
| 适配 | JS 动态写 `html.style.fontSize`（等比缩放），PC 设计稿 `2560×1440`、竖屏 `1080×1920` |
| 资源 | CDN + 图片/视频双规格：预览短片（数十 MB）与完整片（数 GB）分开加载 |
| 数据 | 公告/视频列表在 layout 层通过 Context Provider 预注入（`BulletinListContextProvider` / `VideoListContextProvider`），无需首屏再请求 |

### 板块清单（按 CSS Module 编号还原）

| 编号 | 模块 | 作用 |
| --- | --- | --- |
| 00 | `Loading` | 首屏进度加载动画：symbol 三角阵 + 进度条 + 百分数字 |
| 00 | `landing` | Landing 主视觉：logo / slogan / 下载按钮 / 活动入口 / SCROLL 指示 |
| 01 | `Home` | 页面容器 |
| 02 | `Operator` | 左侧列表 + 右侧详情切换（抽屉式 `drawerWrapper`），核心交互范式 |
| 03 | `Lore` / `gameplay` | 世界观：分栏叙事 + 背景装饰层 |
| 04 | `Information` | 资讯：**Tab 分类**（notices / news）+ 卡片流 + 加载更多 |
| 05 | `Gameplay` | 玩法：多图切换 |
| 06 | `Notice` | 公告详情列表 |
| 08 | `AIC` | 集成工业：图解模块 |
| 09 | `Calendar` | 活动日历（时间轴） |
| 20 | `NoticeDetail` | 公告详情抽屉 |

### 设计语言（可提炼的设计 token）

- **配色**：底色 `#191919` / `#141414` / `#1f1f22`，强调色黄 `#fffa00`、青绿 `#00ffa2`、洋红 `#ff1aac`
- **字体**：标题 `Novecentosanswide`（宽体）/`Gilroy`/`Space Grotesk`；正文 `HarmonyOS Sans SC` 系中文字体
- **装饰**：三角形切角、角标三角阵、等宽大写英文字标签（`letter-spacing` 拉宽）、细分割线 + 编号 `// 01 —`
- **交互**：60%–90% 行程的缓动 `cubic-bezier(.16,1,.3,1)`、遮罩位移滑入、列表 hover 斜向渐显
- **背景**：全屏视频 + 网格 overlay + 噪点纹理 + 暗角

---

## 二、本项目结构

```
作品展示网页/
├── index.html        页面骨架（板块与编号一一对应原站）
├── css/
│   └── main.css      设计系统：Tokens / 组件 / 装饰 / 响应式
├── js/
│   ├── config.js     ★ 只改这个文件：个人信息、作品、技术栈、经历、日志、配色
│   └── app.js        交互：加载动画、rem 自适应、Canvas 背景、滚动揭示、作品轮播、GitHub API
├── assets/
│   ├── hero.jpg      首屏氛围背景
│   └── works/        4 张应用界面截图（wallpaper / chaofeng / shuiyin / kecheng）
└── README.md
```

零依赖、无构建步骤，双击 `index.html` 即可运行。

### 已复刻的动态能力

1. **Loading 屏**：三角阵脉冲 + 进度条 + 三位百分比，加载完自动解锁滚动并移除
2. **rem 等比缩放**：沿用官网思路按视口换算根字号（限制在 0.94–1.25 倍，避免小屏字过小）
3. **Canvas 背景**：粒子连线 + 鼠标磁力线（致敬原站的科技感视觉），已处理 DPR 与 `prefers-reduced-motion`
4. **Scroll Reveal**：`IntersectionObserver` 驱动，支持 `data-delay` 错峰出场
5. **Nav**：滚动吸顶毛玻璃、顶部 scroll progress 扫描线、视口中心命中高亮
6. **左侧固定菜单栏**：贯穿竖线轨道 + 编号，当前板块金色高亮段，滚动跟随并同步顶部导航
7. **作品轮播**（对应 `02-Operator`）：左侧竖线菜单 + 右侧应用界面自动轮播，8s 自动切换（间隔恒定），悬停暂停，支持左右按钮 / 指示点 / 键盘方向键 / 触摸滑动，菜单与轮播双向同步
8. **日志 Tab**（对应 `04-Information`）：分类过滤 + 加载更多

---

## 三、改成你自己的站

### 1. 填个人信息

编辑 `js/config.js`：

```js
profile: {
  name: 'YOUR NAME',        // 导航左上显示名
  nameCn: '你的名字',
  role: 'FRONTEND / CREATIVE DEV',
  github: 'octocat',        // ← 改成你的 GitHub 用户名（会自动拉取你的仓库）
  email: 'you@example.com',
}
```

### 2. 换作品

`works` 数组任意增删，字段说明：

```js
{
  index: '01',                 // 编号
  name: 'Project Frontier',    // 名称
  nameEn: 'FRONTIER',          // 英文代号（详情面板顶部）
  role: 'Web App',             // 分类
  year: '2026',
  summary: '一句话简介',
  desc: '详细描述',
  tags: ['TypeScript', 'Vite'],
  accent: '#fffa00',           // 主色：无封面时用于生成渐变封面
  cover: '',                   // 封面图 URL（留空 = 自动生成渐变封面）
  repo: 'https://github.com/...',
  demo: 'https://example.com'
}
```

> 作品封面推荐尺寸 **1920×1080**（与原站一致）。你可以把它放进仓库 `assets/` 目录后写相对路径，例如 `cover: './assets/work-01.jpg'`。

### 3. 其余内容

`hero`（首屏文案/指标）、`stack`（技术栈）、`timeline`（经历）、`notes`（日志，`cate` 会自动生成 Tab）、`theme`（配色）。

### 4. 换配色

```js
theme: { bg: '#191919', accent: '#fffa00', accent2: '#00ffa2', accent3: '#ff1aac' }
```

---

## 四、本地预览

```bash
cd 作品展示网页
python3 -m http.server 5173
# 打开 http://127.0.0.1:5173
```

> 如需 GitHub 实时数据生效，请**通过 http 访问**而非 `file://` 打开（部分浏览器对 file 协议下的 fetch 有限制）。

## 五、部署到 GitHub Pages

1. 新建仓库 `<你的用户名>.github.io`
2. 把本目录内容推上去
3. Settings → Pages → Source 选 `Deploy from branch` / `main` / `/ (root)`
4. 访问 `https://<你的用户名>.github.io`

自定义域名可在仓库根目录加 `CNAME` 文件写入域名即可。

---

## 六、可以继续加的东西（照着原站扩展）

- `05-Gameplay` → 作品内的多图/多视频切换
- `09-Calendar` → 博客归档按年月分组
- `20-NoticeDetail` → 点击日志卡片右侧滑出详情抽屉（当前是跳外链）
- 视频背景：把 `.landing__canvas` 换成 `<video autoplay muted loop playsinline>` + 静音自动播放
- i18n：复制 `config.js` 为 `config.en.js`，按语言切换注入
