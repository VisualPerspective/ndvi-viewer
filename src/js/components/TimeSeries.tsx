import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { strings } from '../constants'
import RootStore from '../models/RootStore'

class TimeSeries extends React.Component<{
  width: number,
  height: number,
  rootStore?: RootStore
}> {
  render () {
    const { width, height, rootStore } = this.props
    const xAxisHeight = 20
    const yAxisWidth = 20

    const chartWidth = width - yAxisWidth
    const chartHeight = height - xAxisHeight

    const brushPosition = rootStore.timePeriod /
      (rootStore.timePeriods - 1) * chartWidth

    return (width && height) ? (
      <svg className="time-series">
        <line
          x1={brushPosition}
          y1={height - xAxisHeight}
          x2={brushPosition}
          y2={0}
        />
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(TimeSeries))
