const menuItems = [
  { id: 'dashboard', icon: '▦', label: 'Dashboard' },
  { id: 'contents', icon: '▤', label: 'Konten' },
]

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
        <span className="brand-mark">c</span>
        <span>creatoria<span className="brand-dot">.</span></span>
      </a>

      <div className="workspace-switcher">
        <span className="workspace-icon">✦</span>
        <span className="workspace-copy"><strong>Studio Alya</strong><small>Workspace</small></span>
        <span className="chevron">⌄</span>
      </div>

      <p className="menu-label">MENU UTAMA</p>
      <nav className="side-navigation" aria-label="Menu utama">
        {menuItems.map((item) => (
          <button
            className={`nav-link ${activePage === item.id ? 'active' : ''}`}
            key={item.id}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.id === 'contents' && <span className="nav-count">8</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-spacer" />
      <div className="upgrade-card">
        <span className="upgrade-sparkle">✦</span>
        <strong>Kerja makin teratur</strong>
        <p>Atur semua ide dan jadwal kontenmu di satu tempat.</p>
        <button onClick={() => onNavigate('contents')}>Lihat konten <span>→</span></button>
      </div>
      <button className="help-link" onClick={() => onNavigate('dashboard')}>
        <span className="nav-icon">?</span> Pusat bantuan
      </button>
      <button className="sidebar-profile" onClick={() => onNavigate('login')}>
        <span className="avatar">A</span>
        <span className="profile-copy"><strong>Alya Putri</strong><small>Creator</small></span>
        <span className="more-icon">•••</span>
      </button>
    </aside>
  )
}

export default Sidebar
