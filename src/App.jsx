import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ContentPage from './pages/ContentPage.jsx'
import { ArrowRight, BriefcaseBusiness, Bell, Camera, CheckCircle2, ChevronDown, Clock3, FileVideo, Music2 } from 'lucide-react'
import { formatScheduledDate, getContentStatus } from './contentWorkflow.js'

const initialContents = [
  { id: 1, title: '5 tips membuat konten lebih konsisten', concept: 'Bagikan cara sederhana agar konsisten membuat konten.', channel: 'YouTube', format: 'Video pendek', status: 'idea', priority: 'Tinggi', scheduledDate: '2026-10-25', date: '25 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: false, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
  { id: 2, title: 'Behind the scenes: proses editing', concept: 'Tunjukkan proses editing dari awal sampai akhir.', channel: 'Instagram', format: 'Carousel', status: 'scripting', priority: 'Sedang', scheduledDate: '2026-10-27', date: '27 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: false, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
  { id: 3, title: 'Cara menemukan ide konten setiap hari', concept: 'Tips mencari dan mengumpulkan ide konten.', channel: 'TikTok', format: 'Video pendek', status: 'recording', priority: 'Tinggi', scheduledDate: '2026-10-29', date: '29 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: false, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
  { id: 4, title: 'Cerita membangun personal brand', concept: 'Cerita pengalaman membangun personal brand.', channel: 'LinkedIn', format: 'Postingan', status: 'ready', priority: 'Rendah', scheduledDate: '2026-10-30', date: '30 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: true, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
]

const contentPlatforms = [
  { name: 'YouTube', icon: FileVideo, className: 'youtube' },
  { name: 'Instagram', icon: Camera, className: 'instagram' },
  { name: 'TikTok', icon: Music2, className: 'tiktok' },
  { name: 'LinkedIn', icon: BriefcaseBusiness, className: 'linkedin' },
]

function App() {
  const [page, setPage] = useState('dashboard')
  const [contents, setContents] = useState(initialContents)
  const [notice, setNotice] = useState('')

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function addContent(newContent) {
    setContents((currentContents) => [
      { ...newContent, date: formatScheduledDate(newContent.scheduledDate), id: Date.now(), status: 'idea' },
      ...currentContents,
    ])
    showNotice('Konten baru berhasil ditambahkan.')
  }

  function updateContent(updatedContent) {
    setContents((currentContents) =>
      currentContents.map((content) =>
        content.id === updatedContent.id
          ? { ...updatedContent, date: formatScheduledDate(updatedContent.scheduledDate) }
          : content,
      ),
    )
  }

  if (page === 'login') {
    return <Login onLogin={() => setPage('dashboard')} onRegister={() => setPage('register')} />
  }

  if (page === 'register') {
    return <Register onRegister={() => setPage('dashboard')} onLogin={() => setPage('login')} />
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={setPage} />
      <main className="main-area">
        <header className="app-topbar">
          <div className="app-topbar-heading">
            <div className="project-title-row">
              <h1>Monitoring Project</h1>
            </div>
          </div>
          <div className="app-topbar-actions">
            <details className="notification-dropdown">
              <summary className="app-notification-button" aria-label={`Notifikasi, ${contents.length} pemberitahuan`}>
                <Bell size={17} />
                {contents.length > 0 && <span />}
              </summary>
              <section className="notification-panel" aria-label="Daftar notifikasi">
                <header className="notification-panel-heading">
                  <div><strong>Notifikasi</strong><span>{contents.length} pembaruan konten</span></div>
                  <button type="button" onClick={(event) => {
                    setPage('contents')
                    event.currentTarget.closest('details').open = false
                  }}>Lihat semua</button>
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
                          <button type="button" className="notification-item" onClick={(event) => {
                            setPage('contents')
                            event.currentTarget.closest('details').open = false
                          }}>
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
              <summary className="app-topbar-profile">
                <span className="app-avatar">S</span>
                <span className="app-topbar-profile-identity">
                  <span className="app-topbar-profile-name">Salwa Afiifah</span>
                  <span className="app-topbar-profile-role">Creator</span>
                </span>
                <ChevronDown size={15} />
              </summary>
              <section className="profile-card" aria-label="Profil Salwa Afiifah">
                <div className="profile-card-heading">
                  <span className="profile-card-avatar">S</span>
                  <span><strong>Salwa Afiifah</strong><small>Creator</small></span>
                </div>
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
              </section>
            </details>
          </div>
        </header>

        {page === 'dashboard' ? (
          <Dashboard
            contents={contents}
            onViewAll={() => setPage('contents')}
            onAddContent={() => setPage('contents')}
          />
        ) : (
          <ContentPage
            contents={contents}
            onAddContent={addContent}
            onUpdateContent={updateContent}
          />
        )}
      </main>
      {notice && <div className="toast-message" role="status">{notice}</div>}
    </div>
  )
}

export default App
