import { useState } from 'react'
import { CalendarDays, Check, ChevronDown, ExternalLink, Filter, MoreHorizontal, Paperclip, Pencil, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { contentStatuses, formatScheduledDate } from '../contentWorkflow.js'

const columns = [
  { id: 'idea', label: 'Idea', statuses: ['idea'], hint: 'Ide belum dimulai', allowAdd: true },
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
    publishedUrl: content.publishedUrl || '',
    metrics: { ...emptyMetrics, ...(content.metrics || {}) },
  }
}

function ContentPage({ contents, onAddContent, onUpdateContent }) {
  const [activeDraft, setActiveDraft] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formError, setFormError] = useState('')
  const isNewContent = activeDraft?.id === undefined
  const draftStageIndex = activeDraft ? contentStatuses.findIndex((item) => item.value === activeDraft.status) : 0

  const filteredContents = contents.filter((content) => {
    const matchesText = `${content.title} ${content.concept || ''}`.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter
    return matchesText && matchesStatus
  })

  function openNewForm() {
    setFormError('')
    setActiveDraft(createDraft())
  }

  function openEditForm(content) {
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
    const targetIndex = contentStatuses.findIndex((item) => item.value === activeDraft.status)
    const currentIndex = isNewContent
      ? 0
      : contentStatuses.findIndex((item) => item.value === contents.find((content) => content.id === activeDraft.id)?.status)

    if (!isNewContent && targetIndex > currentIndex + 1) {
      setFormError('Konten harus melewati tahap secara berurutan.')
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
        <div className="board-task-count"><strong>{contents.length} konten</strong><span className="board-online-dot" /></div>
        <button className="board-add-button" type="button" onClick={openNewForm}><Plus size={15} /> Add New</button>
        <div className="board-toolbar-spacer" />
        <label className="board-search">
          <Search size={15} />
          <input type="search" placeholder="Cari judul atau konsep..." value={searchText} onChange={(event) => setSearchText(event.target.value)} />
        </label>
        <label className="board-select-control">
          <Filter size={14} />
          <select aria-label="Filter status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Semua status</option>{contentStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
          <ChevronDown size={13} />
        </label>
        <button className="board-tool-button" type="button" onClick={() => setStatusFilter('all')}><SlidersHorizontal size={14} /> Reset</button>
      </section>

      <section className="kanban-board" aria-label="Papan alur konten">
        {columns.map((column) => {
          const columnContents = filteredContents.filter((content) => column.statuses.includes(content.status))
          return (
            <section className="kanban-column" key={column.id}>
              <header className="kanban-column-header">
                <div><h2>{column.label}</h2><span>{columnContents.length}</span></div>
                {column.allowAdd && <button type="button" aria-label={`Tambah konten ke ${column.label}`} onClick={openNewForm}><Plus size={16} /></button>}
              </header>
              <div className="kanban-card-list">
                {columnContents.map((content, index) => {
                  const stage = contentStatuses.find((item) => item.value === content.status) || contentStatuses[0]
                  const cardTone = (content.id + index) % 4
                  return (
                    <article className={`kanban-card kanban-card-tone-${cardTone}`} key={content.id}>
                      <div className="kanban-card-topline">
                        <span><CalendarDays size={12} />{content.date === 'Belum dijadwalkan' ? 'Belum dijadwalkan' : content.date}</span>
                        <button type="button" aria-label={`Edit ${content.title}`} onClick={() => openEditForm(content)}><MoreHorizontal size={16} /></button>
                      </div>
                      <h3>{content.title}</h3>
                      {content.concept && <p className="kanban-card-description">{content.concept}</p>}
                      <p className="kanban-card-description">{content.format} · {content.channel}</p>
                      <div className="kanban-card-footer">
                        <span className={`kanban-priority priority-${content.priority.toLowerCase()}`}>{content.priority} priority</span>
                        <span className={`kanban-status-chip ${stage.color}`}>{stage.label}</span>
                      </div>
                      {content.status === 'published' && content.publishedUrl && (
                        <a className="kanban-published-link" href={content.publishedUrl} target="_blank" rel="noreferrer"><ExternalLink size={11} /> Lihat konten tayang</a>
                      )}
                      {content.draftFile && <p className="kanban-draft-attachment"><Paperclip size={11} />{content.draftFile.name}</p>}
                      {content.status === 'published' && Object.values(content.metrics || {}).some(Boolean) && (
                        <div className="kanban-metrics">
                          {Object.entries(content.metrics).filter(([, value]) => value !== '').map(([key, value]) => <span key={key}>{key}: <strong>{value}</strong></span>)}
                        </div>
                      )}
                      <button className="kanban-edit-button" type="button" onClick={() => openEditForm(content)}><Pencil size={12} /> Kelola konten</button>
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
              <input id="content-title" value={activeDraft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="Contoh: Tips membuat konten pertama" required maxLength="255" />
              <label htmlFor="content-concept">Konsep singkat</label>
              <textarea id="content-concept" value={activeDraft.concept} onChange={(event) => updateDraft('concept', event.target.value)} placeholder="Apa pesan utama yang ingin disampaikan?" rows="2" />
              <div className="form-row">
                <div><label htmlFor="content-channel">Platform</label><select id="content-channel" value={activeDraft.channel} onChange={(event) => updateDraft('channel', event.target.value)}><option>YouTube</option><option>TikTok</option><option>Instagram</option><option>LinkedIn</option></select></div>
                <div><label htmlFor="content-format">Format konten</label><select id="content-format" value={activeDraft.format} onChange={(event) => updateDraft('format', event.target.value)}><option>Video pendek</option><option>Video panjang</option><option>Carousel</option><option>Postingan</option></select></div>
              </div>
              <div className="form-row">
                <div><label htmlFor="content-priority">Prioritas</label><select id="content-priority" value={activeDraft.priority} onChange={(event) => updateDraft('priority', event.target.value)}><option>Rendah</option><option>Sedang</option><option>Tinggi</option></select></div>
                <div><label htmlFor="content-status">Status</label><select id="content-status" value={activeDraft.status} onChange={(event) => updateDraft('status', event.target.value)}>{contentStatuses.slice(0, Math.min(draftStageIndex + 2, contentStatuses.length)).map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}</select></div>
              </div>

              {(draftStageIndex >= 1 || activeDraft.status === 'scripting') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Perencanaan & naskah</strong><span>Tentukan jadwal dan tulis naskah</span></div>
                  <div className="form-row">
                    <div><label htmlFor="content-date">Tanggal jadwal</label><input id="content-date" type="date" value={activeDraft.scheduledDate} onChange={(event) => updateDraft('scheduledDate', event.target.value)} required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 1} /></div>
                    <div className="workflow-helper-field"><span>Jadwal tayang</span><small>{formatScheduledDate(activeDraft.scheduledDate)}</small></div>
                  </div>
                  <label htmlFor="content-script">Naskah / skrip</label>
                  <textarea id="content-script" value={activeDraft.script} onChange={(event) => updateDraft('script', event.target.value)} placeholder="Tulis poin utama, hook, dan alur konten..." rows="4" required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 1} />
                </section>
              )}

              {(draftStageIndex >= 2 || activeDraft.status === 'recording') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Checklist produksi</strong><span>Tandai kebutuhan yang sudah siap</span></div>
                  <div className="production-checklist">
                    {productionTasks.map((task) => (
                      <label key={task}>
                        <input type="checkbox" checked={activeDraft.productionChecklist.includes(task)} onChange={() => toggleProductionTask(task)} />
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
                  <input id="content-draft-file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4,.mov" onChange={(event) => updateDraft('draftFile', event.target.files?.[0] || null)} />
                  {activeDraft.draftFile && <p className="workflow-file-name"><Paperclip size={12} />{activeDraft.draftFile.name}</p>}
                  <label htmlFor="content-draft-url">Tautan draf <span>(opsional jika file dilampirkan)</span></label>
                  <input id="content-draft-url" type="url" value={activeDraft.draftUrl} onChange={(event) => updateDraft('draftUrl', event.target.value)} placeholder="https://..." />
                  <label htmlFor="content-review-notes">Catatan review</label>
                  <textarea id="content-review-notes" value={activeDraft.reviewNotes} onChange={(event) => updateDraft('reviewNotes', event.target.value)} placeholder="Catat hasil review atau revisi yang diperlukan..." rows="3" required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 4} />
                </section>
              )}

              {(draftStageIndex >= 4 || activeDraft.status === 'ready') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Persetujuan unggah</strong><span>Pastikan konten sudah selesai dan disetujui</span></div>
                  <label className="workflow-approval">
                    <input type="checkbox" checked={activeDraft.readyApproved} onChange={(event) => updateDraft('readyApproved', event.target.checked)} required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 4} />
                    <span>Konten selesai dan sudah disetujui untuk diunggah</span>
                  </label>
                </section>
              )}

              {(draftStageIndex >= 5 || activeDraft.status === 'published') && (
                <section className="workflow-stage-section">
                  <div className="workflow-section-heading"><strong>Publikasi & metrik</strong><span>URL tayang wajib diisi; metrik dapat dilengkapi nanti</span></div>
                  <label htmlFor="content-published-url">URL konten yang sudah tayang</label>
                  <input id="content-published-url" type="url" value={activeDraft.publishedUrl} onChange={(event) => updateDraft('publishedUrl', event.target.value)} placeholder="https://..." required={contentStatuses.findIndex((item) => item.value === activeDraft.status) >= 5} />
                  <div className="workflow-section-heading"><strong>Metrik konten</strong><span>Angka dapat diperbarui kapan saja</span></div>
                  <div className="form-row workflow-metrics">
                    {Object.entries({ views: 'Views', likes: 'Likes', comments: 'Komentar', shares: 'Shares' }).map(([key, label]) => (
                      <div key={key}><label htmlFor={`metric-${key}`}>{label}</label><input id={`metric-${key}`} type="number" min="0" value={activeDraft.metrics[key]} onChange={(event) => updateDraft('metrics', { ...activeDraft.metrics, [key]: event.target.value })} placeholder="0" /></div>
                    ))}
                  </div>
                </section>
              )}

              {formError && <p className="workflow-form-error" role="alert">{formError}</p>}
              <div className="modal-actions">
                <button type="button" className="button-outline" onClick={() => setActiveDraft(null)}>Batal</button>
                <button className="button-primary" type="submit">{isNewContent ? 'Simpan ide' : 'Simpan perubahan'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default ContentPage
