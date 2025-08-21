export function formatYMD(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseYMD(ymd) {
  if (!ymd || typeof ymd !== 'string') return null
  const date = ymd.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!date) return null
  const year = Number(date[1]);
  const month = Number(date[2]);
  const day = Number(date[3])
  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null
  return new Date(year, month - 1, day)
}

export function isSameDate(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}