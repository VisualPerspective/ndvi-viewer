import { observable, computed } from 'mobx'
import * as _ from 'lodash'
import { sinusoidalToLngLat } from '@app/utils'
import Point from '@app/models/Point'

class BoundingBox {
  @observable min: Point
  @observable max: Point

  constructor ({ min, max }: { min: Point, max: Point } = {
    min: new Point(0, 0),
    max: new Point(0, 0),
  }) {
    this.min = min
    this.max = max
  }

  @computed get triangles (): any {
    return [
      [this.min.x, this.min.y],
      [this.max.x, this.min.y],
      [this.max.x, this.max.y],
      [this.min.x, this.min.y],
      [this.max.x, this.max.y],
      [this.min.x, this.max.y],
    ]
  }

  @computed get array (): number[] {
    return [
      this.min.x,
      this.min.y,
      this.max.x,
      this.max.y,
    ]
  }

  set array (bbox: number[]) {
    this.min = new Point(bbox[0], bbox[1])
    this.max = new Point(bbox[2], bbox[3])
  }

  get lngLatFromSinusoidal (): BoundingBox {
    const points = [
      sinusoidalToLngLat({ x: this.min.x, y: this.min.y }),
      sinusoidalToLngLat({ x: this.max.x, y: this.min.y }),
      sinusoidalToLngLat({ x: this.min.x, y: this.max.y }),
      sinusoidalToLngLat({ x: this.max.x, y: this.max.y }),
    ]

    return new BoundingBox({
      min: new Point(_.minBy(points, 'x').x, _.minBy(points, 'y').y),
      max: new Point(_.maxBy(points, 'x').x, _.maxBy(points, 'y').y),
    })
  }
}

export default BoundingBox
