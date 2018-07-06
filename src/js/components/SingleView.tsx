import * as React from 'react'
import { reaction, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import Zoom from '@app/components/Zoom'
import Point from '@app/models/Point'
import RootStore, { PickTypes } from '@app/models/RootStore'
import GLManager from '@app/gl/GLManager'

class SingleView extends React.Component<{
  width: number,
  height: number,
  previousMousePosition: Point,
  mousePosition: Point,
  dragging: boolean,
  startDragging: () => void,
  rootStore?: RootStore
}, any> {
  dragReactionDisposer: IReactionDisposer
  glManager: GLManager
  canvas: HTMLCanvasElement
  dragType: PickTypes

  componentDidMount () {
    this.glManager = new GLManager({
      canvas: this.canvas,
      rootStore: this.props.rootStore,
    })

    this.dragReactionDisposer = reaction(() => ({
      mousePositionX: _.get(this.props.mousePosition, 'x'),
      mousePositionY: _.get(this.props.mousePosition, 'y'),
    }), this.handleMouseMove)

    window.addEventListener('wheel', this.handleWheel)
  }

  relativePosition (point: Point) {
    const canvasRect = this.canvas.getBoundingClientRect()
    return new Point(point.x - canvasRect.left, point.y - canvasRect.top)
  }

  handleMouseMove = () => {
    if (this.props.dragging) {
      const fromPixel = this.relativePosition(this.props.previousMousePosition)
      const toPixel = this.relativePosition(this.props.mousePosition)
      const delta = this.props.rootStore.camera.lngLatDelta(fromPixel, toPixel)

      if (this.dragType === PickTypes.PAN) {
        this.props.rootStore.camera.position.set(
          this.props.rootStore.camera.position.x - delta.x,
          this.props.rootStore.camera.position.y - delta.y
        )
      } else if (this.dragType === PickTypes.MOVE) {
        this.props.rootStore.selectedBox.center = new Point(
          this.props.rootStore.selectedBox.center.x + delta.x,
          this.props.rootStore.selectedBox.center.y + delta.y
        )
      }
    }
  }

  handleWheel = (e: WheelEvent) => {
    const amount = -e.deltaY * 0.001

    if (e.target === this.canvas) {
      this.props.rootStore.camera.zoom += amount
      e.preventDefault()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('wheel', this.handleWheel)
    this.dragReactionDisposer()
  }

  componentDidUpdate () {
    this.glManager.render()
  }

  render () {
    return (
      <>
        <canvas
          ref={canvas => { this.canvas = canvas }}
          onMouseDown={() => {
            const position = this.relativePosition(this.props.mousePosition)
            this.dragType = this.props.rootStore.pick(position)
            this.props.startDragging()
          }} />
        <Zoom />
      </>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
