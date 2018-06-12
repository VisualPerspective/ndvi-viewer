import * as React from 'react'
import { inject, observer } from 'mobx-react'
import constants from '@app/constants'
import * as _ from 'lodash'
import { translate } from '@app/utils'

const YAxis = ({ width, height, margin, colorScale }: {
  width: number,
  height: number,
  margin: any,
  colorScale: any,
}) => {
  const leftScaleWidth = 8

  const numStops = 10
  const stops = _.times(numStops, i => ({
    color: colorScale((i / (numStops - 1)) * 1.2 - 0.2),
    percent: i / (numStops - 1) * 100,
  }))

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
      <rect x={margin.left - leftScaleWidth} y={margin.top} width={leftScaleWidth}
        height={height - (margin.top + margin.bottom)}
        fill='url(#grad1)' />
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
            <line x1={-leftScaleWidth} y1='0.5'
              x2={width - (margin.left + margin.right) + 3} y2='0.5' />
          </g>
        ))
      }
    </g>
  )
}

export default inject('rootStore')(observer(YAxis))
