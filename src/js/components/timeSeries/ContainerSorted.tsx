import * as React from 'react'
import { inject, observer } from 'mobx-react'
import XAxisSorted from '@app/components/timeSeries/XAxisSorted'
import YAxis from '@app/components/timeSeries/YAxis'
import Brush from '@app/components/timeSeries/Brush'
import SeriesSorted from '@app/components/timeSeries/SeriesSorted'

const ContainerSorted = ({ xScale, xScaleSortedBands, yScale, colorScale }: {
  xScale: any
  xScaleSortedBands: any
  yScale: any
  colorScale: any
}) => (
  <>
    <YAxis
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
      colorScale={colorScale} />
  </>
)

export default inject('rootStore')(observer(ContainerSorted))
