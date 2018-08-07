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
  startDragging: (e: MouseEvent | TouchEvent) => void,
  pinching: boolean
  pinchScale: number
  panning: boolean
  previousPanPosition: Point
  panPosition: Point
  rootStore?: RootStore
}, any> {
  dragReactionDisposer: IReactionDisposer
  glManager: GLManager
  canvasElement: React.RefObject<any> = React.createRef()

  componentDidMount () {
    this.glManager = new GLManager({
      canvas: (this.canvasElement.current as HTMLCanvasElement),
      rootStore: this.props.rootStore,
    })

    this.dragReactionDisposer = reaction(() => ({
      mousePositionX: _.get(this.props.mousePosition, 'x'),
      mousePositionY: _.get(this.props.mousePosition, 'y'),
    }), () => {
      if (this.props.dragging) {
        this.handleMove(
          this.props.mousePosition,
          this.props.previousMousePosition,
        )
      }
    })

    this.dragReactionDisposer = reaction(() => ({
      panPositionX: _.get(this.props.panPosition, 'x'),
      panPositionY: _.get(this.props.panPosition, 'y'),
    }), () => {
      if (this.props.panning) {
        this.handleMove(
          this.props.panPosition,
          this.props.previousPanPosition,
        )
      }
    })

    window.addEventListener('wheel', this.handleWheel)
  }

  relativePosition (point: Point) {
    const canvasRect = this.canvasElement.current.getBoundingClientRect()
    return new Point(point.x - canvasRect.left, point.y - canvasRect.top)
  }

  handleMove = (position: Point, previousPosition: Point) => {
    if (
      position !== undefined &&
      previousPosition !== undefined
    ) {
      const fromPixel = this.relativePosition(previousPosition)
      const toPixel = this.relativePosition(position)
      const delta = this.props.rootStore.camera.lngLatDelta(fromPixel, toPixel)

      this.props.rootStore.camera.position.set(
        this.props.rootStore.camera.position.x - delta.x,
        this.props.rootStore.camera.position.y - delta.y
      )
    }
  }

  handleWheel = (e: WheelEvent) => {
    let amount = -e.deltaY * 0.001

    // Deal with Firefox mousewheel speed being slower
    if ((e as any).mozInputSource === 1 && e.deltaMode === 1) {
      amount *= 50
    }

    if (e.target === this.canvasElement.current) {
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
          className='full-size'
          ref={this.canvasElement}
          onMouseDown={(e) => {
            this.props.startDragging(e.nativeEvent)
          }}
          />
        <Zoom />
      </>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
