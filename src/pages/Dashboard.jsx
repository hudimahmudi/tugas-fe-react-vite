const statusColors = {
  Ide: 'status-idea',
  'Menulis skrip': 'status-writing',
  Produksi: 'status-production',
  'Sedang diedit': 'status-editing',
  'Siap terbit': 'status-ready',
  Terbit: 'status-published',
}

function Dashboard({ contents, onViewAll, onAddContent }) {
  const publishedCount = contents.filter((content) => content.status === 'Terbit').length
  const inProgressCount = contents.filter((content) => content.status !== 'Ide' && content.status !== 'Terbit').length

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="banner-tag">MINGGU INI</span>
          <h2>Setiap konten hebat dimulai dari satu ide.</h2>
          <p>Kamu sudah selangkah lebih dekat dengan targetmu. Yuk, lanjutkan!</p>
          <button className="button-light" onClick={onAddContent}>+ Tambah ide baru</button>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="art-sun">✦</div>
          <div className="art-card art-card-back">✎</div>
          <div className="art-card art-card-front"><span>IDE HARI INI</span><b>Konten yang<br />bermanfaat ✨</b><i>• • •</i></div>
          <div className="art-plant">⌁</div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Ringkasan konten">
        <article className="stat-card">
          <div className="stat-icon stat-purple">▤</div>
          <div className="stat-text"><span>Total konten</span><strong>{contents.length.toString().padStart(2, '0')}</strong></div>
          <span className="stat-trend">↗ +2 minggu ini</span>
        </article>
        <article className="stat-card">
          <div className="stat-icon stat-yellow">✎</div>
          <div className="stat-text"><span>Sedang dikerjakan</span><strong>{inProgressCount.toString().padStart(2, '0')}</strong></div>
          <span className="stat-note">dari semua konten</span>
        </article>
        <article className="stat-card">
          <div className="stat-icon stat-green">↗</div>
          <div className="stat-text"><span>Sudah terbit</span><strong>{publishedCount.toString().padStart(2, '0')}</strong></div>
          <span className="stat-trend">Bagus, teruskan!</span>
        </article>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div><h2>Konten terbaru</h2><p>Ide dan pekerjaan yang sedang kamu siapkan.</p></div>
          <button className="button-outline" onClick={onViewAll}>Lihat semua <span>→</span></button>
        </div>
        {contents.length === 0 ? (
          <div className="empty-state"><span>✦</span><strong>Belum ada konten</strong><p>Mulai dengan menambahkan ide pertamamu.</p><button className="text-button" onClick={onAddContent}>Tambah ide baru</button></div>
        ) : (
          <div className="table-scroll">
            <table className="content-table">
              <thead><tr><th>JUDUL KONTEN</th><th>PLATFORM</th><th>STATUS</th><th>JADWAL</th><th /></tr></thead>
              <tbody>
                {contents.slice(0, 4).map((content) => (
                  <tr key={content.id}>
                    <td><div className="table-title"><span className={`platform-icon platform-${content.channel.toLowerCase()}`}>{content.channel === 'YouTube' ? '▶' : content.channel === 'TikTok' ? '♪' : content.channel === 'Instagram' ? '◎' : 'in'}</span><span><strong>{content.title}</strong><small>{content.format} · {content.priority}</small></span></div></td>
                    <td>{content.channel}</td>
                    <td><span className={`status-badge ${statusColors[content.status] || 'status-idea'}`}><i />{content.status}</span></td>
                    <td>{content.date}</td>
                    <td><button className="row-menu" aria-label={`Opsi ${content.title}`}>•••</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bottom-grid">
        <article className="content-panel goal-panel">
          <div className="section-heading"><div><h2>Target mingguan</h2><p>Langkah kecil untuk hasil yang besar.</p></div><span className="goal-emoji">🎯</span></div>
          <div className="goal-progress-row"><strong>3 dari 5 konten</strong><span>60%</span></div>
          <div className="progress-track"><span style={{ width: '60%' }} /></div>
          <p className="goal-helper">Dua konten lagi untuk mencapai targetmu minggu ini.</p>
        </article>
        <article className="content-panel tip-panel">
          <span className="tip-icon">💡</span><div><span className="tip-label">TIPS HARI INI</span><h2>Mulai dari ide sederhana</h2><p>Catat ide kecil yang muncul. Kamu bisa mengembangkannya nanti.</p></div>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
