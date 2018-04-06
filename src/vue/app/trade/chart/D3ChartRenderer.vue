<template>
  <div class="chart-root">
  </div>
</template>

<script>
  import * as d3Array from 'd3-array'
  import * as d3Selection from 'd3-selection'
  import * as d3Scale from 'd3-scale'
  import * as d3Axis from 'd3-axis'
  import * as d3Shape from 'd3-shape'
  import * as d3Transition from 'd3-transition'
  import * as d3Ease from 'd3-ease'

  // import * as d3 from 'd3'
  import moment from 'moment'
  const d3 = Object.assign({}, d3Array, d3Selection, d3Axis, d3Shape, d3Scale, d3Transition, d3Ease)

  export default {
    name: 'chart',
    props: {
      data: {
        type: Array,
        default: () => []
      },
      currency: {
        type: String,
        default: 'SUN'
      },
      scale: {
        type: String,
        default: 'hour'
      },
      requiredTicks: {
        type: Array,
        default: () => []
      },
      precision: {
        type: Number,
        default: 0
      }
    },

    watch: {
      data (data) {
        this.render()
      }
    },

    mounted (...args) {
      this.render()
      window.addEventListener('resize', this.render)
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.render)
    },

    computed: {
      normalizedData () {
        return this.data.map(item => ({
          time: moment(item.timestamp).toDate(),
          value: parseFloat(parseFloat(item.value).toFixed(this.precision))
        }))
      }
    },

    methods: {
      localize (value) {
        return `${value} ${this.precision}`
      },
      clear () {
        d3.select('svg.chart').remove()
      },

      getDimensions () {
        const parentElement = this.$el.parentElement
        return {
          width: parentElement.clientWidth,
          height: parentElement.clientHeight < 250
            ? 250
            : parentElement.clientHeight
        }
      },

      getMaxAndMin () {
        const arr = this.data.map(item => item.value)
        const max = Math.max(...arr, ...this.requiredTicks)
        const min = this.requiredTicks && this.requiredTicks.length ? 0 : Math.min(...arr)
        return { max, min }
      },

      addDomainPadding (domain) {
        let [min, max] = domain
        const diff = (max - min) || 0.0001
        const padding = diff * 0.05
        min = min - padding
        max = max + padding
        return [min, max]
      },

      formatMoney (amount) {
        const curSym = ({ 'SUN': 'SUN' })[this.currency]
        const moneyFormats = {
          'en': (curSym, amount) => `${curSym}${amount}`
        }
        return moneyFormats['en'](curSym, amount.toFixed(this.precision))
      },

      render () {
        this.clear(this.$el)

        // Setup the data
        const scale = this.scale
        const data = this.normalizedData
        const { max, min } = this.getMaxAndMin(data)
        if (!data[0] || !data[data.length - 1]) return

        const firstDate = data[0].time
        const lastDate = data[data.length - 1].time

        // Setup svg
        const className = 'chart'
        const yAxisTickWidth = this.formatMoney(max).length * 9 + 5
        const margin = { top: 2, left: yAxisTickWidth, bottom: 32, right: 0 }
        const dimensions = this.getDimensions(this.$el)
        const width = dimensions.width // - margin.right - margin.left
        const height = dimensions.height - margin.top - margin.bottom

        const viewWidth = width + margin.right + margin.left
        const viewHeight = height + margin.top + margin.bottom
        const svg = d3.select(this.$el)
          .append('svg')
          .attr('width', '100%')
          .attr('viewBox', `0 0 ${viewWidth} ${viewHeight}`)
          .attr('preserveAspectRatio', 'xMinYMin')
          .attr('class', className)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)

        // Define domains
        const y = d3.scaleLinear()
          .range([height, 0])
          .domain(this.addDomainPadding([min, max]))

        const x = d3.scaleTime()
          .range([0, width])
          .domain([firstDate, lastDate])

        // Render the line and area
        const line = d3.line()
          .x((d) => x(d.time))
          .y((d) => y(d.value))

        const path = svg.append('path')
          .attr('class', `${className}__line`)
          .attr('d', line(data))

        const totalLength = path.node().getTotalLength()

        path
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)

        // Render x-axis
        const xAxisTickFormat = ({
          hour: 'hh:mm a',
          day: 'hh:mm a',
          week: 'ddd',
          month: 'MMM DD',
          year: 'MMM DD, YY',
          all: 'MM/DD/YYYY'
        })[scale]

        const xAxis = d3.axisBottom(x)
          .tickValues([
            data[parseInt(data.length * 0.10)].time,
            data[parseInt(data.length * 0.36)].time,
            data[parseInt(data.length * 0.63)].time,
            data[parseInt(data.length * 0.90)].time
          ])
          .tickFormat((d) => moment(d).format(xAxisTickFormat))
          .tickSize(0)
          .tickPadding(0)

        svg.append('g')
          .attr('class', `${className}__x-axis`)
          .attr('transform', `translate(0, ${height})`)
          .call(xAxis)

        // Render y-axis
        const tick1 = max // (max - min) > 7 ? Math.floor(min + ((max - min) * 0.85)) : (min + ((max - min) * 0.85))
        // const tick2 = (max - min) > 7 ? Math.floor(min + ((max - min) * 0.50)) : (min + ((max - min) * 0.50))
        const tick3 = min // (max - min) > 7 ? Math.floor(min + ((max - min) * 0.15)) : (min + ((max - min) * 0.15))
        const yAxisLine = d3.axisLeft(y)
          .tickValues([ tick1, tick3 ].concat(this.requiredTicks))
          .tickFormat((d) => `${this.localize(d)} ${this.currency}`) // unbreakable space this.formatMoney(d)
          .tickSizeInner(-(width + margin.right))
          .tickSizeOuter(0)
          .tickPadding(25)

        svg.append('g')
          .attr('class', `${className}__y-axis`)
          .call(yAxisLine)
          .selectAll('line')

        // Tip
        const tip = svg.append('g')
          .attr('class', `${className}__tip`)

        // Tip line
        tip.append('line')
          .attr('class', `${className}__tip-line`)
          .attr('x1', 0)
          .attr('y1', 15)
          .attr('x2', 0)
          .attr('y2', height)

        // Tip circle
        const tipCircle = tip.append('circle')
          .attr('class', `${className}__tip-circle`)
          .attr('cx', 0)
          .attr('r', 5)

        // Tip text box
        const tipTextBox = tip.append('g')

        tipTextBox.append('rect')
          .attr('class', `${className}__tip-text-box`)
          .attr('width', 150)
          .attr('height', 55)
          .attr('transform', 'translate(-75, -38)')
          .attr('rx', 3)
          .attr('ry', 3)

        const tipPriceText = tipTextBox.append(
'text')
          .attr('class', `${className}__tip-text-price`)
          .attr('text-anchor', 'middle')
          .attr('y', -15)

        const tipTimeText = tipTextBox.append('text')
          .attr('class', `${className}__tip-text-time`)
          .attr('text-anchor', 'middle')
          .attr('y', 5)

        // Tip motion capture area
        const motionCaptureArea = svg.append('rect')
          .attr('class', `${className}__tip-motion-capture-area`)
          .attr('width', width)
          .attr('height', height - 25)
          .attr('transform', 'translate(0, 25)')

        // Tip Mouse events
        for (const event of ['mouseenter', 'touchenter']) {
          motionCaptureArea.on(event, function () {
            tip.classed(`${className}__tip--show`, true)
          })
        }

        for (const event of ['mousemove', 'touchmove']) {
          motionCaptureArea.on(event, () => {
            tip.classed(`${className}__tip--hidden`, false)
            const x0 = x.invert(d3.mouse(svg.node())[0])
            const bisectDate = d3.bisector(d => d.time).left
            const bisectIndex = bisectDate(data, x0, 1)
            const d0 = data[bisectIndex - 1]
            const d1 = data[bisectIndex]
            const nearestPoint = x0 - d0.time > d1.time - x0 ? d1 : d0
            // Change text of the tooltip
            tipPriceText.text(`${this.localize(nearestPoint.value)} ${this.currency}`)
            tipTimeText.text(moment(nearestPoint.time).format('MM/DD/YYYY hh:mm a'))

            // Change X position of the tip
            tip.attr('transform', `translate(${x(nearestPoint.time)})`)

            // Change Y position of the circle
            tipCircle.attr('cy', y(nearestPoint.value))
          })
        }

        for (const event of ['mouseout', 'touchout']) {
          motionCaptureArea.on(event, function () {
            tip.classed(`${className}__tip--show`, false)
          })
        }

        tip.classed(`${className}__tip--hidden`, true)

        // window.setTimeout(() => motionCaptureArea.dispatchEvent('mousemove'), 200)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../../scss/variables";

  .chart-root,
  .chart-root svg {
    // max-height: 200px;
    @media (min-width: 767px) {
      min-height: 200px;
    }
    transition: .2s;
  }

  svg.chart {
    display: block;
    overflow: visible;

    * { font-family: inherit; }
    & > g { overflow: hidden; }
  }

  .chart__area {
    fill: $col-chart-fill;
    opacity: 0;
  }

  .chart__line {
    fill: none;
    stroke-width: 2px;
    stroke: $col-chart-line;
    stroke-linecap: round;
  }

  .chart__x-axis {
    text {
      font-size: $fs-root;
      fill: $col-chart-text;
    }
    .domain { display: none; }
  }

  .chart__y-axis {
    text {
      font-size: $fs-root;
      fill: $col-chart-text;
    }
    line {
      stroke-dasharray: 3 3;
      stroke: $col-chart-ticks;
      opacity: .15;
    }
    .domain { display: none; }
  }

  .chart__tip {
    transition: opacity .2s;
    opacity: 0;
    &--show { opacity: 1; }
    &--hidden { opacity: 0!important; }
  }
  .chart__tip-line {
    stroke-width: 1px;
    stroke: $col-chart-line;
  }

  .chart__tip-circle {
    stroke-width: 2px;
    stroke: $col-chart-fill;
    fill: $col-chart-line;
  }

  .chart__tip-text-box {
    fill: $col-chart-fill;
    stroke: $col-chart-line;
    stroke-width: 1px;
  }

  .chart__tip-text-price {
    font-size: $fs-root;
    fill: $col-chart-line;
    font-weight: 800;
  }

  .chart__tip-text-time {
    font-size: $fs-tip;
    fill: $col-chart-line;
  }

  .chart__tip-motion-capture-area {
    opacity: 0;
  }
</style>
