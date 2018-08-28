import * as React from 'react'
import RootStore from '@app/models/RootStore'
import { inject, observer } from 'mobx-react'
import Legend from '@app/components/timeSeries/Legend'
import XAxisSorted from '@app/components/timeSeries/XAxisSorted'
import YAxisNDVI from '@app/components/timeSeries/YAxisNDVI'
import Brush from '@app/components/timeSeries/Brush'
import SeriesSorted from '@app/components/timeSeries/SeriesSorted'
import {
  makeXScaleSorted,
  makeXScaleSortedBands,
  makeYScaleNDVI,
  makeColorScaleNDVI,
} from '@app/scales'

const NDVISorted = ({
  onTimePeriodSelect,
  width,
  height,
  margin,
  rootStore,
}: {
  onTimePeriodSelect: any
  width: number
  height: number
  margin: any
  rootStore?: RootStore
}) => {
  const xScaleSortedBands = makeXScaleSortedBands({
    width,
    margin,
  })

  const xScale = makeXScaleSorted({
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
        xScale={xScaleSortedBands}
        yScale={yScale}
        colorScale={colorScale} />
      <YAxisNDVI
        xScale={xScaleSortedBands}
        yScale={yScale}
        colorScale={colorScale} />
      <XAxisSorted
        xScale={xScaleSortedBands}
        yScale={yScale} />
      <Brush
        xScale={xScale}
        yScale={yScale} />
      <SeriesSorted
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
        onTimePeriodSelect={onTimePeriodSelect}
        marginBottom={margin.bottom} />
    </>
  )
}

export default inject('rootStore')(observer(NDVISorted))
