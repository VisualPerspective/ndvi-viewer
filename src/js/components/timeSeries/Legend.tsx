import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { format } from 'd3'
import constants from '@app/constants'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'

const Legend = ({ xScale, yScale, colorScale, rootStore }: {
  xScale: any,
  yScale: any,
  colorScale: any,
  rootStore?: RootStore,
}) => {
  const label = (
    constants.MONTHS[rootStore.timePeriod % 12] + ' ' +
    (Number(constants.START_YEAR) + Math.floor(rootStore.timePeriod / 12))
  )

  const formatter = format('.2f')
  const mean = rootStore.timePeriodAverages[rootStore.timePeriod]

  return (
    <g transform={translate(
      xScale.range()[1] / 2 - 155,
      6
    )} className='legend'>
        <circle cx='-10' cy='-5' r='5' fill={colorScale(mean)} />
        <text>
          Average NDVI in selected region for {label}:
          <tspan fontWeight='bold'> {formatter(mean)}</tspan>
        </text>
    </g>
  )
}

export default inject('rootStore')(observer(Legend))
