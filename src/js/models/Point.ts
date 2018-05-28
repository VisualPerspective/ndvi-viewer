import { observable } from 'mobx'

class Point {
  @observable x: number
  @observable y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export default Point
