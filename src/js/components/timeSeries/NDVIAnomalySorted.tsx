import * as React from 'react'
import RootStore from '@app/models/RootStore'
import { inject, observer } from 'mobx-react'
import Legend from '@app/components/timeSeries/Legend'
import XAxisSorted from '@app/components/timeSeries/XAxisSorted'
import YAxisNDVIAnomaly from '@app/components/timeSeries/YAxisNDVIAnomaly'
import Brush from '@app/components/timeSeries/Brush'
import SeriesSorted from '@app/components/timeSeries/SeriesSorted'
import {
  makeXScaleSorted,
  makeXScaleSortedBands,
  makeYScaleNDVIAnomaly,
  makeColorScaleNDVIAnomaly,
} from '@app/scales'

const NDVIAnomalySorted = ({
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

  const yScale = makeYScaleNDVIAnomaly({
    height,
    margin,
  })

  const colorScale = makeColorScaleNDVIAnomaly()

  return (
    <>
      <Legend
        xScale={xScaleSortedBands}
        yScale={yScale}
        colorScale={colorScale} />
      <YAxisNDVIAnomaly
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

export default inject('rootStore')(observer(NDVIAnomalySorted))
