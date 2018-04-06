function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const DATE = new Date(2017, 12, 14)

function randomExponential (rate, randomUniform) {
  rate = rate || 500

  // Allow to pass a random uniform value or function
  // Default to Math.random()
  let U = randomUniform
  if (typeof randomUniform === 'function') U = randomUniform()
  if (!U) U = Math.random()

  return -Math.log(U) / rate
}

export function generatePrices (times = 360, fromDate = DATE) {
  let dates = []
  for (let i = 0; i < times; i++) {
    const time = randomDate(fromDate, new Date())
    dates.push(time)
  }
  dates = dates.sort((a, b) => a - b)

  const prices = [{
    time: dates[0],
    value: 100 + randomExponential(0.0005)
  }]

  for (let i = 1; i < times; i++) {
    const interval = randomExponential()
    const previousValue = prices[i - 1].value
    const sign = (Math.random() > 0.4 ? 1 : -1)
    const value = previousValue + interval * sign
    prices.push({
      time: dates[i],
      value
    })
  }
  return prices
    .reverse()
}
