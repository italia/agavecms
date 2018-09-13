const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']

export default function formatBytes(num) {
  if (isNaN(parseFloat(num)) || !isFinite(num)) {
    return '-'
  }

  if (num === 0) {
    return '0 bytes'
  }

  const number = Math.floor(Math.log(num) / Math.log(1024))

  return `${(num / Math.pow(1024, Math.floor(number))).toFixed(0)} ${units[number]}`
}
