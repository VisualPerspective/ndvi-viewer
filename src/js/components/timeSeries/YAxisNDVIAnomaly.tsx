import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import { format, interpolateNumber } from 'd3'
import * as _ from 'lodash'
import { translate } from '@app/utils'

const YAxisNDVIAnomaly = ({ xScale, yScale, colorScale, rootStore }: {
  xScale: any,
  yScale: any,
  colorScale: any,
  rootStore?: RootStore,
}) => {
  const leftScaleWidth = 7
  const numStops = 10
  const stops = _.times(numStops, i => ({
    color: colorScale(interpolateNumber(
      ...rootStore.modeConfig.CHART_RANGE,
    )(i / (numStops - 1))),
    percent: i / (numStops - 1) * 100,
  }))

  const formatter = format('.1f')

  return (
    <g className='axis y-axis'>
      <defs>
        <linearGradient id='grad1' x1='0%' y1='100%' x2='0%' y2='0%'>
          {
            stops.map(stop => (
              <stop key={stop.percent}
                offset={`${stop.percent}%`}
                style={{
                  stopColor: stop.color,
                  stopOpacity: 1,
                }} />
            ))
          }
        </linearGradient>
      </defs>
      <rect x={xScale.range()[0] - leftScaleWidth}
        y={yScale.range()[1]}
        width={leftScaleWidth}
        height={yScale.range()[0] - yScale.range()[1]}
        fill='url(#grad1)' />
      {
        rootStore.modeConfig.Y_TICKS.map((tick, i) => (
          <g key={i} className='tick y-tick'
            transform={translate(
              xScale.range()[0] - leftScaleWidth,
              yScale.range()[0] -
              (i / (rootStore.modeConfig.Y_TICKS.length - 1)) *
              (yScale.range()[0] - yScale.range()[1]),
            )}>
            <line x1={leftScaleWidth} y1='0.5'
              x2={(xScale.range()[1] - xScale.range()[0]) + leftScaleWidth}
              y2='0.5' />
            <line x1='0' y1='0.5' className={
              i > 0 && i < rootStore.modeConfig.Y_TICKS.length - 1 ? 'white' : ''
            }
              x2={leftScaleWidth}
              y2='0.5' />
            <text dy='6' x='-8' y='0'>{formatter(tick)}</text>
          </g>
        ))
      }
    </g>
  )
}

export default inject('rootStore')(observer(YAxisNDVIAnomaly))
