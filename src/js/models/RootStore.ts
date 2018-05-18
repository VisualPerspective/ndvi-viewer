import { observable } from 'mobx'
import { parse } from 'geotiff'

class RootStore {
  @observable initialized: boolean = false
  ndviTiff: any

  constructor () {
    this.initialize()
  }

  async initialize () {
    const data: Response = await window.fetch(
      require('../../assets/iceland.tif')
    )

    this.ndviTiff = parse(await data.arrayBuffer())
    {(window as any).zzz = this.ndviTiff}

    this.initialized = true
  }
}

export default RootStore
