import * as React from 'react'
import { autorun, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import { scaleLinear, scaleSequential, scaleBand } from 'd3'
import { interpolateViridis } from 'd3-scale-chromatic'
import constants from '@app/constants'
import RootStore, { Modes } from '@app/models/RootStore'
import Point from '@app/models/Point'
import XAxis from '@app/components/timeSeries/XAxis'
import XAxisSorted from '@app/components/timeSeries/XAxisSorted'
import YAxis from '@app/components/timeSeries/YAxis'
import Brush from '@app/components/timeSeries/Brush'
import Series from '@app/components/timeSeries/Series'
import SeriesSorted from '@app/components/timeSeries/SeriesSorted'

class Chart extends React.Component<{
  width: number,
  height: number,
  mousePosition: Point,
  dragging: boolean,
  startDragging: () => void,
  rootStore?: RootStore,
}> {
  dragReactionDisposer: IReactionDisposer
  chart: SVGElement

  margin = {
    top: 35,
    bottom: 40,
    left: 50,
    right: 10,
  }

  componentDidMount () {
    this.dragReactionDisposer = autorun(() => {
      if (this.props.dragging === true) {
        const rect = this.chart.getBoundingClientRect()
        const x = this.props.mousePosition.x - (rect.left + this.margin.left)
        const innerWidth = rect.width - (this.margin.left + this.margin.right)
        const maxTimePeriod = this.props.rootStore.timePeriods - 1

        this.props.rootStore.timePeriod = _.clamp(
          Math.round(maxTimePeriod * x / innerWidth),
          0,
          maxTimePeriod,
        )
      }
    })
  }

  componentWillUnmount () {
    this.dragReactionDisposer()
  }

  render () {
    const {
      width,
      height,
      rootStore,
    } = this.props

    const yScale = scaleLinear()
      .domain([-0.2, 1.0])
      .range([
        height - this.margin.bottom,
        this.margin.top,
      ])

    const xScale = scaleLinear()
      .domain([0, rootStore.sortedAverages.length])
      .range([
        this.margin.left + 12,
        width - this.margin.right,
      ])

    const xScaleSortedBands = scaleBand()
      .domain(constants.MONTHS)
      .range([this.margin.left, width - this.margin.right])
      .padding(0.15)

    const xScaleSorted = (i: number) => {
      const n = rootStore.sortedAverages.length
      const years = n / 12
      const month = Math.floor(i / n * 12)

      return xScaleSortedBands(constants.MONTHS[month]) +
        (xScaleSortedBands.bandwidth() * (i % years) / (years - 1))
    }

    const colorScale = scaleSequential(interpolateViridis)
      .domain([-0.2, 1.0])

    return (width && height) ? (
      <svg className='time-series' ref={ref => this.chart = ref}
        onMouseDown={() => this.props.startDragging()}>
        <YAxis width={width} height={height} margin={this.margin}
          colorScale={colorScale} />
        {
          rootStore.mode === Modes.NDVI ?
            <XAxis height={height} margin={this.margin}
              xScale={xScale}
              rootStore={rootStore} /> :
            <XAxisSorted
              xScale={xScaleSortedBands}
              yScale={yScale}
              rootStore={rootStore} />
        }
        <Brush height={height} margin={this.margin}
          xScale={rootStore.mode === Modes.NDVI ? xScale : xScaleSorted} />
        {
          rootStore.mode === Modes.NDVI ?
            <Series height={height} margin={this.margin}
              xScale={xScale} yScale={yScale} colorScale={colorScale} /> :
            <SeriesSorted height={height} margin={this.margin}
              yScale={yScale} colorScale={colorScale} xScale={xScaleSorted} />
        }

      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(Chart))
