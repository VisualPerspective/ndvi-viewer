import { observable, computed } from 'mobx'
import * as _ from 'lodash'
import constants from '@app/constants'
import Point from '@app/models/Point'
import BoundingBox from '@app/models/BoundingBox'
import Camera from '@app/models/Camera'
import VectorLayer from '@app/models/VectorLayer'
import Atlas from '@app/models/Atlas'

export enum Modes {
  NDVI = 'NDVI',
  NDVI_GROUPED = 'NDVI By Month',
}

class RootStore {
  @observable initialized: boolean = false
  @observable compatible: boolean = true

  @observable camera: Camera
  @observable vectorLayer: VectorLayer
  @observable atlas: Atlas
  @observable boundingBox = observable<BoundingBox>(new BoundingBox())
  @observable mode: Modes = Modes.NDVI

  @observable timePeriod: number = constants.START_TIME_PERIOD

  @computed get numTimePeriods () {
    return this.atlas.config.numRasters
  }

  readonly timePeriodAverages = observable<number>([])

  @computed get timePeriodsByMonth () {
    return _.times(this.numTimePeriods, (i) => {
      const n = this.numTimePeriods
      const id = ((i * 12) % n) + Math.floor((i * 12) / n)

      return {
        id,
        average: this.timePeriodAverages[id],
      }
    })
  }

  @computed get percentLoaded () {
    return this.atlas ? this.atlas.loadProgress : 0
  }

  @computed get rasterWidth () {
    return this.atlas.config.rasterWidth
  }

  @computed get rasterHeight () {
    return this.atlas.config.rasterHeight
  }

  @computed get rasterSizePercent () {
    return new Point(
      1 / this.atlas.config.rastersWide,
      1 / this.atlas.config.rastersHigh
    )
  }

  @computed get textureRastersWide () {
    return this.atlas.config.rastersWide
  }

  @computed get textureRastersHigh () {
    return this.atlas.config.rastersHigh
  }

  @computed get samplesWide () {
    return this.textureRastersWide * 4
  }

  async initialize () {
    this.vectorLayer = new VectorLayer()
    await this.vectorLayer.initialize(constants.VECTOR_URL)

    this.atlas = new Atlas()
    await this.atlas.initialize({
      url: constants.ATLAS,
      configUrl: constants.ATLAS_CONFIG,
    })

    this.boundingBox = observable(BoundingBox.fromArray(
      this.atlas.config.boundingBox
    ))

    const startingBox = this.boundingBox.square.lngLatFromSinusoidal.scaled(1.1)

    this.camera = new Camera({
      size: new Point(100, 100),
      boundingBox: BoundingBox.fromArray(startingBox.array),
    })

    this.initialized = true
  }

  @computed get selectedBox (): BoundingBox {
    const size = this.camera.size
    const center = new Point(size.x / 2, size.y / 2)
    const extent = Math.min(size.x, size.y) / 2 -
      constants.SELECTED_BOX_PADDING

    const minPixel = new Point(center.x - extent, center.y + extent)
    const maxPixel = new Point(center.x + extent, center.y - extent)

    return new BoundingBox({
      min: this.camera.pixelToLngLat(minPixel),
      max: this.camera.pixelToLngLat(maxPixel),
    })
  }
}

export default RootStore
