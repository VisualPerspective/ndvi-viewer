import * as REGL from 'regl'
import { observable, computed, action } from 'mobx'
import constants from '@app/constants'
import Point from '@app/models/Point'
import BoundingBox from '@app/models/BoundingBox'
import * as Viewport from 'viewport-mercator-project'

const ZOOM_FACTOR = 0.5

class Camera {
  @observable size: Point
  @observable position: Point
  @observable boundingBox: BoundingBox
  @observable pitch = 0
  @observable bearing = 0
  @observable altitude = 1.5
  @observable zoom: number
  pixelsPerDegree: number[]
  viewport: Viewport.WebMercatorViewport

  constructor ({ size, boundingBox }: {
    size: Point,
    boundingBox: BoundingBox
  }) {
    this.size = size
    this.boundingBox = boundingBox

    // tslint:disable-next-line
    console.log(boundingBox.center)

    this.reset()
  }

  reset () {
    this.zoom = 0
    this.position = this.boundingBox.center
  }

  moveByPixels (fromPixel: Point, toPixel: Point) {
    if (this.viewport !== undefined) {
      const fromLngLat = this.viewport.unproject(fromPixel.array)
      const toLngLat = this.viewport.unproject(toPixel.array)

      // tslint:disable-next-line
      console.log(toLngLat)

      this.position.set(
        this.position.x - (toLngLat[0] - fromLngLat[0]),
        this.position.y - (toLngLat[1] - fromLngLat[1]),
      )
    }
  }

  @action calculateViewport () {
    const lngLatZoom = Viewport.fitBounds({
      width: this.size.x,
      height: this.size.y,
      padding: 100,
      bounds: [
        this.boundingBox.min.array,
        this.boundingBox.max.array,
      ],
    })

    this.viewport = new Viewport.WebMercatorViewport({
      pitch: this.pitch,
      bearing: this.bearing,
      altitude: this.altitude,
      longitude: this.position.x,
      latitude: this.position.y,
      zoom: lngLatZoom.zoom * (1 + (this.zoom * ZOOM_FACTOR)),
      width: this.size.x,
      height: this.size.y,
    })
  }

  @computed get renderInfo (): {
    scale: number
    view: REGL.Mat4
    projection: REGL.Mat4
  } {
    this.calculateViewport()

    return {
      scale: this.viewport.scale * constants.TILE_SIZE,
      view: this.viewport.viewMatrix,
      projection: this.viewport.projectionMatrix,
    }
  }
}

export default Camera
