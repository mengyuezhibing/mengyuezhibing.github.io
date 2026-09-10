/**
 * ============================================================
 *  站点配置 —— 只改这个文件就能变成你自己的作品站
 * ============================================================
 *  调色板（沙绿 / 奶油 / 金瞳）来自 hero.jpg
 *  内容已与 GitHub @mengyuezhibing 同步
 */

window.SITE_CONFIG = {
  /* ---------------- 1. 个人信息 ---------------- */
  profile: {
    name: 'mengyuezhibing',
    nameCn: '梦月之冰',
    role: 'macOS · DESKTOP DEV',
    github: 'mengyuezhibing',
    email: '3444162072@qq.com',
    qq: '3444162072',
    location: 'China',
    links: [
      { label: 'GitHub', value: 'mengyuezhibing',  url: 'https://github.com/mengyuezhibing' },
      { label: 'QQ',     value: '3444162072',      type: 'qq', url: '' },
      { label: 'QQ邮箱', value: '3444162072@qq.com', url: 'mailto:3444162072@qq.com' }
    ]
  },

  /* ---------------- 2. 首屏文案 ---------------- */
  hero: {
    tagWords: ['OPEN SOURCE', 'macOS'],
    sub: 'SELECTED',
    titleL1: 'BUILD',
    titleL2: 'IN BLOOM',
    slogan: '在 macOS 桌面与日常工具之间，慢慢搭一些自己用得顺手的小东西。',
    // 留空数组则用 GitHub 实时数据填充
    stats: [
      { value: '7',  label: 'REPOS' },
      { value: '4',  label: 'STARS' },
      { value: '2024', label: 'SINCE' }
    ]
  },

  /* ---------------- 3. 精选作品（与 GitHub 仓库同步） ---------------- */
  works: [
    {
      index: '01',
      name: 'Mac-Wallpaper',
      nameEn: 'WALLPAPER',
      role: 'macOS · Swift',
      year: '2025',
      summary: '完全本地运行的 macOS 动态壁纸应用，零 Xcode 依赖。',
      desc: '用 Swift + AppKit 从零实现的菜单栏壁纸应用：导入本地视频作为壁纸、单独增删、菜单栏一键启停、开机自启。整套项目只依赖 Command Line Tools 即可构建。',
      tags: ['Swift', 'AppKit', 'AVFoundation', 'LaunchAgent'],
      accent: '#b8902a',
      cover: './assets/works/wallpaper.jpg',
      repo: 'https://github.com/mengyuezhibing/Mac--wallpaper',
      demo: ''
    },
    {
      index: '02',
      name: 'Mac-Chaofeng',
      nameEn: 'CHAOFENG',
      role: 'macOS · SwiftUI',
      year: '2025',
      summary: '完全本地运行的 macOS 原生 AI 图片 / 视频增强工具。',
      desc: 'SwiftUI 写到底，所有处理都跑在本机：不上传素材、不联网。整合开源 AI 增强方案，重写为对 Apple Silicon 友好的原生版本。',
      tags: ['Swift', 'SwiftUI', 'AI', 'Local-first'],
      accent: '#7da266',
      cover: './assets/works/chaofeng.jpg',
      repo: 'https://github.com/mengyuezhibing/Mac--chaofeng',
      demo: ''
    },
    {
      index: '03',
      name: 'Mac-Shuiyin',
      nameEn: 'SHUIYIN',
      role: 'macOS · Python',
      year: '2025',
      summary: 'macOS 原生友好的视频水印工具，原生支持 Apple Silicon MPS 加速。',
      desc: '整合多个 GitHub 开源水印项目的核心能力，重写为 macOS 友好版本：MPS 后端加速、原生文件对话框、批处理与进度展示。',
      tags: ['Python', 'MPS', 'FFmpeg', 'PyObjC'],
      accent: '#5b4a1f',
      cover: './assets/works/shuiyin.jpg',
      repo: 'https://github.com/mengyuezhibing/Mac--shuiyin',
      demo: ''
    },
    {
      index: '04',
      name: 'Mac-Kecheng',
      nameEn: 'KECHENG',
      role: 'Desktop · Electron',
      year: '2025',
      summary: '桌面悬浮的课表小组件，今日 / 明日课程 + 月历视图 + 上课前通知。',
      desc: '用 Electron 把教务系统课表搬上桌面：以 macOS 为主、Windows 为辅；本地按规则解析，无需 AI / 联网；支持今日 / 明日 + 月历视图，并提供上课前系统通知。',
      tags: ['JavaScript', 'Electron', 'Node', 'Notification'],
      accent: '#9ec188',
      cover: './assets/works/kecheng.jpg',
      repo: 'https://github.com/mengyuezhibing/Mac-kecheng',
      demo: ''
    }
  ],

  /* ---------------- 4. 技术栈 ---------------- */
  stack: [
    { title: 'macOS',  icon: '◧', items: ['Swift', 'SwiftUI', 'AppKit', 'AVFoundation'], accent: '#b8902a' },
    { title: 'AI / ML', icon: '◈', items: ['Python', 'CoreML', 'PyTorch', 'MPS'],          accent: '#7da266' },
    { title: 'Desktop', icon: '◉', items: ['Electron', 'Node.js', 'TypeScript', 'HTML / CSS'], accent: '#5b4a1f' },
    { title: 'Tooling', icon: '⛭', items: ['Shell', 'Make', 'fastlane', 'Git'],           accent: '#9ec188' }
  ],

  /* ---------------- 5. 经历时间轴 ---------------- */
  timeline: [
    { time: '2026 — NOW', title: '继续在 macOS 上折腾', sub: '个人项目', desc: '把日常里能用得上的小工具一点点补齐，重点放在菜单栏与系统集成的体验上。' },
    { time: '2025',        title: '发布 Mac 系列桌面工具', sub: '壁纸 / 超分 / 水印 / 课表', desc: '用 Swift、SwiftUI、Python 与 Electron 做了几个完全本地运行、零联网的小产品。' },
    { time: '2024.10',     title: '在 GitHub 写下第一行代码', sub: 'START', desc: '把"想用就用"的小工具慢慢攒起来，开始持续地记录与开源。' }
  ],

  /* ---------------- 6. 技术日志（tab 自动从 cate 生成） ---------------- */
  notes: [
    { cate: 'macOS', title: 'macOS 动态壁纸：用 AVPlayer + NSWindow 走过的坑', date: '2026-08-20', brief: '从窗口层级、屏保与前台 App 抢焦，到多屏分辨率适配，整理出做菜单栏壁纸应用必须踩过的那几道坎。', url: '' },
    { cate: 'macOS', title: 'SwiftUI 在 macOS 上做视频预览窗口的几种姿势',         date: '2026-07-14', brief: 'NSViewControllerRepresentable、AVPlayerLayer、Metal 渲染各自适合什么场景，以及如何避免离屏卡顿。', url: '' },
    { cate: 'AI',    title: '把 AI 增强跑在 Apple Silicon MPS 上的真实速度',     date: '2026-06-02', brief: '对比 MPS / CPU / eGPU 三种后端在超分与降噪上的吞吐与内存占用，附数据。', url: '' },
    { cate: '工具',   title: 'Electron 桌面小组件：让课表跟着系统通知弹出',         date: '2026-04-18', brief: '用 Electron 写悬浮小组件时遇到的几个 native-bridge 难题：通知去重、权限弹窗、跨 Dock 唤起。', url: '' },
    { cate: '随笔',   title: 'macOS 菜单栏应用：状态项与事件循环的最佳实践',         date: '2026-02-25', brief: '为什么 NSStatusItem 的点击回调里不要做重活，以及如何用一个常驻线程 + RunLoop 解决菜单栏应用的「假死」问题。', url: '' }
  ],

  /* ---------------- 7. 主题（来自 hero.jpg 取色） ---------------- */
  theme: {
    bg:        '#f3f1e2',  /* 奶油纸张 */
    accent:    '#b8902a',  /* 瞳孔金 */
    accent2:   '#7da266',  /* 沙绿 */
    accent3:   '#5b4a1f'   /* 古铜 */
  }
};
