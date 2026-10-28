import { ArrowRight, Bell, BriefcaseBusiness, Camera, ChartNoAxesCombined, CheckCircle2, Clock3, ClipboardList, LayoutDashboard, LogOut, ChevronDown, FileVideo, Music2 } from 'lucide-react'
import { getContentStatus } from '../contentWorkflow.js'

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'contents', icon: ClipboardList, label: 'Konten' },
  { id: 'matrix', icon: ChartNoAxesCombined, label: 'Matrix' },
]

const contentPlatforms = [
  { name: 'YouTube', icon: FileVideo, className: 'youtube' },
  { name: 'Instagram', icon: Camera, className: 'instagram' },
  { name: 'TikTok', icon: Music2, className: 'tiktok' },
  { name: 'LinkedIn', icon: BriefcaseBusiness, className: 'linkedin' },
]

function Navbar({ activePage, onNavigate, contents, account }) {
  function navigateFromDropdown(event) {
    onNavigate('contents')
    event.currentTarget.closest('details').open = false
  }

  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        <a className="app-navbar-brand" href="#dashboard" onClick={(event) => {
          event.preventDefault()
          onNavigate('dashboard')
        }}>
          <span className="app-navbar-brand-mark">c</span>
          <span className="app-navbar-brand-copy">
            <strong>Creatore</strong>
            <small>CONTENT STUDIO</small>
          </span>
        </a>

        <nav className="app-navbar-nav" aria-label="Menu utama">
          {menuItems.map(({ id, icon: Icon, label }) => (
            <button
              className={`app-navbar-link ${activePage === id ? 'active' : ''}`}
              key={id}
              type="button"
              aria-current={activePage === id ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="app-navbar-actions">
          <details className="notification-dropdown">
            <summary className="app-notification-button" aria-label={`Notifikasi, ${contents.length} pembaruan konten`}>
              <Bell size={17} />
              {contents.length > 0 && <span />}
            </summary>
            <section className="notification-panel" aria-label="Daftar notifikasi">
              <header className="notification-panel-heading">
                <div><strong>Notifikasi</strong><span>{contents.length} pembaruan konten</span></div>
                <button type="button" onClick={navigateFromDropdown}>Lihat semua</button>
              </header>
              {contents.length ? (
                <ul className="notification-list">
                  {contents.slice(0, 5).map((content) => {
                    const isReady = ['ready', 'published'].includes(content.status)
                    const NotificationIcon = isReady ? CheckCircle2 : Clock3
                    const notificationTitle = content.status === 'published'
                      ? 'Konten sudah tayang'
                      : content.status === 'ready'
                        ? 'Konten siap diunggah'
                        : 'Perbarui progres konten'
                    return (
                      <li key={content.id}>
                        <button type="button" className="notification-item" onClick={navigateFromDropdown}>
                          <span className={`notification-icon ${isReady ? 'ready' : ''}`}><NotificationIcon size={15} /></span>
                          <span className="notification-copy">
                            <strong>{notificationTitle}</strong>
                            <span>{content.title}</span>
                            <small>{content.channel} <i /> {getContentStatus(content.status).label} <i /> {content.date}</small>
                          </span>
                          <ArrowRight className="notification-arrow" size={14} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="notification-empty"><Bell size={18} /><strong>Belum ada notifikasi</strong><span>Pembaruan konten akan muncul di sini.</span></div>
              )}
            </section>
          </details>

          <details className="profile-dropdown">
            <summary className="app-navbar-profile">
              <span className="app-avatar">{account.initials}</span>
              <span className="app-navbar-profile-identity">
                <span className="app-navbar-profile-name">{account.name}</span>
                <span className={`app-navbar-profile-role role-${account.id}`}>{account.role}</span>
              </span>
              <ChevronDown size={15} />
            </summary>
            <section className="profile-card" aria-label={`Profil ${account.name}`}>
              <div className="profile-card-heading">
                <span className="profile-card-avatar">{account.initials}</span>
                <span><strong>{account.name}</strong><small>{account.role}</small></span>
              </div>
              <div className={`profile-role-validation role-${account.id}`}>
                <strong>Hak akses {account.role}</strong>
                <span>{account.access}</span>
              </div>
              <div className="profile-account-email">{account.email}</div>
              <div className="profile-accounts-heading">
                <strong>Akun konten</strong>
                <span>{contentPlatforms.length} platform</span>
              </div>
              <ul className="profile-account-list">
                {contentPlatforms.map(({ name, icon: Icon, className }) => {
                  const contentCount = contents.filter((content) => content.channel === name).length
                  return (
                    <li key={name}>
                      <span className={`profile-platform-icon ${className}`}><Icon size={15} /></span>
                      <span className="profile-account-name"><strong>{name}</strong><small>{contentCount} konten</small></span>
                      <span className="profile-account-indicator" aria-label="Platform konten" />
                    </li>
                  )
                })}
              </ul>
              <button className="app-navbar-logout" type="button" onClick={() => onNavigate('login')}>
                <LogOut size={15} /> Keluar
              </button>
            </section>
          </details>
        </div>
      </div>
    </header>
  )
}

export default Navbar
