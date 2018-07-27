import * as React from 'react'
import { inject, observer } from 'mobx-react'
import XAxis from '@app/components/timeSeries/XAxis'
import YAxis from '@app/components/timeSeries/YAxis'
import Brush from '@app/components/timeSeries/Brush'
import Series from '@app/components/timeSeries/Series'

const Container = ({
  xScale,
  yScale,
  colorScale,
  onTimePeriodSelect,
  marginBottom,
}: {
  xScale: any
  yScale: any
  colorScale: any
  onTimePeriodSelect: any
  marginBottom: number
}) => (
  <>
    <YAxis
      xScale={xScale}
      yScale={yScale}
      colorScale={colorScale} />
    <XAxis
      xScale={xScale}
      yScale={yScale} />
    <Brush
      xScale={xScale}
      yScale={yScale} />
    <Series
      xScale={xScale}
      yScale={yScale}
      colorScale={colorScale}
      onTimePeriodSelect={onTimePeriodSelect}
      marginBottom={marginBottom} />
  </>
)

export default inject('rootStore')(observer(Container))
