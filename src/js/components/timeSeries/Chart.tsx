import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { reaction, IReactionDisposer } from 'mobx'
import { Modes } from '@app/constants'
import RootStore from '@app/models/RootStore'
import NDVI from '@app/components/timeSeries/NDVI'
import NDVISorted from '@app/components/timeSeries/NDVISorted'
import NDVIAnomaly from '@app/components/timeSeries/NDVIAnomaly'
import NDVIAnomalySorted from '@app/components/timeSeries/NDVIAnomalySorted'

class Chart extends React.Component<{
  width: number,
  height: number,
  mouseTarget: EventTarget,
  touchTarget: EventTarget,
  dragging: boolean,
  panning: boolean,
  startDragging: (e: MouseEvent) => void,
  rootStore?: RootStore,
}> {
  dragReactionDisposer: IReactionDisposer
  panReactionDisposer: IReactionDisposer
  chart: SVGElement

  margin = {
    top: 25,
    bottom: 40,
    left: 60,
    right: 10,
  }

  componentDidMount () {
    this.dragReactionDisposer = reaction(() => ({
      target: this.props.mouseTarget,
    }), () => {
      if (this.props.dragging) {
        this.handleBrushMove(this.props.mouseTarget)
      }
    })

    this.panReactionDisposer = reaction(() => ({
      target: this.props.touchTarget,
    }), () => {
      if (this.props.panning) {
        this.handleBrushMove(this.props.touchTarget)
      }
    })
  }

  handleBrushMove (target: any) {
    if (
      target !== undefined &&
      target.getAttribute !== undefined
    ) {
      const timePeriod = parseInt(target.getAttribute('data-time-period'), 10)

      if (!isNaN(timePeriod)) {
        this.props.rootStore.timePeriod = timePeriod
      }
    }
  }

  render () {
    const {
      width,
      height,
      rootStore,
    } = this.props

    const onTimePeriodSelect = (i: number, isClick: boolean) => {
      if (this.props.dragging === true || isClick) {
        this.props.rootStore.timePeriod = i
      }
    }

    let ContainerComponent
    switch (rootStore.mode) {
      case Modes.NDVI:
        ContainerComponent = NDVI
        break
      case Modes.NDVI_GROUPED:
        ContainerComponent = NDVISorted
        break
      case Modes.NDVI_ANOMALY:
        ContainerComponent = NDVIAnomaly
        break
      case Modes.NDVI_ANOMALY_GROUPED:
        ContainerComponent = NDVIAnomalySorted
        break
    }

    return (width && height) ? (
      <svg className='time-series' ref={ref => this.chart = ref}
        onMouseDown={(e) => {
          this.props.startDragging(e.nativeEvent)
        }}>
        <ContainerComponent
          width={width}
          height={height}
          onTimePeriodSelect={onTimePeriodSelect}
          margin={this.margin} />
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(Chart))
