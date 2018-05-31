import * as React from 'react'
import { inject, observer } from 'mobx-react'
import constants from '@app/constants'
import { translate } from '@app/utils'

const YAxis = ({ width, height, margin }: {
  width: number,
  height: number,
  margin: any,
}) => (
  <g className='axis y-axis'>
    {
      constants.DATA_Y_TICKS.map((tick, i) => (
        <g key={i} className='tick y-tick'
          transform={translate(
            margin.left - 3,
            (height - margin.bottom) -
            (i / (constants.DATA_Y_TICKS.length - 1)) *
            (height - (margin.top + margin.bottom)),
          )}>
          <text dy='6' x='-10' y='0'>{tick}</text>
          <line x1='-6' y1='0.5' x2={width - margin.left} y2='0.5' />
        </g>
      ))
    }
  </g>
)

export default inject('rootStore')(observer(YAxis))
