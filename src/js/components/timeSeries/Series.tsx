import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'
import * as _ from 'lodash'

const Series = ({ xScale, yScale, colorScale, rootStore }: {
  xScale: any,
  yScale: any,
  colorScale: any,
  rootStore?: RootStore,
}) => (
  <g className='series'>
    {
      _.times(rootStore.timePeriods, i => (
        rootStore.sortedAverages[i] !== undefined && (
          <g key={i} className='average'
            transform={translate(
              xScale(i),
              yScale(rootStore.sortedAverages[i])
            )}>
            <circle r={5} cx={0} cy={0}
              fill={colorScale(rootStore.sortedAverages[i])} />
          </g>
        )
      ))
    }
  </g>
)

export default inject('rootStore')(observer(Series))
