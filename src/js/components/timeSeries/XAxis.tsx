import * as React from 'react'
import { observable, autorun, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import constants, { strings } from '@app/constants'
import * as _ from 'lodash'
import RootStore from '@app/models/RootStore'
import Point from '@app/models/Point'
import { translate } from '@app/utils'

const XAxis = ({
  width: number,
  margin: any,
  mousePosition: Point,
  rootStore?: RootStore,
}) => (
  <g className="axis x-axis">
    {
      _.times(rootStore.timePeriods, i => (
        <g key={i} className="tick x-tick"
          transform={translate(
            i / (rootStore.timePeriods - 1) *
            (width - (margin.left + margin.right)) +
            margin.left,
            margin.top
          )}>
          <text dy="-6" x="0" y="0">{i}</text>
          <line x1="0.5" y1="0" x2="0" y2="-5" />
        </g>
      ))
    }
  </g>
)

export default inject('rootStore')(observer(XAxis))
