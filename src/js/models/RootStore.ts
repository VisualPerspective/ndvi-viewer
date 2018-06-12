import { observable, computed } from 'mobx'
import constants from '@app/constants'
import * as _ from 'lodash'
import DataTiff from '@app/models/DataTiff'
import BoundingBox from '@app/models/BoundingBox'
import Point from '@app/models/Point'
import * as Viewport from 'viewport-mercator-project'

class RootStore {
  @observable initialized: boolean = false
  @observable dataTiffsLoaded: number = 0
  @observable timePeriod: number = 0
  @observable viewport: any = {
    pitch: 0,
    bearing: 0,
    altitude: 1.5,
    zoom: 6,
    latitude: 65,
    longitude: -18.5,
  }

  readonly timePeriodAverages = observable<number>([])
  readonly dataTiffs = observable<DataTiff>([])
  readonly boundingBox = observable<BoundingBox>(new BoundingBox())

  @computed get percentLoaded () {
    return this.dataTiffsLoaded / constants.TIFF_URLS.length * 100
  }

  @computed get rasterWidth () {
    return this.dataTiffs[0].image.getWidth()
  }

  @computed get rasterHeight () {
    return this.dataTiffs[0].image.getHeight()
  }

  @computed get rasterSizePercent () {
    return new Point(
      this.rasterWidth / constants.DATA_TEXTURE_SIZE,
      this.rasterHeight / constants.DATA_TEXTURE_SIZE
    )
  }

  @computed get textureRastersWide () {
    return Math.floor(constants.DATA_TEXTURE_SIZE / this.rasterWidth)
  }

  @computed get textureRastersHigh () {
    return Math.floor(constants.DATA_TEXTURE_SIZE / this.rasterHeight)
  }

  @computed get samplesWide () {
    return this.textureRastersWide * 4
  }

  constructor () {
    this.initialize()
  }

  async initialize () {
    this.dataTiffs.replace(await Promise.all(
      constants.TIFF_URLS.map(async url => {
        const tiff = await DataTiff.fromUrl(url)
        this.dataTiffsLoaded += 1
        return tiff
      })
    ))

    this.boundingBox.array = this.dataTiffs[0].image.getBoundingBox()
    this.initialized = true
  }

  @computed get allRasters () {
    return _.flatten(this.dataTiffs.map(tiff => tiff.rasters))
  }

  @computed get timePeriods () {
    return this.allRasters.length * 4
  }

  @computed get rasterSubimages (): {
    width: number,
    height: number,
    x: number,
    y: number,
    data: ArrayBufferView
  }[] {
    return this.allRasters.map((raster, i) => {
      const xIndex = i % this.textureRastersWide
      const yIndex = Math.floor(i / this.textureRastersWide)
      return {
        width: this.rasterWidth,
        height: this.rasterHeight,
        data: this.allRasters[i],
        x: this.rasterWidth * xIndex,
        y: this.rasterHeight * yIndex,
      }
    })
  }

  getViewport ({ width, height }: { width: number, height: number }) {
    return new Viewport.WebMercatorViewport({
      ...this.viewport,
      width,
      height,
    })
  }
}

export default RootStore
