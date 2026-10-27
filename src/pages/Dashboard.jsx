import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  Clock3,
  FileText,
  FileVideo,
  MoreHorizontal,
  Music2,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '../components/ui.jsx'
import { contentStatuses, getContentStatus } from '../contentWorkflow.js'

const statusColors = {
  idea: 'status-idea',
  scripting: 'status-writing',
  recording: 'status-production',
  editing: 'status-editing',
  ready: 'status-ready',
  published: 'status-published',
}

const platformIcons = {
  YouTube: FileVideo,
  Instagram: Camera,
  TikTok: Music2,
  LinkedIn: BriefcaseBusiness,
}

function Dashboard({ contents, onViewAll, onAddContent }) {
  const monthlyGoal = 20
  const currentMonth = new Date()
  const monthContents = contents.filter((content) => {
    if (!content.scheduledDate) return false
    const scheduledDate = new Date(`${content.scheduledDate}T00:00:00`)
    return scheduledDate.getFullYear() === currentMonth.getFullYear()
      && scheduledDate.getMonth() === currentMonth.getMonth()
  })
  const monthProgressCount = monthContents.filter((content) => !['idea', 'published'].includes(content.status)).length
  const monthCompletedCount = monthContents.filter((content) => ['ready', 'published'].includes(content.status)).length
  const monthlyProgress = monthContents.length
    ? Math.round((monthCompletedCount / monthContents.length) * 100)
    : 0
  const monthlyGoalProgress = Math.round((monthCompletedCount / monthlyGoal) * 100)
  const monthlyGoalRemaining = Math.max(0, monthlyGoal - monthCompletedCount)
  const monthLabel = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const publishedCount = contents.filter((content) => content.status === 'published').length
  const inProgressCount = contents.filter((content) => !['idea', 'published'].includes(content.status)).length
  const stats = [
    { label: 'Total konten', value: contents.length, note: 'Di semua platform', icon: FileText, tone: 'violet' },
    { label: 'Sedang dikerjakan', value: inProgressCount, note: 'Dalam proses', icon: Clock3, tone: 'amber' },
    { label: 'Sudah terbit', value: publishedCount, note: 'Konten dipublikasikan', icon: TrendingUp, tone: 'emerald' },
  ]

  return (
    <div className="dashboard-page">
      <Card className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <Badge className="dashboard-hero-badge"><Sparkles size={13} /> MINGGU INI</Badge>
          <h2>Setiap konten hebat dimulai dari satu ide.</h2>
          <p>Kamu sudah selangkah lebih dekat dengan targetmu. Yuk, lanjutkan!</p>
          <Button variant="secondary" onClick={onAddContent}><Plus size={16} /> Tambah ide baru</Button>
        </div>
        <div className="dashboard-hero-art" aria-hidden="true">
          <div className="dashboard-hero-orbit" />
          <div className="dashboard-idea-card">
            <span><Sparkles size={14} /> IDE HARI INI</span>
            <strong>Konten yang<br />bermanfaat</strong>
            <div className="dashboard-idea-lines"><i /><i /><i /></div>
          </div>
          <div className="dashboard-hero-star">✦</div>
        </div>
      </Card>

      <section className="dashboard-stats" aria-label="Ringkasan konten">
        {stats.map(({ label, value, note, icon: Icon, tone }) => (
          <Card className="dashboard-stat-card" key={label}>
            <div className={`dashboard-stat-icon ${tone}`}><Icon size={19} /></div>
            <div className="dashboard-stat-copy">
              <span>{label}</span>
              <strong>{value.toString().padStart(2, '0')}</strong>
              <small>{note}</small>
            </div>
            <span className="dashboard-stat-decoration"><ArrowUpRight size={18} /></span>
          </Card>
        ))}
      </section>

      <Card className="dashboard-content-card">
        <CardHeader className="dashboard-section-header">
          <div>
            <CardTitle>Konten terbaru</CardTitle>
            <CardDescription>Ide dan pekerjaan yang sedang kamu siapkan.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onViewAll}>Lihat semua <ArrowRight size={15} /></Button>
        </CardHeader>
        <CardContent className="dashboard-table-content">
          {contents.length === 0 ? (
            <div className="dashboard-empty-state">
              <span><FileText size={22} /></span>
              <strong>Belum ada konten</strong>
              <p>Mulai dengan menambahkan ide pertamamu.</p>
              <Button variant="outline" size="sm" onClick={onAddContent}><Plus size={14} /> Tambah ide baru</Button>
            </div>
          ) : (
            <div className="dashboard-table-scroll">
              <table className="dashboard-table">
                <thead>
                  <tr><th>JUDUL KONTEN</th><th>PLATFORM</th><th>STATUS</th><th>JADWAL</th><th aria-label="Aksi" /></tr>
                </thead>
                <tbody>
                  {contents.slice(0, 4).map((content) => {
                    const PlatformIcon = platformIcons[content.channel] || FileText
                    return (
                      <tr key={content.id}>
                        <td>
                          <div className="dashboard-table-title">
                            <span className={`dashboard-platform-icon platform-${content.channel.toLowerCase()}`}><PlatformIcon size={17} /></span>
                            <span><strong>{content.title}</strong><small>{content.format} · Prioritas {content.priority.toLowerCase()}</small></span>
                          </div>
                        </td>
                        <td><span className="dashboard-platform-name">{content.channel}</span></td>
                        <td><Badge className={`dashboard-status ${statusColors[content.status] || 'status-idea'}`}><i />{getContentStatus(content.status).label}</Badge></td>
                        <td><span className="dashboard-date"><CalendarDays size={14} />{content.date}</span></td>
                        <td><Button variant="ghost" size="icon" aria-label={`Opsi ${content.title}`}><MoreHorizontal size={18} /></Button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="dashboard-bottom-grid">
        <Card className="dashboard-goal-card">
          <CardHeader className="dashboard-section-header">
            <div>
              <CardTitle>Target mingguan</CardTitle>
              <CardDescription>Langkah kecil untuk hasil yang besar.</CardDescription>
            </div>
            <span className="dashboard-goal-icon"><Target size={20} /></span>
          </CardHeader>
          <CardContent>
            <div className="dashboard-goal-meta"><strong>3 dari 5 konten</strong><span>60%</span></div>
            <Progress value={60} />
            <p className="dashboard-helper"><Check size={14} /> Dua konten lagi untuk mencapai targetmu minggu ini.</p>
            <div className="dashboard-monthly-goal">
              <div className="dashboard-monthly-goal-heading">
                <span><Target size={14} /> Achievement bulanan</span>
                <strong>{monthLabel}</strong>
              </div>
              <div className="dashboard-goal-meta">
                <strong>{monthCompletedCount} dari {monthlyGoal} konten</strong>
                <span>{monthlyGoalProgress}%</span>
              </div>
              <Progress value={monthlyGoalProgress} className="dashboard-monthly-goal-progress" />
              <p className="dashboard-helper">
                <Check size={14} />
                {monthlyGoalRemaining > 0
                  ? `${monthlyGoalRemaining} konten lagi untuk mencapai target bulan ini.`
                  : 'Target bulanan berhasil dicapai. Pertahankan progresmu!'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-monthly-card">
          <CardHeader className="dashboard-section-header">
            <div>
              <CardTitle>Analisis progres bulanan</CardTitle>
              <CardDescription>Status konten terjadwal · {monthLabel}</CardDescription>
            </div>
            <span className="dashboard-monthly-icon"><ChartNoAxesCombined size={19} /></span>
          </CardHeader>
          <CardContent className="dashboard-monthly-content">
            <div className="dashboard-monthly-summary">
              <div><strong>{monthContents.length}</strong><span>Konten bulan ini</span></div>
              <div><strong>{monthProgressCount}</strong><span>Sedang diproses</span></div>
              <div><strong>{monthCompletedCount}</strong><span>Siap / tayang</span></div>
            </div>
            <div className="dashboard-monthly-progress-heading">
              <span>Target penyelesaian</span><strong>{monthlyProgress}%</strong>
            </div>
            <Progress value={monthlyProgress} className="dashboard-monthly-progress" />
            <div className="dashboard-stage-breakdown">
              {contentStatuses.map((status) => {
                const count = monthContents.filter((content) => content.status === status.value).length
                const share = monthContents.length ? (count / monthContents.length) * 100 : 0
                return (
                  <div className="dashboard-stage-row" key={status.value}>
                    <span className={`dashboard-stage-dot ${status.color}`} />
                    <span className="dashboard-stage-label">{status.label}</span>
                    <div className="dashboard-stage-track"><i style={{ width: `${share}%` }} /></div>
                    <strong>{count}</strong>
                  </div>
                )
              })}
            </div>
            {monthContents.length === 0 && <p className="dashboard-monthly-empty">Belum ada konten dengan jadwal pada bulan ini.</p>}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Dashboard
