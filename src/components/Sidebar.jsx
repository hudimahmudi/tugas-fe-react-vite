import { CircleHelp, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from './ui.jsx'

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'contents', icon: ClipboardList, label: 'Konten' },
]

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-brand">
        <span className="app-sidebar-brand-mark">c</span>
        <span className="app-sidebar-brand-name">Creatore</span>
      </div>
      <nav className="app-sidebar-nav" aria-label="Menu utama">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <Button
            className={`app-sidebar-link ${activePage === id ? 'active' : ''}`}
            key={id}
            variant="ghost"
            aria-label={label}
            aria-current={activePage === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon size={19} />
            <span>{label}</span>
          </Button>
        ))}
      </nav>
      <div className="app-sidebar-spacer" />
      <Button className="app-sidebar-help" variant="ghost" aria-label="Pusat bantuan" onClick={() => onNavigate('dashboard')}>
        <CircleHelp size={18} />
        <span>Pusat bantuan</span>
      </Button>
      <Button className="app-sidebar-logout" variant="ghost" aria-label="Logout" title="Logout" onClick={() => onNavigate('login')}>
        <LogOut size={19} />
      </Button>
    </aside>
  )
}

export default Sidebar
