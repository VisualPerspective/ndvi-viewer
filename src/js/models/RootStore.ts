import { observable, computed } from 'mobx'
import constants from '@app/constants'
import DataTiff from '@app/models/DataTiff'
import BoundingBox from '@app/models/BoundingBox'

class RootStore {
  @observable initialized: boolean = false
  @observable timePeriod: number = 0
  @observable viewport: any = {
    pitch: 0,
    bearing: 0,
    altitude: 1.5,
    zoom: 6,
    latitude: 65,
    longitude: -18.5,
  }

  readonly dataTiffs = observable<DataTiff>([])
  readonly boundingBox = observable<BoundingBox>(new BoundingBox())

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
      await DataTiff.fromUrl(constants.TIFF_URLS[0]),
    ])

    this.boundingBox.array = this.dataTiffs[0].image.getBoundingBox()
    this.initialized = true
  }

  @computed get timePeriods () {
    return this.dataTiffs[0].rasters.length * 4
  }

  @computed get rasterSubimages (): {
    width: number,
    height: number,
    x: number,
    y: number,
    data: ArrayBufferView
  }[] {
    return this.dataTiffs[0].rasters.map((raster, i) => {
      const xIndex = i % this.textureRastersWide
      const yIndex = Math.floor(i / this.textureRastersWide)
      return {
        width: this.rasterWidth,
        height: this.rasterHeight,
        data: this.dataTiffs[0].rasters[i],
        x: this.rasterWidth * xIndex,
        y: this.rasterHeight * yIndex,
      }
    })
  }
}

export default RootStore
