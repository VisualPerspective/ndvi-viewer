import * as React from 'react'
import { observable, autorun, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import constants, { strings } from '@app/constants'
import * as _ from 'lodash'
import RootStore from '../../models/RootStore'
import Point from '../../models/Point'
import { translate } from '../../utils'
import XAxis from './XAxis'

class TimeSeriesChart extends React.Component<{
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

    const margin = {
      top: 45,
      bottom: 33,
      left: 45,
      right: 0
    }

    const brushPosition = rootStore.timePeriod /
      (rootStore.timePeriods - 1) * (width - (margin.left + margin.right))
      + margin.left

    return (width && height) ? (
      <svg className="time-series" ref={ref => this.chart = ref}>
        <g className="axis y-axis">
          {
            constants.DATA_Y_TICKS.map((tick, i) => (
              <g key={i} className="tick y-tick"
                transform={translate(
                  margin.left - 3,
                  (height - margin.bottom) -
                  (i / (constants.DATA_Y_TICKS.length - 1)) *
                  (height - (margin.top + margin.bottom))
                )}>
                <text dy="6" x="-10" y="0">{tick}</text>
                <line x1="-6" y1="0.5" x2={width - margin.left} y2="0.5" />
              </g>
            ))
          }
        </g>
        <XAxis width={width} margin={margin} rootStore={rootStore} />
        <g transform={translate(brushPosition, margin.top)} className="brush"
          onMouseDown={() => this.props.startDragging()}>
          <line x1={0.5} y1={height - margin.top} x2={0.5} y2={0} />
          <g transform={translate(0, height - margin.top - 3)}>
            <polygon points="-3,0 -13,-10 -3,-20" />
            <polygon points="4,0 14,-10 4,-20" />
          </g>
        </g>
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(TimeSeriesChart))
