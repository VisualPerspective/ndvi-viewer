import { observable, computed } from 'mobx'
import { fromArrayBuffer } from 'geotiff'
import constants from '../constants'
import DataTiff from './DataTiff'

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

  readonly dataTiffs = observable<DataTiff>([])

  @computed get rasterWidth () {
    return this.dataTiffs[0].image.getWidth()
  }

  @computed get rasterHeight () {
    return this.dataTiffs[0].image.getHeight()
  }

  @computed get textureRastersWide () {
    return Math.floor(constants.DATA_TEXTURE_SIZE / this.rasterWidth)
  }

  @computed get textureRastersHigh () {
    return Math.floor(constants.DATA_TEXTURE_SIZE / this.rasterHeight)
  }

  constructor () {
    this.initialize()
  }

  async initialize () {
    this.dataTiffs.replace([
      await DataTiff.fromUrl(require('../../assets/iceland_year.tif'))
    ])

    this.initialized = true
  }

  @computed get timePeriods () {
    return this.dataTiffs[0].rasters.length * 4
  }
}

export default RootStore
