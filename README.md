# Picksy

## 功能特性

- **两种抽取模式** —— 经典列表抽取或动画转盘，一个开关即可切换
- **随机点名** —— 从你的名单中即时抽取一个名字，并伴随彩带庆祝
- **参与者列表** —— 手动添加名字（每行一个），或上传 `.txt` / `.csv` 文件
- **中奖提示** —— 自定义抽取名字时显示的消息
- **抽中后移除** —— 名字被抽中后可选择将其从池中移除
- **全屏 + 缩放** —— 演示时可进入全屏，并在 50%–150% 之间缩放
- **浅色 / 深色模式** —— 桌面端在导航栏切换，移动端在底部栏切换
- **动画底部栏** —— 移动优先的导航，支持下拉手势关闭的抽屉和流畅的 framer-motion 过渡
- **完全客户端运行** —— 任何数据都不会发送到服务器，一切都在浏览器中运行
- **状态持久化** —— 主题、名字列表、中奖提示、抽取模式和行为设置都通过 Jotai 保存到 `localStorage`

## 技术栈

| 库                    | 版本 | 用途                           |
| --------------------- | ---- | ------------------------------ |
| React                 | 19   | UI 框架                        |
| Vite                  | 8    | 构建工具和开发服务器           |
| Tailwind CSS          | 4    | 样式                           |
| Jotai                 | 2    | 状态管理 + localStorage 持久化 |
| Framer Motion         | 12   | 动画底部栏和过渡               |
| React Router DOM      | 7    | 客户端路由                     |
| Headless UI           | 2    | 无障碍模态框 / 对话框          |
| Heroicons             | 2    | 图标集                         |
| react-canvas-confetti | 2    | 中奖彩带动画                   |
| Vercel Analytics      | 2    | 使用情况分析                   |

## 快速开始

### 本地运行

```shell
# 1. 克隆仓库
git clone https://github.com/qinbeifeng/Pickcy.git
cd picksy

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

应用将在 `http://localhost:5173` 上可用。

### 构建生产版本

```shell
npm run build
```

### 预览生产构建

```shell
npm run preview
```
