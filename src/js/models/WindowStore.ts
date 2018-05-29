import { observable, action } from 'mobx'
import Point from './Point'

class WindowStore {
  @observable size: Point

  constructor () {
    window.addEventListener('resize', () => {
      this.handleResize(window.innerWidth, window.innerHeight)
    })
  }

  @action handleResize (width: number, height: number) {
    this.size = new Point(width, height)
  }
}

export default WindowStore
