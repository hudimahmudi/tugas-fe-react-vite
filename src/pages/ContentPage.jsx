import { useState } from 'react'

const statuses = ['Ide', 'Menulis skrip', 'Produksi', 'Sedang diedit', 'Siap terbit', 'Terbit']
const statusStyles = ['status-idea', 'status-writing', 'status-production', 'status-editing', 'status-ready', 'status-published']

function ContentPage({ contents, onAddContent, onUpdateStatus }) {
  const [showForm, setShowForm] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua status')
  const [title, setTitle] = useState('')
  const [channel, setChannel] = useState('YouTube')
  const [format, setFormat] = useState('Video pendek')
  const [priority, setPriority] = useState('Sedang')
  const [date, setDate] = useState('')

  const filteredContents = contents.filter((content) => {
    const matchesText = content.title.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'Semua status' || content.status === statusFilter
    return matchesText && matchesStatus
  })

  function handleSubmit(event) {
    event.preventDefault()
    onAddContent({
      title,
      channel,
      format,
      priority,
      date: date ? new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Belum dijadwalkan',
    })
    setTitle('')
    setDate('')
    setShowForm(false)
  }

  return (
    <div className="page-content content-page">
      <section className="content-page-heading">
        <div><p className="eyebrow">ATUR ALUR KREATIFMU</p><h2>Semua konten</h2><p>Lihat dan kelola semua ide sampai kontenmu terbit.</p></div>
        <button className="button-primary" onClick={() => setShowForm(true)}>＋ Tambah konten</button>
      </section>
      <section className="pipeline-summary">
        <div><span className="summary-marker summary-purple" /><span>Semua konten</span><strong>{contents.length}</strong></div>
        <div><span className="summary-marker summary-yellow" /><span>Dalam proses</span><strong>{contents.filter((item) => !['Ide', 'Terbit'].includes(item.status)).length}</strong></div>
        <div><span className="summary-marker summary-green" /><span>Siap / terbit</span><strong>{contents.filter((item) => ['Siap terbit', 'Terbit'].includes(item.status)).length}</strong></div>
      </section>

      <section className="content-panel all-content-panel">
        <div className="content-toolbar">
          <div><h2>Daftar konten</h2><p>Perbarui status saat pekerjaanmu berjalan.</p></div>
          <div className="filters">
            <label className="search-box"><span>⌕</span><input type="search" placeholder="Cari konten..." value={searchText} onChange={(event) => setSearchText(event.target.value)} /></label>
            <select aria-label="Filter status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>Semua status</option>{statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        </div>
        {filteredContents.length ? (
          <div className="table-scroll">
            <table className="content-table">
              <thead><tr><th>JUDUL KONTEN</th><th>PLATFORM</th><th>PRIORITAS</th><th>JADWAL</th><th>STATUS</th></tr></thead>
              <tbody>{filteredContents.map((content) => (
                <tr key={content.id}>
                  <td><div className="table-title"><span className={`platform-icon platform-${content.channel.toLowerCase()}`}>{content.channel === 'YouTube' ? '▶' : content.channel === 'TikTok' ? '♪' : content.channel === 'Instagram' ? '◎' : 'in'}</span><span><strong>{content.title}</strong><small>{content.format}</small></span></div></td>
                  <td>{content.channel}</td>
                  <td><span className={`priority-label priority-${content.priority.toLowerCase()}`}>{content.priority}</span></td>
                  <td>{content.date}</td>
                  <td><select className={`status-select ${statusStyles[statuses.indexOf(content.status)] || statusStyles[0]}`} aria-label={`Status untuk ${content.title}`} value={content.status} onChange={(event) => onUpdateStatus(content.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <div className="empty-state"><span>⌕</span><strong>Konten tidak ditemukan</strong><p>Coba kata kunci atau pilihan status yang lain.</p></div>}
      </section>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false) }}>
          <section className="content-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
            <div className="modal-heading"><div><span className="modal-kicker">IDE BARU</span><h2 id="form-title">Tambah konten</h2><p>Mulai dengan mengisi informasi dasar kontenmu.</p></div><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Tutup">×</button></div>
            <form className="content-form" onSubmit={handleSubmit}>
              <label htmlFor="content-title">Judul konten</label>
              <input id="content-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Tips membuat konten pertama" required maxLength="255" />
              <div className="form-row">
                <div><label htmlFor="content-channel">Platform</label><select id="content-channel" value={channel} onChange={(event) => setChannel(event.target.value)}><option>YouTube</option><option>TikTok</option><option>Instagram</option><option>LinkedIn</option></select></div>
                <div><label htmlFor="content-format">Jenis konten</label><select id="content-format" value={format} onChange={(event) => setFormat(event.target.value)}><option>Video pendek</option><option>Video panjang</option><option>Carousel</option><option>Postingan</option></select></div>
              </div>
              <div className="form-row">
                <div><label htmlFor="content-priority">Prioritas</label><select id="content-priority" value={priority} onChange={(event) => setPriority(event.target.value)}><option>Rendah</option><option>Sedang</option><option>Tinggi</option></select></div>
                <div><label htmlFor="content-date">Target jadwal <span>(boleh dikosongkan)</span></label><input id="content-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
              </div>
              <div className="modal-actions"><button type="button" className="button-outline" onClick={() => setShowForm(false)}>Batal</button><button className="button-primary" type="submit">Simpan ide</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default ContentPage
