import { observable, computed, set } from 'mobx'
import { fromArrayBuffer } from 'geotiff'
import * as _ from 'lodash'
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
    zoom: 6.75,
    latitude: 65,
    longitude: -18
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
    const points = [
      sinusoidalToLngLat({
        x: this.boundingBox.min.x,
        y: this.boundingBox.min.y
      }),
      sinusoidalToLngLat({
        x: this.boundingBox.max.x,
        y: this.boundingBox.min.y
      }),
      sinusoidalToLngLat({
        x: this.boundingBox.min.x,
        y: this.boundingBox.max.y
      }),
      sinusoidalToLngLat({
        x: this.boundingBox.max.x,
        y: this.boundingBox.max.y
      })
    ]

    return {
      min: { x: _.minBy(points, 'x').x, y: _.minBy(points, 'y').y },
      max: { x: _.maxBy(points, 'x').x, y: _.maxBy(points, 'y').y },
    }
  }

  @computed get triangles (): any {
    const bbox: any = this.lngLatBoundingBox

    return [
      [bbox.min.x, bbox.min.y],
      [bbox.max.x, bbox.min.y],
      [bbox.max.x, bbox.max.y],
      [bbox.min.x, bbox.min.y],
      [bbox.max.x, bbox.max.y],
      [bbox.min.x, bbox.max.y]
    ]
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
