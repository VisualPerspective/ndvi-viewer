import { observable, computed } from 'mobx'
import constants from '@app/constants'
import * as _ from 'lodash'
import DataTiff from '@app/models/DataTiff'
import Point from '@app/models/Point'
import BoundingBox from '@app/models/BoundingBox'
import Camera from '@app/models/Camera'
import VectorLayer from '@app/models/VectorLayer'

export enum PickTypes {
  PAN,
  MOVE,
}

class RootStore {
  @observable initialized: boolean = false
  @observable dataTiffsLoaded: number = 0
  @observable timePeriod: number = 0

  @observable camera: Camera
  @observable vectorLayer: VectorLayer
  @observable selectedBox = observable<BoundingBox>(new BoundingBox())
  @observable boundingBox = observable<BoundingBox>(new BoundingBox())

  readonly timePeriodAverages = observable<number>([])
  readonly dataTiffs = observable<DataTiff>([])

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
    this.vectorLayer = new VectorLayer()
    await this.vectorLayer.initialize(constants.VECTOR_URL)

    this.dataTiffs.replace(await Promise.all(
      constants.TIFF_URLS.map(async url => {
        const tiff = await DataTiff.fromUrl(url)
        this.dataTiffsLoaded += 1
        return tiff
      })
    ))

    this.boundingBox = observable(BoundingBox.fromArray(
      this.dataTiffs[0].image.getBoundingBox()
    ))

    this.selectedBox = observable(
      this.boundingBox.lngLatFromSinusoidal.scaled(1.1)
    )

    this.camera = new Camera({
      size: new Point(100, 100),
      boundingBox: BoundingBox.fromArray(this.selectedBox.array),
    })

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

  pick (coordinate: Point) {
    const lngLat = this.camera.viewport.unproject(coordinate.array)

    if (this.selectedBox.contains(new Point(lngLat[0], lngLat[1]))) {
      return PickTypes.MOVE
    } else {
      return PickTypes.PAN
    }
  }
}

export default RootStore
