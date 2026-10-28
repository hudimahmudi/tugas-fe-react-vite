import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ContentPage from './pages/ContentPage.jsx'
import MatrixPage from './pages/MatrixPage.jsx'
import { formatScheduledDate } from './contentWorkflow.js'
import { roleAccounts } from './roles.js'

const initialContents = [
  { id: 1, title: '5 tips membuat konten lebih konsisten', concept: 'Bagikan cara sederhana agar konsisten membuat konten.', channel: 'YouTube', format: 'Video pendek', status: 'idea', priority: 'Tinggi', scheduledDate: '2026-10-25', date: '25 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: false, creatorApproved: false, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
  { id: 2, title: 'Behind the scenes: proses editing', concept: 'Tunjukkan proses editing dari awal sampai akhir.', channel: 'Instagram', format: 'Carousel', status: 'scripting', priority: 'Sedang', scheduledDate: '2026-10-27', date: '27 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: false, creatorApproved: false, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
  { id: 3, title: 'Cara menemukan ide konten setiap hari', concept: 'Tips mencari dan mengumpulkan ide konten.', channel: 'TikTok', format: 'Video pendek', status: 'recording', priority: 'Tinggi', scheduledDate: '2026-10-29', date: '29 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: false, creatorApproved: false, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
  { id: 4, title: 'Cerita membangun personal brand', concept: 'Cerita pengalaman membangun personal brand.', channel: 'LinkedIn', format: 'Postingan', status: 'ready', priority: 'Rendah', scheduledDate: '2026-10-30', date: '30 Okt 2026', script: '', productionChecklist: [], draftUrl: '', reviewNotes: '', readyApproved: true, creatorApproved: false, publishedUrl: '', metrics: { views: '', likes: '', comments: '', shares: '' } },
]

function App() {
  const [page, setPage] = useState('login')
  const [account, setAccount] = useState(roleAccounts[0])
  const [contents, setContents] = useState(initialContents)
  const [notice, setNotice] = useState('')

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function addContent(newContent) {
    setContents((currentContents) => [
      { ...newContent, date: formatScheduledDate(newContent.scheduledDate), id: Date.now(), status: 'idea', creatorApproved: false },
      ...currentContents,
    ])
    showNotice('Konten baru berhasil ditambahkan.')
  }

  function updateContent(updatedContent) {
    const existingContent = contents.find((content) => content.id === updatedContent.id)
    if (existingContent?.status === 'published') {
      showNotice('Konten yang sudah dipublikasikan terkunci permanen dan tidak dapat diubah atau dihapus.')
      return
    }

    setContents((currentContents) =>
      currentContents.map((content) =>
        content.id === updatedContent.id
          ? { ...updatedContent, date: formatScheduledDate(updatedContent.scheduledDate) }
          : content,
      ),
    )
  }

  if (page === 'login') {
    return <Login onLogin={(signedInAccount) => {
      setAccount(signedInAccount)
      setPage('dashboard')
    }} onRegister={() => setPage('register')} />
  }

  if (page === 'register') {
    return <Register onRegister={() => setPage('login')} onLogin={() => setPage('login')} />
  }

  return (
    <div className="app-shell">
      <Navbar activePage={page} onNavigate={setPage} contents={contents} account={account} />
      <main className="main-area">
        {page === 'dashboard' ? (
          <Dashboard
            contents={contents}
            canCreate={account.id !== 'editor'}
            onViewAll={() => setPage('contents')}
            onAddContent={() => setPage('contents')}
          />
        ) : page === 'matrix' ? (
          <MatrixPage contents={contents} />
        ) : (
          <ContentPage
            contents={contents}
            role={account.id}
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
