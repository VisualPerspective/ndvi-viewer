import { observable, computed } from 'mobx'
import { fromArrayBuffer } from 'geotiff'
import constants from '@app/constants'

class DataTiff {
  tiff: any
  image: any
  rasters: ArrayBufferView[]
  width: any
  height: any

  constructor () {}

  async initialize (url: string) {
    const data: Response = await window.fetch(url)

    this.tiff = await fromArrayBuffer(await data.arrayBuffer())
    this.image = await this.tiff.getImage()
    this.width = this.image.getWidth()
    this.height = this.image.getHeight()

    this.rasters = [
      await this.image.readRasters({
        interleave: true,
        samples: [0, 1, 2, 3]
      }),
      await this.image.readRasters({
        interleave: true,
        samples: [4, 5, 6, 7]
      }),
      await this.image.readRasters({
        interleave: true,
        samples: [8, 9, 10, 11]
      })
    ]
  }

  static async fromUrl(url: string) {
    const dataTiff = new DataTiff()
    await dataTiff.initialize(url)
    return dataTiff
  }
}

export default DataTiff
