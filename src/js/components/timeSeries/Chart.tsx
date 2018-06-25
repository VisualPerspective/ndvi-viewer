import * as React from 'react'
import { autorun, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import { scaleLinear, scaleSequential } from 'd3'
import { interpolateViridis } from 'd3-scale-chromatic'
import RootStore from '@app/models/RootStore'
import Point from '@app/models/Point'
import XAxis from '@app/components/timeSeries/XAxis'
import YAxis from '@app/components/timeSeries/YAxis'
import Brush from '@app/components/timeSeries/Brush'
import Series from '@app/components/timeSeries/Series'

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
    top: 45,
    bottom: 33,
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

    const colorScale = scaleSequential(interpolateViridis)
      .domain([-0.2, 1.0])

    return (width && height) ? (
      <svg className='time-series' ref={ref => this.chart = ref}
        onMouseDown={() => this.props.startDragging()}>
        <YAxis width={width} height={height} margin={this.margin}
          colorScale={colorScale} />
        <XAxis width={width} height={height} margin={this.margin}
          rootStore={rootStore} />
        <Brush width={width} height={height} margin={this.margin} />
        <Series width={width} height={height} margin={this.margin}
          yScale={yScale} colorScale={colorScale} />
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(Chart))
