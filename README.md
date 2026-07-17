# ima-prototype

ima.copilot 桌面助手的前端 UI 原型，目标是像素级还原 ima 侧边栏的视觉风格和交互模式。

## 项目背景

ima.copilot 是腾讯推出的 AI 桌面助手，基于定制 Chromium Fork + 22 个 Chrome Extension 架构。我们正在用 Electron 33+ + Chrome Extension (MV3) 复刻其核心功能。

本原型聚焦于**侧边栏 Shell 的 UI 还原**，不涉及 Electron 主进程、IPC Bridge 等后端逻辑。

## 架构决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 壳架构 | Electron 33+ | 原生支持 Chrome Extension，与 ima 最接近 |
| 前端框架 | React 18+ | 生态成熟，ima 全扩展使用 React |
| UI 组件库 | tdesign-react v1.10+ (MIT) | ima 全扩展统一使用 TDesign |
| DI 容器 | inversify + inversify-react | 对标 ima DI 架构 |
| 构建工具 | Vite + @vitejs/plugin-react-swc | SWC 原生支持装饰器 |
| 图标库 | tdesign-icons-react | 与 TDesign 组件一致 |
| 知识库引擎 | LanceDB (Rust native via N-API) | 消除自研 RRF/向量索引/中文分词三大模块 |
| 首屏体验 | 启动即 AI 对话 | ima 无 Home Page，启动直接打开 copilot 侧边栏 |

## 三栏布局

经截图逆向验证，ima 侧边栏为三栏布局：

```
┌──────┬─────────────────┬──────────────────────────┐
│ 48px │    ~280px       │         剩余宽度          │
│      │                 │                          │
│ Icon │  导航面板        │      主内容区             │
│ Rail │ (ima_viewer)    │   (Browser WebView)      │
│      │                 │                          │
│ 头像 │ [随 icon 切换]  │   [与导航面板联动]       │
│ ima  │                 │                          │
│ 知识库│                │                          │
│ 笔记 │                 │                          │
│ 发现 │                 │                          │
│ 浏览 │                 │                          │
└──────┴─────────────────┴──────────────────────────┘
```

- **Icon Rail**：6 个 icon 纵向排列（头像 + ima + 知识库 + 笔记 + 发现 + 浏览）
- **导航面板**：内容随 icon rail 选择切换
- **主内容区**：内容与导航面板联动

## 仓库目录结构

```
ima-prototype/
├── src/
│   ├── main.tsx        ← 入口：ConfigProvider + tokens + Shell
│   ├── Shell.tsx       ← 三栏布局主组件 + IconRail + NavPanel + MainContent
│   ├── Shell.css       ← 布局样式（当前有硬编码 fallback，需替换为 token）
│   └── vite-env.d.ts
├── design-tokens/      ← 从 ima 提取的 524 个 CSS 变量
│   ├── index.css       ← 入口 @import
│   ├── colors.css      ← 387 色 + 170 亮色（dark 默认，light=[data-theme='light']）
│   ├── typography.css  ← 36 排版 + 16 亮色
│   ├── spacing.css     ← 32 间距（暗亮共用）
│   ├── elevation.css   ← 26 阴影/z-index/蒙版 + 6 亮色
│   ├── layout.css      ← 20 布局 + 8 亮色
│   ├── editor.css      ← 23 A1-A9 编辑器 + 1 亮色
│   └── README.md       ← 提取方法 + 变量详解
├── screenshots/        ← ima 原版截图（视觉还原的唯一依据）
│   ├── avatar-menu.png      ← 头像菜单展开
│   ├── note-panel.png       ← 笔记导航面板
│   ├── discover-panel.png   ← 发现面板（imaHub）
│   ├── browse-panel.png     ← 浏览面板（IMA搜索）
│   ├── ds-dropdown.png      ← DS 下拉菜单
│   ├── s2.png               ← ima 主面板（AI 对话）
│   ├── s3.png               ← 知识库面板
│   └── prototype-v3.png     ← 当前原型截图
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 技术栈

```
React 18.3+               UI 框架
tdesign-react 1.10+       UI 组件库（MIT）
tdesign-icons-react        图标库
Vite 6+                   构建工具
@vitejs/plugin-react-swc   SWC 编译
```

## 开发规则

### 1. 设计 Token 强制使用

`design-tokens/` 包含从 ima 真实 CSS 提取的 524 个变量。**所有颜色、间距、圆角、阴影必须使用 `var(--xxx)` 引用，禁止硬编码色值。**

暗色为默认（`:root`），亮色通过 `html[data-theme='light']` 选择器自动覆盖。

**示例**：
```css
/* ❌ 错误 — 硬编码 */
background: rgba(36, 36, 36, 1);
border: 1px solid rgba(255,255,255,0.06);

/* ✅ 正确 — token 引用 */
background: var(--td-bg-color-container);
border: 1px solid var(--td-border-level-1-color);
```

**当前 Shell.css 中有大量 rgba() fallback 值，必须全部替换为 token。**

关键 token 变量速查：
- 品牌绿：`--brand_color_green_primary: rgba(7, 157, 85, 1)`
- 容器背景：`--td-bg-color-container`
- 页面背景：`--td-bg-color-page`
- 主文字：`--td-text-color-primary`
- 次文字：`--td-text-color-secondary`
- 占位文字：`--td-text-color-placeholder`
- 边框 L1：`--td-border-level-1-color`
- 边框 L2：`--td-border-level-2-color`
- 圆角：`--td-radius-small / default / medium / large`
- 阴影：`--td-shadow-1 / 2 / 3`

### 2. TDesign 组件优先

- 使用 TDesign 组件（`<Input>`, `<Tree>`, `<Avatar>`, `<Button>` 等），不手写基础组件
- 图标使用 `tdesign-icons-react`，不引入其他图标库
- 主题通过 `ConfigProvider` 的 `globalConfig` 传递

### 3. 三栏布局 CSS Grid（不可更改）

```css
.ima-shell {
  display: grid;
  grid-template-columns: 48px 280px 1fr;
  height: 100vh;
}
```

不接受 flex 布局替代。

### 4. Icon Rail 规范

- 头像在最顶部，圆形，悬停绿色边框，点击展开浮层菜单
- 5 个功能 icon 纵向排列：ima → 知识库 → 笔记 → 发现 → 浏览
- 选中状态：绿色圆角矩形背景（`var(--brand_color_green_primary)`）
- 底部保留空间给设置/帮助图标

### 5. 导航面板规范

- 标题栏固定顶部，包含面板名称 + 可选操作按钮
- 内容区可滚动（`overflow-y: auto`）
- **导航面板无底部输入框**——输入框只在主内容区底部

### 6. 主内容区规范

- `flex-direction: column` 布局
- 顶部 `main-content__body` 弹性占满
- 底部 `input-area` 固定，仅 ima 面板显示
- 输入区组成：🌐DS快速▾（下拉选择器）+ 文本输入框 + 发送按钮

### 7. 面板内容对照

| Icon | 面板 | 导航面板内容 | 主内容区 |
|------|------|------------|---------|
| ima | 问问ima | 4 个操作卡片 + 会话历史列表 | AI 对话区 + 底部输入框 |
| 知识库 | IMA知识库 | 搜索框 + 树形知识库列表 | 知识库详情 |
| 笔记 | 记笔记 | 笔记列表 | 笔记编辑器 |
| 发现 | imaHub | 扩展/内容推荐 | imaHub 详情 |
| 浏览 | IMA搜索 | 搜索入口 + 历史 | 搜索结果 |

## 面板交互

- **Icon Rail 点击切换**：点击 icon → 导航面板切换 → 主内容区联动，选中 icon 保持高亮
- **头像菜单**：点击头像 → 弹出浮层菜单（参考 `screenshots/avatar-menu.png`）
- **DS 下拉**：点击 🌐DS快速▾ → 展开下拉选项（参考 `screenshots/ds-dropdown.png`）
- **切换时无动画**（ima 原版也无过渡动画）

## 开发流程

```bash
npm install
npm run dev      # 启动 Vite 开发服务器
npm run build    # 生产构建
npx tsc --noEmit # 类型检查
```

Vite 别名：`@ima-tokens` → `design-tokens/`（已在 `vite.config.ts` 配置）

## 验收标准

1. 原型截图与 `screenshots/` 中的 ima 截图并排对比，视觉差异 ≤10%
2. **零硬编码色值**——所有颜色/间距/圆角使用 design token 变量
3. 亮暗主题切换正常（`data-theme="light"` 切换）
4. TypeScript 编译零错误（`npx tsc --noEmit` 通过）
5. 5 个 icon 切换均正常，导航面板和主内容区正确联动
6. 输入区仅在 ima 面板主内容区底部显示
