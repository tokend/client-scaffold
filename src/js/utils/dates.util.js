import moment from 'moment'

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
