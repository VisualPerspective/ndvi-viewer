import * as React from 'react'
import { observer } from 'mobx-react'
import { action, observable } from 'mobx'
import Point from '@app/models/Point'

class MouseElement extends React.Component<{
  render: ({}: {
    dragging: boolean,
    previousMousePosition?: Point,
    mousePosition?: Point,
    startDragging: () => void,
  }) => React.ReactElement<any>,
}, any> {
  @observable mousePosition: Point
  @observable previousMousePosition: Point
  @observable dragging: boolean

  mouseUpListener = () => {
    this.dragging = false
  }

  @action mouseMoveListener = (e: MouseEvent) => {
    if (this.mousePosition !== undefined) {
      this.previousMousePosition.set(
        this.mousePosition.x,
        this.mousePosition.y
      )
      this.mousePosition.set(e.pageX, e.pageY)
    } else {
      this.previousMousePosition = new Point(e.pageX, e.pageY)
      this.mousePosition = new Point(e.pageX, e.pageY)
    }
  }

  startDragging () {
    this.dragging = true
  }

  componentDidMount () {
    document.addEventListener('mouseup', this.mouseUpListener)
    document.addEventListener('mousemove', this.mouseMoveListener)
  }

  componentWillUnmount () {
    document.removeEventListener('mouseup', this.mouseUpListener)
    document.removeEventListener('mousemove', this.mouseMoveListener)
  }

  render () {
    return this.props.render({
      dragging: this.dragging,
      previousMousePosition: this.previousMousePosition,
      mousePosition: this.mousePosition,
      startDragging: this.startDragging.bind(this),
    })
  }
}

export default observer(MouseElement)
