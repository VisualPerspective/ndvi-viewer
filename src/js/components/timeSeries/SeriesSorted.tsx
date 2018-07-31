import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import { translate } from '@app/utils'
import * as _ from 'lodash'

const SeriesSorted = ({
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
      _.times(rootStore.numTimePeriods, i => {
        const period = rootStore.timePeriodsByMonth[i]

        return (
          <g key={i}>
            {
              period.average !== undefined && (
                <g className='average'
                  transform={translate(
                    xScale(period.id),
                    yScale(period.average)
                  )}>
                  <circle r={_.clamp(xScale.step() * 0.75, 3.5, 5)} cx={0} cy={0}
                    fill={colorScale(period.average)} />
                </g>
              )
            }
            <rect
              className='mouse-target'
              x={xScale(period.id) + xScale.step() * -0.5}
              y={yScale.range()[1]}
              width={xScale.step()}
              height={yScale.range()[0] - yScale.range()[1] + marginBottom}
              onClick={() => {
                onTimePeriodSelect(period.id, true)
              }}
              onMouseEnter={() => {
                onTimePeriodSelect(period.id)
              }} />
          </g>
        )
      })
    }
  </g>
)

export default inject('rootStore')(observer(SeriesSorted))
