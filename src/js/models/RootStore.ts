import { observable } from 'mobx'
import { parse } from 'geotiff'

class RootStore {
  @observable initialized: boolean = false
  tiff: any

  constructor () {
    this.initialize()
  }

  async initialize () {
    const data: any = await window.fetch(
      require('../../assets/iceland.tif')
    )

    this.tiff = parse(await data.arrayBuffer())
    this.initialized = true
  }
}

export default RootStore
