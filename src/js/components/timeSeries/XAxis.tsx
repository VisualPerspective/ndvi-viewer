import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'
import constants from '@app/constants'

const XAxis = ({ width, height, margin, rootStore }: {
  width: number,
  height: number,
  margin: any,
  rootStore?: RootStore,
}) => (
  <g className='axis x-axis'>
    {
      _.times(rootStore.timePeriods / 12, i => (
        <g key={i} className='tick x-tick'
          transform={translate(
            (i * 12) / (rootStore.timePeriods - 1) *
            (width - (margin.left + margin.right)) +
            margin.left,
            margin.top
          )}>
          <text dx='6' dy='-6' x='0' y='0'>{constants.START_YEAR + i}</text>
          <line x1='0.5' y1={1 + height - (margin.bottom + margin.top)}
            x2='0' y2='-5' />
        </g>
      ))
    }
  </g>
)

export default inject('rootStore')(observer(XAxis))
