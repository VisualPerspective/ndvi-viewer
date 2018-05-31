import { observable, computed, set } from 'mobx'
import * as _ from 'lodash'
import { sinusoidalToLngLat } from '@app/utils'
import Point from '@app/models/Point'

class BoundingBox {
  @observable min: Point = new Point(0, 0)
  @observable max: Point = new Point(0, 0)

  @computed get lngLatBoundingBox (): any {
    const points = [
      sinusoidalToLngLat({ x: this.min.x, y: this.min.y }),
      sinusoidalToLngLat({ x: this.max.x, y: this.min.y }),
      sinusoidalToLngLat({ x: this.min.x, y: this.max.y }),
      sinusoidalToLngLat({ x: this.max.x, y: this.max.y }),
    ]

    return {
      min: { x: _.minBy(points, 'x').x, y: _.minBy(points, 'y').y },
      max: { x: _.maxBy(points, 'x').x, y: _.maxBy(points, 'y').y },
    }
  }

  @computed get triangles (): any {
    const bbox: any = this.lngLatBoundingBox

    return [
      [bbox.min.x, bbox.min.y],
      [bbox.max.x, bbox.min.y],
      [bbox.max.x, bbox.max.y],
      [bbox.min.x, bbox.min.y],
      [bbox.max.x, bbox.max.y],
      [bbox.min.x, bbox.max.y],
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
}

export default BoundingBox
