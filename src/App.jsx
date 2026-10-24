import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ContentPage from './pages/ContentPage.jsx'

const initialContents = [
  { id: 1, title: '5 tips membuat konten lebih konsisten', channel: 'YouTube', format: 'Video pendek', status: 'Ide', priority: 'Tinggi', date: '25 Okt 2026' },
  { id: 2, title: 'Behind the scenes: proses editing', channel: 'Instagram', format: 'Carousel', status: 'Menulis skrip', priority: 'Sedang', date: '27 Okt 2026' },
  { id: 3, title: 'Cara menemukan ide konten setiap hari', channel: 'TikTok', format: 'Video pendek', status: 'Produksi', priority: 'Tinggi', date: '29 Okt 2026' },
  { id: 4, title: 'Cerita membangun personal brand', channel: 'LinkedIn', format: 'Postingan', status: 'Siap terbit', priority: 'Rendah', date: '30 Okt 2026' },
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
      { ...newContent, id: Date.now(), status: 'Ide' },
      ...currentContents,
    ])
    showNotice('Konten baru berhasil ditambahkan.')
  }

  function updateStatus(contentId, newStatus) {
    setContents((currentContents) =>
      currentContents.map((content) =>
        content.id === contentId ? { ...content, status: newStatus } : content,
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
        <header className="topbar">
          <div>
            <p className="eyebrow">SABTU, 24 OKTOBER 2026</p>
            <h1>{page === 'dashboard' ? 'Selamat pagi, Alya! 👋' : 'Ruang Konten'}</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button notification-button" aria-label="Notifikasi">
              ♧<span />
            </button>
            <button className="profile-button" onClick={() => setPage('login')}>
              <span className="avatar">A</span>
              <span className="profile-name">Alya Putri</span>
              <span className="chevron">⌄</span>
            </button>
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
            onUpdateStatus={updateStatus}
          />
        )}
      </main>
      {notice && <div className="toast-message" role="status">{notice}</div>}
    </div>
  )
}

export default App
