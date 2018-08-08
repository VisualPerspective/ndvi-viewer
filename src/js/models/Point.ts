import { observable, computed, action } from 'mobx'
import * as _ from 'lodash'
import BoundingBox from '@app/models/BoundingBox'

class Point {
  @observable _x: number
  @observable _y: number
  @observable boundingBoxConstraint: BoundingBox

  constructor (x: number, y: number) {
    this.set(x, y)
  }

  @computed get x () { return this._x }
  set x (value: number) {
    if (this.boundingBoxConstraint !== undefined) {
      this._x = _.clamp(
        value,
        this.boundingBoxConstraint.min.x,
        this.boundingBoxConstraint.max.x
      )
    } else {
      this._x = value
    }
  }

  @computed get y () { return this._y }
  set y (value: number) {
    if (this.boundingBoxConstraint !== undefined) {
      this._y = _.clamp(
        value,
        this.boundingBoxConstraint.min.y,
        this.boundingBoxConstraint.max.y
      )
    } else {
      this._y = value
    }
  }

  @action set (x: number, y: number) {
    this.x = x
    this.y = y
  }

  @computed get array () {
    return [this.x, this.y]
  }

  distanceTo (other: Point) {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) +
      Math.pow(this.y - other.y, 2)
    )
  }

  static fromArray (array: number[]): Point {
    return new Point(array[0], array[1])
  }
}

export default Point
