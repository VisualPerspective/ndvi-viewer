import * as React from 'react'
import { inject, observer } from 'mobx-react'
import constants from '@app/constants'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'

const Brush = ({ xScale, yScale, rootStore }: {
  xScale: any,
  yScale: any,
  rootStore?: RootStore,
}) => {
  const label = (
    constants.MONTHS[rootStore.sortedTimePeriod % 12] + ' ' +
    (Number(constants.START_YEAR) + Math.floor(rootStore.sortedTimePeriod / 12))
  )

  return (
    <g transform={translate(xScale(rootStore.timePeriod), yScale.range()[1])}
      className='brush'>
      <line x1={0.5} y1={yScale.range()[0] - yScale.range()[1] + 28} x2={0.5} y2={0} />
      <g transform={translate(0, yScale.range()[0] - 10)}>
        <polygon points='-3,0 -13,-10 -3,-20' />
        <polygon points='4.5,0 14.5,-10 4.5,-20' />
        <text y='20'>{label}</text>
      </g>
    </g>
  )
}

export default inject('rootStore')(observer(Brush))
