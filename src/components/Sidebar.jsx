import { ChevronDown, CircleHelp, LayoutDashboard, Layers3, MoreHorizontal, Sparkles } from 'lucide-react'
import { Badge, Button, Separator } from './ui.jsx'

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'contents', icon: Layers3, label: 'Konten' },
]

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="app-sidebar">
      <a className="app-sidebar-brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
        <span className="app-sidebar-brand-mark">c</span>
        <span>creatoria<span>.</span></span>
      </a>

      <Button className="app-workspace-switcher" variant="outline" onClick={() => onNavigate('dashboard')}>
        <span className="app-workspace-icon"><Sparkles size={16} /></span>
        <span className="app-workspace-copy"><strong>Studio Alya</strong><small>Workspace</small></span>
        <ChevronDown size={15} />
      </Button>

      <div className="app-sidebar-section-label">MENU UTAMA</div>
      <nav className="app-sidebar-nav" aria-label="Menu utama">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <Button
            className={`app-sidebar-link ${activePage === id ? 'active' : ''}`}
            key={id}
            variant="ghost"
            aria-current={activePage === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {id === 'contents' && <Badge variant="secondary" className="app-sidebar-count">8</Badge>}
          </Button>
        ))}
      </nav>

      <div className="app-sidebar-spacer" />
      <section className="app-sidebar-upgrade">
        <div className="app-sidebar-upgrade-icon"><Sparkles size={17} /></div>
        <strong>Kerja makin teratur</strong>
        <p>Atur semua ide dan jadwal kontenmu di satu tempat.</p>
        <Button variant="outline" size="sm" onClick={() => onNavigate('contents')}>Lihat konten <span>→</span></Button>
      </section>
      <Button className="app-sidebar-help" variant="ghost" onClick={() => onNavigate('dashboard')}>
        <CircleHelp size={17} /> Pusat bantuan
      </Button>
      <Separator className="app-sidebar-separator" />
      <Button className="app-sidebar-profile" variant="ghost" onClick={() => onNavigate('login')}>
        <span className="app-avatar">A</span>
        <span className="app-profile-copy"><strong>Alya Putri</strong><small>Creator</small></span>
        <MoreHorizontal size={18} />
      </Button>
    </aside>
  )
}

export default Sidebar
