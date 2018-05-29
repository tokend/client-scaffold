import moment from 'moment'

export function formatDate (date) {
  return moment(date).format('MMMM DD hh:mm a')
}

export function humanizeDate (date) {
  return moment(date).calendar(null, {
    lastWeek: 'DD MMM LT',
    sameElse: 'DD MMM LT'
  })
}

export function humanizeFutureDate (date) {
  return moment(date).calendar(null, {
    sameDay: '[today at] HH:mm',
    nextDay: '[tomorrow at] HH:mm',
    sameElse: 'DD/MM/YYYY'
  }
 )
}

export function humanizePastDate (date) {
  return moment(date).calendar(null, {
    sameDay: '[Today at] HH:mm',
    lastDay: '[Yesterday at] HH:mm',
    lastWeek: '[Last] dddd [at] HH:mm',
    sameElse: 'DD MMMM YYYY [at] HH:mm'
  })
}

export function fromInputToISO (date) {
  if (!date) return ''
  return (new Date(date)).toISOString()
}

export const inputDateFormat = 'DD/MM/YYYY'

export function getSeconds (date) {
  try {
    if (date.indexOf('/') !== -1) {
      return '' + moment(date, inputDateFormat).utc().format('X')
    }
    return '' + moment(date).utc().format('X')
  } catch (e) {
    console.error(e)
    return '' + moment(date).utc().format('X')
  }
}
