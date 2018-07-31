import * as REGL from 'regl'
import * as _ from 'lodash'
import { interpolateNumber } from 'd3'
import { observable, computed } from 'mobx'
import constants from '@app/constants'
import Point from '@app/models/Point'
import BoundingBox from '@app/models/BoundingBox'
import * as Viewport from 'viewport-mercator-project'

class Camera {
  @observable size: Point
  @observable position: Point
  @observable boundingBox: BoundingBox
  @observable pitch = 0
  @observable bearing = 0
  @observable altitude = 1.5
  @observable _zoom: number

  constructor ({ size, boundingBox }: {
    size: Point,
    boundingBox: BoundingBox
  }) {
    this.size = size
    this.boundingBox = boundingBox
    this.reset()
  }

  @computed get zoom () { return this._zoom }
  set zoom (value: number) {
    this._zoom = _.clamp(value, 0, 1)
  }

  reset () {
    this.zoom = 0
    this.position = this.boundingBox.center
  }

  pixelToLngLat (pixel: Point) {
    return Point.fromArray(this.viewport.unproject(pixel.array))
  }

  lngLatDelta (fromPixel: Point, toPixel: Point) {
    const fromLngLat = this.pixelToLngLat(fromPixel)
    const toLngLat = this.pixelToLngLat(toPixel)

    return new Point(toLngLat.x - fromLngLat.x, toLngLat.y - fromLngLat.y)
  }

  @computed get viewport (): Viewport.WebMercatorViewport {
    const lngLatZoom = Viewport.fitBounds({
      width: this.size.x,
      height: this.size.y,
      padding: 25,
      bounds: [
        this.boundingBox.min.array,
        this.boundingBox.max.array,
      ],
    })

    // Attempt to set a max zoom which contains a reasonable number
    // of data pixels, regardless of window size
    const maxZoom = Math.log2(Math.min(this.size.x, this.size.y) * 2)

    return new Viewport.WebMercatorViewport({
      pitch: this.pitch,
      bearing: this.bearing,
      altitude: this.altitude,
      longitude: this.position.x,
      latitude: this.position.y,
      zoom: interpolateNumber(lngLatZoom.zoom, maxZoom)(this.zoom),
      width: this.size.x,
      height: this.size.y,
    })
  }

  @computed get renderInfo (): {
    scale: number
    view: REGL.Mat4
    projection: REGL.Mat4
  } {
    return {
      scale: this.viewport.scale * constants.TILE_SIZE,
      view: this.viewport.viewMatrix,
      projection: this.viewport.projectionMatrix,
    }
  }
}

export default Camera
