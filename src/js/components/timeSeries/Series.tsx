import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'
import * as _ from 'lodash'

const Series = ({ width, height, margin, yScale, rootStore }: {
  width: number,
  height: number,
  margin: any,
  yScale: any,
  rootStore?: RootStore,
}) => (
  <g className='series'>
    {
      _.times(rootStore.timePeriods, i => (
        <g key={i} className='average'
          transform={translate(
            i / (rootStore.timePeriods - 1) *
            (width - (margin.left + margin.right)) +
            margin.left,
            yScale(rootStore.timePeriodAverages[i])
          )}>
          <circle r={5}cx={0} cy={0} />
        </g>
      ))
    }
  </g>
)

export default inject('rootStore')(observer(Series))