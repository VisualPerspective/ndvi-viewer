import { observable, computed, action } from 'mobx'

class Point {
  @observable x: number
  @observable y: number

  constructor (x: number, y: number) {
    this.set(x, y)
  }

  @action set (x: number, y: number) {
    this.x = x
    this.y = y
  }

  @computed get array () {
    return [this.x, this.y]
  }
}

export default Point
