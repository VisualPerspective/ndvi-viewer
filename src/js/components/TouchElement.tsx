import * as React from 'react'
import { observer } from 'mobx-react'
import { action, observable } from 'mobx'
import Point from '@app/models/Point'

class TouchElement extends React.Component<{
  pinchHandler?: (ratio: number) => void,
  render: ({}: {
    pinching?: boolean,
    pinchScale?: number,
    panning: boolean,
    panPosition: Point,
    previousPanPosition: Point,
    touchTarget: EventTarget,
  }) => React.ReactElement<any>,
}, any> {
  @observable panning: boolean
  @observable pinching: boolean
  @observable pinchScale: number
  @observable previousDistance: number
  @observable touchTarget: EventTarget
  panPosition: Point
  previousPanPosition: Point
  pinchElement: React.RefObject<any> = React.createRef()

  pinchDistance (e: TouchEvent) {
    const from = new Point(e.touches[0].pageX, e.touches[0].pageY)
    const to = new Point(e.touches[1].pageX, e.touches[1].pageY)
    return from.distanceTo(to)
  }

  @action touchesChangeListener = (e: TouchEvent) => {
    e.preventDefault()
    this.touchTarget = e.target

    const wasPinching = this.pinching
    this.pinching = (e.touches.length === 2)

    if (!wasPinching && this.pinching) {
      this.previousDistance = this.pinchDistance(e)
    }

    const wasPanning = this.panning
    this.panning = (e.touches.length === 1)

    if (!wasPanning && this.panning) {
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      this.previousPanPosition = new Point(x, y)
      this.panPosition = new Point(x, y)
    }
  }

  @action touchMoveListener = (e: TouchEvent) => {
    e.preventDefault()
    if (this.pinching) {
      const newDistance = this.pinchDistance(e)
      if (this.props.pinchHandler !== undefined) {
        this.props.pinchHandler(newDistance / this.previousDistance)
      }
      this.previousDistance = newDistance
    } else if (this.panning) {
      const target = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      )

      this.moveHandler(target, e.touches[0].pageX, e.touches[0].pageY)
    }
  }

  moveHandler = (target: EventTarget, x: number, y: number) => {
    this.touchTarget = target
    if (this.panPosition !== undefined) {
      this.previousPanPosition.set(
        this.panPosition.x,
        this.panPosition.y
      )
      this.panPosition.set(x, y)
    } else {
      this.previousPanPosition = new Point(x, y)
      this.panPosition = new Point(x, y)
    }
  }

  componentDidMount () {
    const el = this.pinchElement.current
    el.addEventListener('touchstart', this.touchesChangeListener)
    el.addEventListener('touchend', this.touchesChangeListener)
    el.addEventListener('touchmove', this.touchMoveListener)
  }

  componentWillUnmount () {
    const el = this.pinchElement.current
    el.removeEventListener('touchstart', this.touchesChangeListener)
    el.removeEventListener('touchend', this.touchesChangeListener)
    el.addEventListener('touchmove', this.touchMoveListener)
  }

  render () {
    return (
      <div className='full-width' ref={this.pinchElement}>
        {
          this.props.render({
            pinching: this.pinching,
            pinchScale: this.pinchScale,
            panning: this.panning,
            panPosition: this.panPosition,
            previousPanPosition: this.previousPanPosition,
            touchTarget: this.touchTarget,
          })
        }
      </div>
    )
  }
}

export default observer(TouchElement)
