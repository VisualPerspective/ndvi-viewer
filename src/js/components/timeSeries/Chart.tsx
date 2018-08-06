import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { reaction, IReactionDisposer } from 'mobx'
import { scaleLinear, scalePoint, scaleSequential, scaleBand, range } from 'd3'
import { interpolateViridis } from 'd3-scale-chromatic'
import constants from '@app/constants'
import RootStore, { Modes } from '@app/models/RootStore'
import Point from '@app/models/Point'
import Container from '@app/components/timeSeries/Container'
import ContainerSorted from '@app/components/timeSeries/ContainerSorted'

class Chart extends React.Component<{
  width: number,
  height: number,
  mousePosition: Point,
  mouseTarget: EventTarget,
  dragging: boolean,
  startDragging: (e: MouseEvent | TouchEvent) => void,
  rootStore?: RootStore,
}> {
  dragReactionDisposer: IReactionDisposer
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
    }), this.handleMouseMove.bind(this))
  }

  handleMouseMove () {
    if (
      this.props.dragging &&
      this.props.mouseTarget !== undefined &&
      (this.props.mouseTarget as any).getAttribute !== undefined
    ) {
      const target = (this.props.mouseTarget as any)
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

    const yScale = scaleLinear()
      .domain([-0.2, 1.0])
      .range([
        height - this.margin.bottom,
        this.margin.top,
      ])

    const xScale = scalePoint()
      .domain(range(-2, rootStore.numTimePeriods))
      .range([
        this.margin.left,
        width - this.margin.right,
      ])

    const xScaleSortedBands = scaleBand()
      .domain(constants.MONTHS)
      .range([this.margin.left, width - this.margin.right])
      .padding(0.15)

    const xScaleSorted: any = (i: number) => {
      const n = rootStore.numTimePeriods
      const month = i % 12
      const year = Math.floor(i / 12)
      const years = Math.floor(n / 12)

      return xScaleSortedBands(constants.MONTHS[month]) +
        (xScaleSortedBands.bandwidth() * (year) / (years - 1))
    }

    xScaleSorted.step = () => (
      xScaleSortedBands.bandwidth() /
      (rootStore.numTimePeriods / 12)
    )

    const colorScale = scaleSequential(interpolateViridis)
      .domain([-0.2, 1.0])

    const onTimePeriodSelect = (i: number, isClick: boolean) => {
      if (this.props.dragging === true || isClick) {
        this.props.rootStore.timePeriod = i
      }
    }

    return (width && height) ? (
      <svg className='time-series' ref={ref => this.chart = ref}
        onMouseDown={(e) => {
          this.props.startDragging(e.nativeEvent)
        }}
        onTouchStart={(e) => {
          this.props.startDragging(e.nativeEvent)
        }}>
        {
          rootStore.mode === Modes.NDVI ? (
            <Container
              xScale={xScale}
              yScale={yScale}
              colorScale={colorScale}
              onTimePeriodSelect={onTimePeriodSelect}
              marginBottom={this.margin.bottom} />
          ) : (
            <ContainerSorted
              xScale={xScaleSorted}
              xScaleSortedBands={xScaleSortedBands}
              yScale={yScale}
              colorScale={colorScale}
              onTimePeriodSelect={onTimePeriodSelect}
              marginBottom={this.margin.bottom} />
          )
        }
      </svg>
    ) : null
  }
}

export default inject('rootStore')(observer(Chart))
