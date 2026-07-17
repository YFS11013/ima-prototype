import { useState } from 'react'
import {
  ChatIcon,
  FolderIcon,
  Edit1Icon,
  ViewModuleIcon,
  BrowseIcon,
  UserCircleIcon,
  SearchIcon,
  AddIcon,
  SendIcon,
} from 'tdesign-icons-react'
import { Input, Tree, Avatar } from 'tdesign-react'
import './Shell.css'

type NavPanelId = 'ima' | 'knowledge' | 'note' | 'discover' | 'browse'

const NAV_ITEMS: { id: NavPanelId; Icon: typeof ChatIcon }[] = [
  { id: 'ima', Icon: ChatIcon },
  { id: 'knowledge', Icon: FolderIcon },
  { id: 'note', Icon: Edit1Icon },
  { id: 'discover', Icon: ViewModuleIcon },
  { id: 'browse', Icon: BrowseIcon },
]

const MOCK_SESSIONS = [
  { id: '1', title: '如何使用 React Hooks 管理复杂状态', time: '3分钟前' },
  { id: '2', title: 'LanceDB 向量检索性能优化方案', time: '1小时前' },
  { id: '3', title: 'Electron SidePanel 与主窗口同步实现', time: '昨天' },
  { id: '4', title: 'tiptap 编辑器 A1-A9 双主题适配', time: '昨天' },
  { id: '5', title: 'Vite + inversify 装饰器兼容性解决', time: '2天前' },
]

const KB_TREE_DATA = [
  {
    value: 'personal',
    label: '个人知识库',
    children: [
      { value: 'fe-notes', label: '前端技术笔记' },
      { value: 'ai-nlp', label: 'AI/NLP 研究' },
      { value: 'project-docs', label: '项目文档' },
    ],
  },
  {
    value: 'shared',
    label: '共享知识库',
    children: [
      { value: 'team-tech', label: '团队技术分享' },
      { value: 'design-spec', label: '产品设计规范' },
    ],
  },
  {
    value: 'subscribed',
    label: '订阅知识库',
    children: [
      { value: 'mdn', label: 'MDN Web Docs' },
      { value: 'rust-ex', label: 'Rust by Example' },
    ],
  },
]

function ImaHomePanel() {
  return (
    <div className="nav-panel__body">
      <div className="ima-home__cards">
        <div className="ima-home__card">
          <div className="ima-home__card-icon">💬</div>
          <div className="ima-home__card-title">问问 ima</div>
          <div className="ima-home__card-subtitle">AI 智能对话</div>
        </div>
        <div className="ima-home__card">
          <div className="ima-home__card-icon">⚡</div>
          <div className="ima-home__card-title">快速问答</div>
          <div className="ima-home__card-subtitle">一句话获取答案</div>
        </div>
        <div className="ima-home__card">
          <div className="ima-home__card-icon">🤖</div>
          <div className="ima-home__card-title">我的 copilot</div>
          <div className="ima-home__card-subtitle">浏览器助手</div>
        </div>
        <div className="ima-home__card">
          <div className="ima-home__card-icon">🟢</div>
          <div className="ima-home__card-title">创建任务</div>
          <div className="ima-home__card-subtitle">自动化工作流</div>
        </div>
      </div>
      <div className="ima-home__section-title">会话历史</div>
      {MOCK_SESSIONS.map((s) => (
        <div key={s.id} className="ima-home__session">
          <ChatIcon size={16} style={{ flexShrink: 0, opacity: 0.5 }} />
          <span className="ima-home__session-title">{s.title}</span>
          <span className="ima-home__session-time">{s.time}</span>
        </div>
      ))}
    </div>
  )
}

function KnowledgePanel() {
  return (
    <div className="nav-panel__body">
      <div className="kb-panel__search">
        <Input prefixIcon={<SearchIcon />} placeholder="搜索知识库..." />
      </div>
      <div className="kb-panel__tree-section">
        <Tree data={KB_TREE_DATA} expandAll />
      </div>
    </div>
  )
}

function PlaceholderPanel({ icon: Icon, label }: { icon: typeof ChatIcon; label: string }) {
  return (
    <div className="placeholder-panel">
      <Icon size="48px" style={{ opacity: 0.3 }} />
      <div className="placeholder-panel__text">{label}面板 — 待实现</div>
    </div>
  )
}

function NavPanel({ activeId }: { activeId: NavPanelId }) {
  const titles: Record<NavPanelId, string> = {
    ima: 'ima',
    knowledge: '知识库',
    note: '笔记',
    discover: '发现',
    browse: '浏览',
  }

  return (
    <div className="nav-panel">
      <div className="nav-panel__header">
        <h2>{titles[activeId]}</h2>
        {activeId === 'knowledge' && <AddIcon style={{ cursor: 'pointer', opacity: 0.6 }} />}
      </div>
      {activeId === 'ima' && <ImaHomePanel />}
      {activeId === 'knowledge' && <KnowledgePanel />}
      {activeId === 'note' && <PlaceholderPanel icon={Edit1Icon} label="笔记" />}
      {activeId === 'discover' && <PlaceholderPanel icon={ViewModuleIcon} label="发现" />}
      {activeId === 'browse' && <PlaceholderPanel icon={BrowseIcon} label="浏览" />}
    </div>
  )
}

export default function Shell() {
  const [activeNav, setActiveNav] = useState<NavPanelId>('ima')
  const [dark, setDark] = useState(true)

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    next
      ? document.documentElement.removeAttribute('data-theme')
      : document.documentElement.setAttribute('data-theme', 'light')
  }

  const mainPlaceholders: Record<NavPanelId, string> = {
    ima: 'AI 对话 / 搜索结果',
    knowledge: '知识库详情',
    note: '笔记编辑器',
    discover: 'imaHub 内容',
    browse: '搜索结果',
  }

  return (
    <>
      <div className="dev-overlay">
        🌙<span onClick={toggleTheme} style={{ cursor: 'pointer' }}>☀️</span>
      </div>
      <div className="ima-shell">
        {/* Icon Rail */}
        <div className="icon-rail">
          <div className="icon-rail__top">
            <Avatar
              className="icon-rail__avatar"
              icon={<UserCircleIcon />}
              size="medium"
              style={{ width: 32, height: 32 }}
            />
            {NAV_ITEMS.map(({ id, Icon }) => (
              <button
                key={id}
                className={`icon-rail__btn ${activeNav === id ? 'icon-rail__btn--active' : ''}`}
                onClick={() => setActiveNav(id)}
                title={id}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
          <div className="icon-rail__spacer" />
          <div className="icon-rail__bottom">
            {/* reserved for settings/help icons */}
          </div>
        </div>

        {/* Nav Panel */}
        <NavPanel activeId={activeNav} />

        {/* Main Content */}
        <div className="main-content">
          <div className="main-content__body">
            {mainPlaceholders[activeNav]}
          </div>
          {activeNav === 'ima' && (
            <div className="input-area">
              <span className="input-area__ds" title="Deep Search">🌐DS快速▾</span>
              <Input className="input-area__field" placeholder="给 ima 发消息..." />
              <SendIcon style={{ cursor: 'pointer', opacity: 0.5, flexShrink: 0 }} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
