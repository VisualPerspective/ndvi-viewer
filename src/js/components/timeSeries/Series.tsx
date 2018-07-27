import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'
import * as _ from 'lodash'

const Series = ({
  xScale,
  yScale,
  colorScale,
  onTimePeriodSelect,
  marginBottom,
  rootStore,
}: {
  xScale: any,
  yScale: any,
  colorScale: any,
  onTimePeriodSelect: any,
  marginBottom: number,
  rootStore?: RootStore,
}) => (
  <g className='series'>
    {
      _.times(rootStore.timePeriods, i => (
        rootStore.sortedTimePeriodAverages[i] !== undefined && (
          <g key={i}>
            <g className='average'
              transform={translate(
                xScale(i),
                yScale(rootStore.sortedTimePeriodAverages[i])
              )}>
              <circle r={_.clamp(xScale.step() * 0.75, 3, 5)} cx={0} cy={0}
                fill={colorScale(rootStore.sortedTimePeriodAverages[i])} />
            </g>
            <rect
              className="mouse-target"
              x={xScale(i) + xScale.step() * -0.5}
              y={yScale.range()[1]}
              width={xScale.step()}
              height={yScale.range()[0] - yScale.range()[1] + marginBottom}
              onClick={() => {
                onTimePeriodSelect(rootStore.sortedTimePeriodIndices[i], true)
              }}
              onMouseEnter={() => {
                onTimePeriodSelect(rootStore.sortedTimePeriodIndices[i])
              }} />
          </g>
        )
      ))
    }
  </g>
)

export default inject('rootStore')(observer(Series))
