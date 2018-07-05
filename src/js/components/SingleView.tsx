import * as React from 'react'
import { reaction, IReactionDisposer } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import Zoom from '@app/components/Zoom'
import Point from '@app/models/Point'
import RootStore from '@app/models/RootStore'
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

  componentDidMount () {
    this.glManager = new GLManager({
      canvas: this.canvas,
      rootStore: this.props.rootStore,
    })

    this.dragReactionDisposer = reaction(() => ({
      mousePositionX: _.get(this.props.mousePosition, 'x'),
      mousePositionY: _.get(this.props.mousePosition, 'y'),
    }), () => {
      if (this.props.dragging) {
        const canvasRect = this.canvas.getBoundingClientRect()

        const fromPixel = new Point(
          this.props.previousMousePosition.x - canvasRect.left,
          this.props.previousMousePosition.y - canvasRect.top
        )

        const toPixel = new Point(
          this.props.mousePosition.x - canvasRect.left,
          this.props.mousePosition.y - canvasRect.top
        )

        this.props.rootStore.camera.moveByPixels(fromPixel, toPixel)
      }
    })
  }

  componentWillUnmount () {
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
          onMouseDown={() => { this.props.startDragging() }} />
        <Zoom />
      </>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
