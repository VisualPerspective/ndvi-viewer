import { observable, computed, set } from 'mobx'
import { fromArrayBuffer } from 'geotiff'
import constants from '../constants'
import { sinusoidalToLngLat } from '../utils'
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
  readonly boundingBox = observable<{ min: any, max: any }>({
    min: null,
    max: null
  })

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

  @computed get lngLatBoundingBox (): any {
    return {
      min: sinusoidalToLngLat(this.boundingBox.min),
      max: sinusoidalToLngLat(this.boundingBox.max)
    }
  }

  constructor () {
    this.initialize()
  }

  async initialize () {
    this.dataTiffs.replace([
      await DataTiff.fromUrl(constants.TIFF_URLS[0])
    ])

    this.initialized = true
    const bbox = this.dataTiffs[0].image.getBoundingBox()
    set(this.boundingBox, {
      min: { x: bbox[0], y: bbox[1] },
      max: { x: bbox[2], y: bbox[3] },
    })

    console.log(this.boundingBox)
  }

  @computed get timePeriods () {
    return this.dataTiffs[0].rasters.length * 4
  }
}

export default RootStore
