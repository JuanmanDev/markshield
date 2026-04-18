/**
 * Token interpolation for watermark presets.
 * Supported tokens: {month}, {month_name}, {year}, {date}, {time}, {business}
 */
export const renderPresetText = (raw, options = {}) => {
  if (!raw) return ''
  const now = new Date()
  const locale = options.locale || 'es'
  const business = options.businessName || 'Hostal Zamora'

  const fmt = (opts) => new Intl.DateTimeFormat(locale, opts).format(now)

  const tokenMap = {
    month: String(now.getMonth() + 1).padStart(2, '0'),
    month_name: fmt({ month: 'long' }),
    year: String(now.getFullYear()),
    date: fmt({ day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: fmt({ hour: '2-digit', minute: '2-digit' }),
    business,
  }

  return raw.replace(/\{(\w+)\}/g, (_, key) => tokenMap[key] ?? `{${key}}`)
}
