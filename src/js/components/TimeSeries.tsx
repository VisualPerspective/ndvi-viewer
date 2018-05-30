import * as React from 'react'
import { observable, autorun, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import { strings } from '../constants'
import * as _ from 'lodash'
import RootStore from '../models/RootStore'
import Point from '../models/Point'

const translate = (x:number, y:number) => (
  `translate(${x} ${y})`
)

class TimeSeries extends React.Component<{
  width: number,
  height: number,
  mousePosition: Point,
  dragging: boolean,
  startDragging: () => void,
  rootStore?: RootStore,
}> {
  dragReactionDisposer: IReactionDisposer
  chart: SVGElement

  componentDidMount () {
    this.dragReactionDisposer = autorun(() => {
      if (this.props.dragging === true) {
        const rect = this.chart.getBoundingClientRect()
        const x = this.props.mousePosition.x - rect.left

        this.props.rootStore.timePeriod = _.clamp(
          Math.floor(this.props.rootStore.timePeriods * x / rect.width),
          0,
          this.props.rootStore.timePeriods - 1
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
      mousePosition,
      startDragging,
      dragging
    } = this.props

    const xAxisHeight = 20
    const yAxisWidth = 20

    const chartWidth = width - yAxisWidth
    const chartHeight = height - xAxisHeight

    const brushPosition = rootStore.timePeriod /
      (rootStore.timePeriods - 1) * chartWidth
      + yAxisWidth

    return (width && height) ? (
      <svg className="time-series" ref={ref => this.chart = ref}>
        <g transform={translate(brushPosition, 0)} className="brush"
          onMouseDown={() => this.props.startDragging()}>
          <line x1={0.5} y1={height - xAxisHeight} x2={0.5} y2={0} />
          <g transform={translate(0, chartHeight)}>
            <polygon points="-3,0 -13,-10 -3,-20" />
            <polygon points="4,0 14,-10 4,-20" />
          </g>
        </g>
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(TimeSeries))
