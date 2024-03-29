const formatRelativeTime = (timeInMileSec: number) => {
  const sec = timeInMileSec / 1000
  const min = timeInMileSec / (1000 * 60)
  const hrs = timeInMileSec / (1000 * 60 * 60)
  const days = timeInMileSec / (1000 * 60 * 60 * 24)
  const weeks = timeInMileSec / (1000 * 60 * 60 * 24 * 7)
  const months = timeInMileSec / (1000 * 60 * 60 * 24 * 31)
  const years = timeInMileSec / (1000 * 60 * 60 * 24 * 12)

  if (sec < 60) {
    return 'seconds'
  } else if (min < 60) {
    return formatTimeUnit(min, 'min', 'mins')
  } else if (hrs < 24) {
    return formatTimeUnit(hrs, 'hr', 'hrs')
  } else if (days < 7) {
    return formatTimeUnit(days, 'day', 'days')
  } else if (weeks < 4) {
    return formatTimeUnit(weeks, 'week', 'weeks')
  } else if (months < 12) {
    return formatTimeUnit(months, 'month', 'months')
  } else {
    return formatTimeUnit(years, 'year', 'years')
  }
}

const formatTimeUnit = (time: number, singular: string, plural: string) => {
  return parseInt(time.toFixed(0)) <= 1
    ? `${time.toFixed(0)} ${singular}`
    : `${time.toFixed(0)} ${plural}`
}

export { formatRelativeTime }
