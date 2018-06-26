import * as REGL from 'regl'
import { observable, computed } from 'mobx'
import constants from '@app/constants'
import Point from '@app/models/Point'
import BoundingBox from '@app/models/BoundingBox'
import * as Viewport from 'viewport-mercator-project'

const ZOOM_FACTOR = 0.5

class Camera {
  @observable size: Point
  @observable fitToBoundingBox: BoundingBox
  @observable pitch = 0
  @observable bearing = 0
  @observable altitude = 1.5
  @observable zoom = 0

  constructor ({ size, fitToBoundingBox }: {
    size: Point,
    fitToBoundingBox: BoundingBox
  }) {
    this.size = size
    this.fitToBoundingBox = fitToBoundingBox
  }

  @computed get renderInfo (): {
    scale: number
    view: REGL.Mat4
    projection: REGL.Mat4
  } {
    const lngLatZoom = Viewport.fitBounds({
      width: this.size.x,
      height: this.size.y,
      padding: 100,
      bounds: [
        this.fitToBoundingBox.min.array,
        this.fitToBoundingBox.max.array,
      ],
    })

    const mercator = new Viewport.WebMercatorViewport({
      pitch: this.pitch,
      bearing: this.bearing,
      altitude: this.altitude,
      ...lngLatZoom,
      zoom: lngLatZoom.zoom * (1 + (this.zoom * ZOOM_FACTOR)),
      width: this.size.x,
      height: this.size.y,
    })

    return {
      scale: mercator.scale * constants.TILE_SIZE,
      view: mercator.viewMatrix,
      projection: mercator.projectionMatrix,
    }
  }
}

export default Camera
