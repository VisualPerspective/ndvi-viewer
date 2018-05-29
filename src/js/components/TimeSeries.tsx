import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { strings } from '../constants'
import RootStore from '../models/RootStore'

const TimeSeries: React.SFC<{
  width: number,
  height: number,
  rootStore?: RootStore
}> = ({ width, height, rootStore }) => (
  (width && height) ? (
    <svg className="time-series">
      <line
        x1={rootStore.timePeriod / rootStore.timePeriods * width}
        y1={0}
        x2={rootStore.timePeriod / rootStore.timePeriods * width}
        y2={height}
      />
    </svg>
  ) : null
)

export default inject('rootStore')(observer(TimeSeries))
