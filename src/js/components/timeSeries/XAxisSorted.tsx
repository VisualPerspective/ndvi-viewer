import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'
import constants from '@app/constants'

const XAxisSorted = ({ xScale, yScale, rootStore }: {
  xScale: any,
  yScale: any,
  rootStore?: RootStore,
}) => (
  <g className='axis x-axis'>
    {
      _.map(constants.MONTHS, (month, i) => (
        <g key={i} className='tick x-tick'
          transform={translate(
            xScale(month),
            yScale.range()[1]
          )}>
          <g transform={translate(
            xScale.bandwidth() / 2 + 3,
            yScale.range()[0] - yScale.range()[1]
          )}>
            <text dx='0' dy='20' x='0' y='0'>{month}</text>
          </g>
          <rect x={xScale.bandwidth() - xScale.step()} y='0'
            height={yScale.range()[0] - yScale.range()[1] + 1}
            width={xScale.step() - xScale.bandwidth()}
            className='divider' />
        </g>
      ))
    }
    <g key='final' className='tick x-tick'
      transform={translate(
        xScale.range()[1],
        yScale.range()[1]
      )}>
      <rect x={xScale.bandwidth() - xScale.step()} y='0'
        height={yScale.range()[0] - yScale.range()[1] + 1}
        width={xScale.step() - xScale.bandwidth()}
        className='divider' />
    </g>
  </g>
)

export default inject('rootStore')(observer(XAxisSorted))
