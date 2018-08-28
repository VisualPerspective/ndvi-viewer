import * as React from 'react'
import RootStore from '@app/models/RootStore'
import { inject, observer } from 'mobx-react'
import Legend from '@app/components/timeSeries/Legend'
import XAxis from '@app/components/timeSeries/XAxis'
import YAxisNDVI from '@app/components/timeSeries/YAxisNDVI'
import Brush from '@app/components/timeSeries/Brush'
import Series from '@app/components/timeSeries/Series'
import {
  makeXScale,
  makeYScaleNDVI,
  makeColorScaleNDVI,
} from '@app/components/timeSeries/Scales'

const NDVI = ({
  onTimePeriodSelect,
  width,
  height,
  margin,
  rootStore,
}: {
  onTimePeriodSelect: any,
  width: number,
  height: number,
  margin: any
  rootStore?: RootStore
}) => {
  const xScale = makeXScale({
    numTimePeriods: rootStore.numTimePeriods,
    width,
    margin,
  })

  const yScale = makeYScaleNDVI({
    height,
    margin,
  })

  const colorScale = makeColorScaleNDVI()

  return (
    <>
      <Legend
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale} />
      <YAxisNDVI
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
        marginBottom={margin.bottom} />
    </>
  )
}

export default inject('rootStore')(observer(NDVI))
