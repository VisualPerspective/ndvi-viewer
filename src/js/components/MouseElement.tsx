import * as React from 'react'
import { observer } from 'mobx-react'
import { action, observable } from 'mobx'
import Point from '@app/models/Point'

class MouseElement extends React.Component<{
  render: ({}: {
    dragging: boolean,
    previousMousePosition?: Point,
    mousePosition?: Point,
    mouseTarget?: EventTarget,
    startDragging: (e: MouseEvent | TouchEvent) => void,
  }) => React.ReactElement<any>,
}, any> {
  @observable previousMousePosition: Point
  @observable mousePosition: Point
  @observable mouseTarget: EventTarget
  @observable dragging: boolean

  mouseUpListener = () => {
    this.dragging = false
  }

  touchEndListener = () => {
    this.dragging = false
  }

  @action mouseMoveListener = (e: MouseEvent) => {
    this.moveHandler(e.target, e.pageX, e.pageY)
  }

  @action touchMoveListener = (e: TouchEvent) => {
    const target = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    )

    this.moveHandler(target, e.touches[0].pageX, e.touches[0].pageY)
  }

  moveHandler = (target: EventTarget, x: number, y: number) => {
    this.mouseTarget = target
    if (this.mousePosition !== undefined) {
      this.previousMousePosition.set(
        this.mousePosition.x,
        this.mousePosition.y
      )
      this.mousePosition.set(x, y)
    } else {
      this.previousMousePosition = new Point(x, y)
      this.mousePosition = new Point(x, y)
    }
  }

  @action startDragging (e: TouchEvent | MouseEvent) {
    this.dragging = true
    if (e instanceof TouchEvent) {
      this.mousePosition = undefined
      this.moveHandler(e.currentTarget, e.touches[0].pageX, e.touches[0].pageY)
    }
  }

  componentDidMount () {
    document.addEventListener('mouseup', this.mouseUpListener)
    document.addEventListener('touchend', this.touchEndListener)
    document.addEventListener('mousemove', this.mouseMoveListener)
    document.addEventListener('touchmove', this.touchMoveListener)
  }

  componentWillUnmount () {
    document.removeEventListener('mouseup', this.mouseUpListener)
    document.addEventListener('touchend', this.touchEndListener)
    document.removeEventListener('mousemove', this.mouseMoveListener)
    document.removeEventListener('touchmove', this.touchMoveListener)
  }

  render () {
    return this.props.render({
      dragging: this.dragging,
      previousMousePosition: this.previousMousePosition,
      mousePosition: this.mousePosition,
      mouseTarget: this.mouseTarget,
      startDragging: this.startDragging.bind(this),
    })
  }
}

export default observer(MouseElement)
