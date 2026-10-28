import { useState } from 'react'
import { CalendarDays, Check, ChevronDown, ExternalLink, Filter, MoreHorizontal, Paperclip, Pencil, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { contentStatuses, formatScheduledDate } from '../contentWorkflow.js'

const columns = [
  { id: 'idea', label: 'Idea', statuses: ['idea'], hint: 'Ide belum dimulai' },
  { id: 'scripting', label: 'Scripting', statuses: ['scripting'], hint: 'Naskah belum dimulai' },
  { id: 'recording', label: 'Recording', statuses: ['recording'], hint: 'Rekaman belum dimulai' },
  { id: 'editing', label: 'Editing', statuses: ['editing'], hint: 'Review belum dimulai' },
  { id: 'ready', label: 'Ready', statuses: ['ready'], hint: 'Siap diunggah' },
  { id: 'published', label: 'Published', statuses: ['published'], hint: 'Konten sudah tayang' },
]
const productionTasks = [
  'Naskah dan konsep sudah siap',
  'Peralatan rekaman sudah disiapkan',
  'Lokasi dan pencahayaan sudah dicek',
]
const emptyMetrics = { views: '', likes: '', comments: '', shares: '' }

function createDraft(content = {}) {
  return {
    id: content.id,
    title: content.title || '',
    concept: content.concept || '',
    channel: content.channel || 'YouTube',
    format: content.format || 'Video pendek',
    priority: content.priority || 'Sedang',
    status: content.status || 'idea',
    scheduledDate: content.scheduledDate || '',
    script: content.script || '',
    productionChecklist: content.productionChecklist || [],
    draftUrl: content.draftUrl || '',
    draftFile: content.draftFile || null,
    reviewNotes: content.reviewNotes || '',
    readyApproved: content.readyApproved || false,
    creatorApproved: content.creatorApproved || false,
    publishedUrl: content.publishedUrl || '',
    metrics: { ...emptyMetrics, ...(content.metrics || {}) },
  }
}

function ContentPage({ contents, onAddContent, onUpdateContent, role = 'creator' }) {
  const [activeDraft, setActiveDraft] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formError, setFormError] = useState('')
  const isNewContent = activeDraft?.id === undefined
  const draftStageIndex = activeDraft ? contentStatuses.findIndex((item) => item.value === activeDraft.status) : 0
  const isAdmin = role === 'admin'
  const isCreator = role === 'creator'
  const isEditor = role === 'editor'
  const canCreate = isAdmin || isCreator
  const creatorCanEditIdea = isCreator && activeDraft?.status === 'idea'
  const creatorCanReview = isCreator && !isNewContent && ['editing', 'ready'].includes(activeDraft?.status)
  const canEditDetails = isAdmin || (isEditor && activeDraft && !['idea', 'scripting'].includes(activeDraft.status)) || creatorCanEditIdea
  const editorCanPublish = isEditor && ['ready', 'published'].includes(activeDraft?.status) && activeDraft.creatorApproved
  const visibleColumns = isEditor ? columns.filter((column) => !['idea', 'scripting'].includes(column.id)) : columns
  const selectableStatuses = contentStatuses.filter((status, index) => {
    if (isEditor && index < 2) return false
    if (index > draftStageIndex + 1) return false
    return !isEditor || status.value !== 'published' || Boolean(activeDraft?.creatorApproved)
  })

  const filteredContents = contents.filter((content) => {
    const matchesText = `${content.title} ${content.concept || ''}`.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter
    const roleCanSee = !isEditor || !['idea', 'scripting'].includes(content.status)
    return matchesText && matchesStatus && roleCanSee
  })

  function openNewForm() {
    if (!canCreate) return
    setFormError('')
    setActiveDraft(createDraft())
  }

  function openEditForm(content) {
    if (content.status === 'published') return
    if (isEditor && ['idea', 'scripting'].includes(content.status)) return
    setFormError('')
    setActiveDraft(createDraft(content))
  }

  function updateDraft(field, value) {
    setFormError('')
    setActiveDraft((current) => ({ ...current, [field]: value }))
  }

  function toggleProductionTask(task) {
    setFormError('')
    setActiveDraft((current) => ({
      ...current,
      productionChecklist: current.productionChecklist.includes(task)
        ? current.productionChecklist.filter((item) => item !== task)
        : [...current.productionChecklist, task],
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (isCreator && !isNewContent && activeDraft.status !== 'idea' && !creatorCanReview) {
      setFormError('Creator hanya dapat mengubah ide atau memberikan review pada konten yang sedang direview.')
      return
    }
    if (isEditor && (isNewContent || ['idea', 'scripting'].includes(activeDraft.status))) {
      setFormError('Editor tidak memiliki akses ke tahap ide dan scripting.')
      return
    }
    const targetIndex = contentStatuses.findIndex((item) => item.value === activeDraft.status)
    const originalContent = contents.find((content) => content.id === activeDraft.id)
    if (originalContent?.status === 'published') {
      setFormError('Konten yang sudah dipublikasikan terkunci permanen dan tidak dapat diubah atau dihapus.')
      return
    }
    const currentIndex = isNewContent
      ? 0
      : contentStatuses.findIndex((item) => item.value === contents.find((content) => content.id === activeDraft.id)?.status)

    if (!creatorCanReview) {
      if (!isNewContent && targetIndex > currentIndex + 1) {
        setFormError('Konten harus melewati tahap secara berurutan.')
        return
      }
      if (isEditor && targetIndex < 2) {
        setFormError('Editor hanya dapat mengakses konten mulai tahap rekaman.')
        return
      }
      if (isCreator && !isNewContent && activeDraft.status !== 'idea' && activeDraft.status !== contents.find((content) => content.id === activeDraft.id)?.status) {
        setFormError('Creator tidak dapat mengubah tahap produksi.')
        return
      }
      if (isEditor && targetIndex === 5 && !activeDraft.creatorApproved) {
        setFormError('Publikasi menunggu persetujuan Creator pada konten siap unggah.')
        return
      }
      if (targetIndex >= 1 && (!activeDraft.script.trim() || !activeDraft.scheduledDate)) {
        setFormError('Isi naskah dan tanggal jadwal sebelum melanjutkan dari tahap ide.')
        return
      }
      if (targetIndex >= 3 && productionTasks.some((task) => !activeDraft.productionChecklist.includes(task))) {
        setFormError('Selesaikan semua checklist produksi sebelum melanjutkan ke editing.')
        return
      }
      if (targetIndex >= 4 && ((!activeDraft.draftUrl.trim() && !activeDraft.draftFile) || !activeDraft.reviewNotes.trim() || !activeDraft.readyApproved)) {
        setFormError('Lampirkan file atau tautan draf, isi catatan review, dan setujui konten sebelum siap diunggah.')
        return
      }
      if (targetIndex >= 5 && !activeDraft.publishedUrl.trim()) {
        setFormError('URL konten yang sudah tayang wajib diisi.')
        return
      }
    }

    if (isNewContent) {
      onAddContent(activeDraft)
    } else {
      onUpdateContent(activeDraft)
    }
    setActiveDraft(null)
    setFormError('')
  }

  return (
    <div className="content-page">
      <section className="board-toolbar">
        <div className="board-task-count"><strong>{filteredContents.length} konten</strong><span className="board-online-dot" /></div>
        {canCreate && <button className="board-add-button" type="button" onClick={openNewForm}><Plus size={15} /> Add New</button>}
        {!canCreate && <div className="role-board-note">Editor: akses produksi mulai tahap Rekaman</div>}
        <div className="board-toolbar-spacer" />
        <label className="board-search">
          <Search size={15} />
          <input type="search" placeholder="Cari judul atau konsep..." value={searchText} onChange={(event) => setSearchText(event.target.value)} />
        </label>
        <label className="board-select-control">
          <Filter size={14} />
          <select aria-label="Filter status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Semua status</option>{contentStatuses.filter((status) => !isEditor || !['idea', 'scripting'].includes(status.value)).map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
          <ChevronDown size={13} />
        </label>
        <button className="board-tool-button" type="button" onClick={() => setStatusFilter('all')}><SlidersHorizontal size={14} /> Reset</button>
      </section>

      <section className="kanban-board" aria-label="Papan alur konten">
        {visibleColumns.map((column) => {
          const columnContents = filteredContents.filter((content) => column.statuses.includes(content.status))
          return (
            <section className="kanban-column" key={column.id}>
              <header className="kanban-column-header">
                <div><h2>{column.label}</h2><span>{columnContents.length}</span></div>
              </header>
              <div className="kanban-card-list">
                {columnContents.map((content, index) => {
                  const stage = contentStatuses.find((item) => item.value === content.status) || contentStatuses[0]
                  const cardTone = (content.id + index) % 4
                  return (
                    <article className={`kanban-card kanban-card-tone-${cardTone}`} key={content.id}>
                      <div className="kanban-card-topline">
                        <span><CalendarDays size={12} />{content.date === 'Belum dijadwalkan' ? 'Belum dijadwalkan' : content.date}</span>
                        {content.status !== 'published' && (isAdmin || isEditor || (isCreator && ['idea', 'editing', 'ready'].includes(content.status))) && (
                          <button type="button" aria-label={`Edit ${content.title}`} onClick={() => openEditForm(content)}><MoreHorizontal size={16} /></button>
                        )}
                      </div>
                      <h3>{content.title}</h3>
                      {content.concept && <p className="kanban-card-description">{content.concept}</p>}
                      <p className="kanban-card-description">{content.format} · {content.channel}</p>
                      <div className="kanban-card-footer">
                        <span className={`kanban-priority priority-${content.priority.toLowerCase()}`}>{content.priority} priority</span>
                        <span className={`kanban-status-chip ${stage.color}`}>{stage.label}</span>
                      </div>
                      {content.status === 'ready' && (
                        <span className={`kanban-creator-approval ${content.creatorApproved ? 'approved' : ''}`}>
                          {content.creatorApproved ? 'Disetujui Creator' : 'Menunggu persetujuan Creator'}
                        </span>
                      )}
                      {content.status === 'published' && content.publishedUrl && (
                        <a className="kanban-published-link" href={content.publishedUrl} target="_blank" rel="noreferrer"><ExternalLink size={11} /> Lihat konten tayang</a>
                      )}
                      {content.draftFile && <p className="kanban-draft-attachment"><Paperclip size={11} />{content.draftFile.name}</p>}
                      {content.status === 'published' && Object.values(content.metrics || {}).some(Boolean) && (
                        <div className="kanban-metrics">
                          {Object.entries(content.metrics).filter(([, value]) => value !== '').map(([key, value]) => <span key={key}>{key}: <strong>{value}</strong></span>)}
                        </div>
                      )}
                      {content.status === 'published' && <span className="kanban-locked-label">Terkunci setelah publikasi</span>}
                      {content.status !== 'published' && (isAdmin || isEditor || (isCreator && ['idea', 'editing', 'ready'].includes(content.status))) && (
                        <button className="kanban-edit-button" type="button" onClick={() => openEditForm(content)}><Pencil size={12} /> {isCreator && content.status !== 'idea' ? 'Review konten' : 'Kelola konten'}</button>
                      )}
                    </article>
                  )
                })}
                {columnContents.length === 0 && (
                  <div className="kanban-empty-column">
                    <span>{searchText || statusFilter !== 'all' ? 'Konten tidak ditemukan' : column.hint}</span>
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </section>

      {activeDraft && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveDraft(null) }}>
          <section className="content-modal workflow-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
            <div className="modal-heading">
              <div>
                <span className="modal-kicker">{isNewContent ? 'IDE BARU' : 'ALUR KONTEN'}</span>
                <h2 id="form-title">{isNewContent ? 'Tambah konten' : 'Kelola konten'}</h2>
                <p>{isNewContent ? 'Catat ide kontenmu untuk memulai alur produksi.' : 'Perbarui detail dan lanjutkan konten ke tahap berikutnya.'}</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setActiveDraft(null)} aria-label="Tutup">×</button>
            </div>

            <div className="workflow-stepper" aria-label="Tahapan konten">
              {contentStatuses.map((stage, index) => (
                <div className={`workflow-step ${index <= draftStageIndex ? 'active' : ''}`} key={stage.value}>
                  <span>{index < draftStageIndex ? <Check size={11} /> : index + 1}</span>
                  <small>{stage.label}</small>
                </div>
              ))}
            </div>

            <form className="content-form" onSubmit={handleSubmit}>
              <div className="workflow-section-heading"><strong>Informasi konten</strong><span>Detail dasar ide</span></div>
              <label htmlFor="content-title">Judul konten</label>
              <input id="content-title" value={activeDraft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="Contoh: Tips membuat konten pertama" required maxLength="255" disabled={!canEditDetails} />
              <label htmlFor="content-concept">Konsep singkat</label>
              <textarea id="content-concept" value={activeDraft.concept} onChange={(event) => updateDraft('concept', event.target.value)} placeholder="Apa pesan utama yang ingin disampaikan?" rows="2" disabled={!canEditDetails} />
              <div className="form-row">
                <div><label htmlFor="content-channel">Platform</label><select id="content-channel" value={activeDraft.channel} onChange={(event) => updateDraft('channel', event.target.value)} disabled={!canEditDetails}><option>YouTube</option><option>TikTok</option><option>Instagram</option><option>LinkedIn</option></select></div>
                <div><label htmlFor="content-format">Format konten</label><select id="content-format" value={activeDraft.format} onChange={(event) => updateDraft('format', event.target.value)} disabled={!canEditDetails}><option>Video pendek</option><option>Video panjang</option><option>Carousel</option><option>Postingan</option></select></div>
              </div>
              <div className="form-row">
                <div><label htmlFor="content-priority">Prioritas</label><select id="content-priority" value={activeDraft.priority} onChange={(event) => updateDraft('priority', event.target.value)} disabled={!canEditDetails}><option>Rendah</option><option>Sedang</option><option>Tinggi</option></select></div>
                <div><label htmlFor="content-status">Status</label><select id="content-status" value={activeDraft.status} onChange={(event) => updateDraft('status', event.target.value)} disabled={isCreator}>{selectableStatuses.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}</select></div>
              </div>

              {(draftStageIndex >= 1 || activeDraft.status === 'scripting') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Perencanaan & naskah</strong><span>Tentukan jadwal dan tulis naskah</span></div>
                  <div className="form-row">
                    <div><label htmlFor="content-date">Tanggal jadwal</label><input id="content-date" type="date" value={activeDraft.scheduledDate} onChange={(event) => updateDraft('scheduledDate', event.target.value)} required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 1} disabled={!canEditDetails} /></div>
                    <div className="workflow-helper-field"><span>Jadwal tayang</span><small>{formatScheduledDate(activeDraft.scheduledDate)}</small></div>
                  </div>
                  <label htmlFor="content-script">Naskah / skrip</label>
                  <textarea id="content-script" value={activeDraft.script} onChange={(event) => updateDraft('script', event.target.value)} placeholder="Tulis poin utama, hook, dan alur konten..." rows="4" required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 1} disabled={!canEditDetails} />
                </section>
              )}

              {(draftStageIndex >= 2 || activeDraft.status === 'recording') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Checklist produksi</strong><span>Tandai kebutuhan yang sudah siap</span></div>
                  <div className="production-checklist">
                    {productionTasks.map((task) => (
                      <label key={task}>
                        <input type="checkbox" checked={activeDraft.productionChecklist.includes(task)} onChange={() => toggleProductionTask(task)} disabled={!isAdmin && !isEditor} />
                        <span>{task}</span>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {(draftStageIndex >= 3 || activeDraft.status === 'editing') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Editing & review</strong><span>Lampirkan draf dan catatan pemeriksaan</span></div>
                  <label htmlFor="content-draft-file">File draf <span>(atau isi tautan di bawah)</span></label>
                  <input id="content-draft-file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4,.mov" onChange={(event) => updateDraft('draftFile', event.target.files?.[0] || null)} disabled={!canEditDetails} />
                  {activeDraft.draftFile && <p className="workflow-file-name"><Paperclip size={12} />{activeDraft.draftFile.name}</p>}
                  <label htmlFor="content-draft-url">Tautan draf <span>(opsional jika file dilampirkan)</span></label>
                  <input id="content-draft-url" type="url" value={activeDraft.draftUrl} onChange={(event) => updateDraft('draftUrl', event.target.value)} placeholder="https://..." disabled={!canEditDetails} />
                  <label htmlFor="content-review-notes">Catatan review</label>
                  <textarea id="content-review-notes" value={activeDraft.reviewNotes} onChange={(event) => updateDraft('reviewNotes', event.target.value)} placeholder="Catat hasil review atau revisi yang diperlukan..." rows="3" required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 4 && !isCreator} disabled={!isAdmin && !isEditor && !creatorCanReview} />
                </section>
              )}

              {(draftStageIndex >= 4 || activeDraft.status === 'ready') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Persetujuan unggah</strong><span>Pastikan konten sudah selesai dan disetujui</span></div>
                  <label className="workflow-approval">
                    <input type="checkbox" checked={activeDraft.readyApproved} onChange={(event) => updateDraft('readyApproved', event.target.checked)} required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 4 && !isCreator} disabled={!isAdmin && !isEditor} />
                    <span>Konten selesai dan sudah divalidasi Editor</span>
                  </label>
                  {(isCreator || isAdmin) && (
                    <label className="workflow-approval creator-approval">
                      <input type="checkbox" checked={activeDraft.creatorApproved} onChange={(event) => updateDraft('creatorApproved', event.target.checked)} disabled={activeDraft.status !== 'ready'} />
                      <span>Creator menyetujui konten untuk dipublikasikan</span>
                    </label>
                  )}
                  {isEditor && !activeDraft.creatorApproved && (
                    <p className="workflow-permission-note">Publikasi dikunci sampai Creator menyetujui konten ini.</p>
                  )}
                </section>
              )}

              {(draftStageIndex >= 5 || activeDraft.status === 'published') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Publikasi & metrik</strong><span>URL tayang wajib diisi; metrik dapat dilengkapi nanti</span></div>
                  <label htmlFor="content-published-url">URL konten yang sudah tayang</label>
                  <input id="content-published-url" type="url" value={activeDraft.publishedUrl} onChange={(event) => updateDraft('publishedUrl', event.target.value)} placeholder="https://..." required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 5} disabled={!isAdmin && !editorCanPublish} />
                  <div className="workflow-section-heading"><strong>Metrik konten</strong><span>Angka dapat diperbarui kapan saja</span></div>
                  <div className="form-row workflow-metrics">
                    {Object.entries({ views: 'Views', likes: 'Likes', comments: 'Komentar', shares: 'Shares' }).map(([key, label]) => (
                      <div key={key}><label htmlFor={`metric-${key}`}>{label}</label><input id={`metric-${key}`} type="number" min="0" value={activeDraft.metrics[key]} onChange={(event) => updateDraft('metrics', { ...activeDraft.metrics, [key]: event.target.value })} placeholder="0" disabled={!isAdmin && !isEditor} /></div>
                    ))}
                  </div>
                </section>
              )}

              {formError && <p className="workflow-form-error" role="alert">{formError}</p>}
              <div className="modal-actions">
                <button type="button" className="button-outline" onClick={() => setActiveDraft(null)}>Batal</button>
                {(canEditDetails || creatorCanReview) && <button className="button-primary" type="submit">{isNewContent ? 'Simpan ide' : creatorCanReview ? 'Simpan review' : 'Simpan perubahan'}</button>}
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default ContentPage
