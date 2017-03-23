export function floatTimeToAmPm (value) {
  const hours24 = Math.floor(value)
  const hours12 = hours24 >= 12 ? hours24 - 12 : hours24
  const ampm = hours24 < 12 ? 'AM' : 'PM'
  const minutes = Math.ceil((value - Math.floor(value)) * 60)
  const score = hours12 + ':' + ((minutes < 10 ? '0' : '') + minutes).toString()
  return {score, ampm}
}

export function floatTimeToHoursMinutes (value) {
  const hours = Math.floor(value)
  const minutes = Math.ceil((value - Math.floor(value)) * 60)
  return { hours, minutes }
}
