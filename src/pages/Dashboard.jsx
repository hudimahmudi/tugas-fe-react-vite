import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  FileVideo,
  Lightbulb,
  MoreHorizontal,
  Music2,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '../components/ui.jsx'

const statusColors = {
  Ide: 'status-idea',
  'Menulis skrip': 'status-writing',
  Produksi: 'status-production',
  'Sedang diedit': 'status-editing',
  'Siap terbit': 'status-ready',
  Terbit: 'status-published',
}

const platformIcons = {
  YouTube: FileVideo,
  Instagram: Camera,
  TikTok: Music2,
  LinkedIn: BriefcaseBusiness,
}

function Dashboard({ contents, onViewAll, onAddContent }) {
  const publishedCount = contents.filter((content) => content.status === 'Terbit').length
  const inProgressCount = contents.filter((content) => content.status !== 'Ide' && content.status !== 'Terbit').length
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
                        <td><Badge className={`dashboard-status ${statusColors[content.status] || 'status-idea'}`}><i />{content.status}</Badge></td>
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
          </CardContent>
        </Card>
        <Card className="dashboard-tip-card">
          <div className="dashboard-tip-icon"><Lightbulb size={20} /></div>
          <div>
            <Badge variant="outline" className="dashboard-tip-label">TIPS HARI INI</Badge>
            <h2>Mulai dari ide sederhana</h2>
            <p>Catat ide kecil yang muncul. Kamu bisa mengembangkannya nanti.</p>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default Dashboard
