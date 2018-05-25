import { observable, computed } from 'mobx'
import { fromArrayBuffer } from 'geotiff'
import constants from '../constants'

class RootStore {
  @observable initialized: boolean = false
  @observable timePeriod: number = 0
  @observable viewport: any = {
    pitch: 0,
    bearing: 0,
    altitude: 1.5,
    zoom: 0,
    latitude: 0,
    longitude: 0
  }

  ndviTiff: any
  ndviImage: any
  ndviRasters: any
  ndviWidth: any
  ndviHeight: any
  imagesWide: number
  imagesHigh: number

  constructor () {
    this.initialize()
  }

  async initialize () {
    const data: Response = await window.fetch(
      require('../../assets/iceland_year.tif')
    )

    this.ndviTiff = await fromArrayBuffer(await data.arrayBuffer())
    this.ndviImage = await this.ndviTiff.getImage()
    this.ndviWidth = this.ndviImage.getWidth()
    this.ndviHeight = this.ndviImage.getHeight()
    this.imagesWide = Math.floor(
      constants.DATA_TEXTURE_SIZE / this.ndviWidth
    )
    this.imagesHigh = Math.floor(
      constants.DATA_TEXTURE_SIZE / this.ndviWidth
    )

    this.ndviRasters = [
      await this.ndviImage.readRasters({
        interleave: true,
        samples: [0, 1, 2, 3]
      }),
      await this.ndviImage.readRasters({
        interleave: true,
        samples: [4, 5, 6, 7]
      }),
      await this.ndviImage.readRasters({
        interleave: true,
        samples: [8, 9, 10, 11]
      })
    ]

    this.initialized = true
  }

  @computed get timePeriods () {
    return this.ndviRasters.length * 4
  }
}

export default RootStore
