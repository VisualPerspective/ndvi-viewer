import * as React from 'react'
import { autorun, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import RootStore from '@app/models/RootStore'
import Point from '@app/models/Point'
import XAxis from '@app/components/timeSeries/XAxis'
import YAxis from '@app/components/timeSeries/YAxis'
import Brush from '@app/components/timeSeries/Brush'

class Chart extends React.Component<{
  width: number,
  height: number,
  mousePosition: Point,
  dragging: boolean,
  startDragging: () => void,
  rootStore?: RootStore,
}> {
  dragReactionDisposer: IReactionDisposer
  chart: SVGElement

  componentDidMount () {
    this.dragReactionDisposer = autorun(() => {
      if (this.props.dragging === true) {
        const rect = this.chart.getBoundingClientRect()
        const x = this.props.mousePosition.x - rect.left
        const timePeriods = this.props.rootStore.timePeriods

        this.props.rootStore.timePeriod = _.clamp(
          Math.floor(timePeriods * x / rect.width),
          0,
          timePeriods - 1,
        )
      }
    })
  }

  componentWillUnmount () {
    this.dragReactionDisposer()
  }

  render () {
    const {
      width,
      height,
      rootStore,
    } = this.props

    const margin = {
      top: 45,
      bottom: 33,
      left: 45,
      right: 45,
    }

    return (width && height) ? (
      <svg className='time-series' ref={ref => this.chart = ref}
        onMouseDown={() => this.props.startDragging()}>
        <YAxis width={width} height={height} margin={margin} />
        <XAxis width={width} height={height} margin={margin} rootStore={rootStore} />
        <Brush width={width} height={height} margin={margin} />
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(Chart))
