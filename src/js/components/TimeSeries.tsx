import * as React from 'react'
import { observable, autorun, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import constants, { strings } from '../constants'
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
        const timePeriods = this.props.rootStore.timePeriods

        this.props.rootStore.timePeriod = _.clamp(
          Math.floor(timePeriods * x / rect.width),
          0,
          timePeriods - 1
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

    const xAxisHeight = 45
    const yAxisWidth = 45

    const margin = {
      top: xAxisHeight,
      bottom: 15,
      left: yAxisWidth,
      right: 0
    }

    const brushPosition = rootStore.timePeriod /
      (rootStore.timePeriods - 1) * (width - (margin.left + margin.right))
      + margin.left

    return (width && height) ? (
      <svg className="time-series" ref={ref => this.chart = ref}>
        <g className="y-axis">
          {
            constants.DATA_Y_TICKS.map((tick, i) => (
              <g key={i} className="tick y-tick"
                transform={translate(
                  yAxisWidth - 3,
                  (height - margin.top) -
                  (i / (constants.DATA_Y_TICKS.length - 1)) * (height - xAxisHeight)
                )}>
                <text dy="6" x="-10" y="0">{tick}</text>
                <line x1="-6" y1="0.5" x2={width - yAxisWidth} y2="0.5" />
              </g>
            ))
          }
        </g>
        <g transform={translate(brushPosition, 0)} className="brush"
          onMouseDown={() => this.props.startDragging()}>
          <line x1={0.5} y1={height} x2={0.5} y2={0} />
          <g transform={translate(0, height - 3)}>
            <polygon points="-3,0 -13,-10 -3,-20" />
            <polygon points="4,0 14,-10 4,-20" />
          </g>
        </g>
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(TimeSeries))
