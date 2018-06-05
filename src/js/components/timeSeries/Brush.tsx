import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'

const Brush = ({ width, height, margin, rootStore }: {
  width: number,
  height: number,
  margin: any,
  rootStore?: RootStore,
}) => {
  const brushPosition = rootStore.timePeriod /
    (rootStore.timePeriods - 1) * (width - (margin.left + margin.right))
    + margin.left

  return (
    <g transform={translate(brushPosition, margin.top)} className='brush'>
      <line x1={0.5} y1={height - margin.top} x2={0.5} y2={0} />
      <g transform={translate(0, height - margin.top - 3)}>
        <polygon points='-3,0 -13,-10 -3,-20' />
        <polygon points='4.5,0 14.5,-10 4.5,-20' />
      </g>
    </g>
  )
}

export default inject('rootStore')(observer(Brush))
