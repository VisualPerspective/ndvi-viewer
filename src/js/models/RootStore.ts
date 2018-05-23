import { observable } from 'mobx'
import { fromArrayBuffer } from 'geotiff'

class RootStore {
  @observable initialized: boolean = false
  ndviTiff: any
  ndviImage: any
  ndviRasters: any

  constructor () {
    this.initialize()
  }

  async initialize () {
    const data: Response = await window.fetch(
      require('../../assets/iceland_year.tif')
    )

    this.ndviTiff = await fromArrayBuffer(await data.arrayBuffer())
    this.ndviImage = await this.ndviTiff.getImage()
    this.ndviRasters = await this.ndviImage.readRasters()

    this.initialized = true
  }
}

export default RootStore
