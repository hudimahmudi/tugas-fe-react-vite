export const contentStatuses = [
  { value: 'idea', label: 'Ide', color: 'status-idea' },
  { value: 'scripting', label: 'Menulis skrip', color: 'status-writing' },
  { value: 'recording', label: 'Rekaman', color: 'status-production' },
  { value: 'editing', label: 'Editing & review', color: 'status-editing' },
  { value: 'ready', label: 'Siap unggah', color: 'status-ready' },
  { value: 'published', label: 'Sudah tayang', color: 'status-published' },
]

export function getContentStatus(status) {
  return contentStatuses.find((item) => item.value === status) || contentStatuses[0]
}

export function formatScheduledDate(date) {
  return date
    ? new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Belum dijadwalkan'
}
