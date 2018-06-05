import RasterLayer from '@app/gl/RasterLayer'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

import vert from '@app/gl/shaders/averageVert'
import frag from '@app/gl/shaders/averageFragWidth'

class RasterAverage {
  renderer: any
  rootStore: RootStore
  rasterLayer: RasterLayer

  constructor ({
    rasterLayer,
    rootStore,
  }: {
    rasterLayer: RasterLayer,
    rootStore?: RootStore
  }) {
    this.rasterLayer = rasterLayer
    this.rootStore = rootStore

    const ctx = this.rasterLayer.ctx
    this.renderer = ctx({
      frag: frag({
        dataSize: constants.DATA_TEXTURE_SIZE,
        noDataThreshold: constants.NO_DATA_THRESHOLD,
      }),
      vert: vert(),
      attributes: {
        position: constants.DATA_SQUARE_POSITIONS,
        uv: constants.DATA_SQUARE_UVS,
      },
      uniforms: {
        raster: this.rasterLayer.rasterTexture,
        rasterWidth: this.rootStore.rasterWidth,
        rasterHeight: this.rootStore.rasterHeight,
        rasterBBoxMeters: ctx.prop('rasterBBoxMeters'),
        atlasSize: constants.DATA_TEXTURE_SIZE,
        scale: ctx.prop('scale'),
      },
      count: constants.DATA_SQUARE_POSITIONS.length,
    })
  }
}

export default RasterAverage
