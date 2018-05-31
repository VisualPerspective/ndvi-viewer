import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action, observable, reaction, IReactionDisposer } from 'mobx'
import Point from '@app/models/Point'

class MouseElement extends React.Component<{
  render: ({}: {
    dragging: boolean,
    mousePosition?: Point,
    startDragging: () => void,
  }) => React.ReactElement<any>,
}, any> {
  @observable mousePosition: Point = new Point(0, 0)
  @observable dragging: boolean

  mouseUpListener = () => {
    this.dragging = false
  }

  mouseMoveListener = (e: MouseEvent) => {
    this.mousePosition.set(e.screenX, e.screenY)
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
      mousePosition: this.mousePosition,
      startDragging: this.startDragging.bind(this),
    })
  }
}

export default observer(MouseElement)
