import * as REGL from 'regl'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

import vert from '@app/gl/shaders/averageVert'
import frag from '@app/gl/shaders/averageFragWidth'

interface IUniforms {
  raster: REGL.Texture2D
  rasterWidth: number
  rasterHeight: number
  atlasSize: number
}

interface IAttributes {
  position: number[][]
  uv: number[][]
}

interface IProps {}

class RasterAverage {
  renderer: any
  ctx: REGL.Regl
  rasterTexture: REGL.Texture2D
  rootStore: RootStore

  constructor ({
    ctx,
    rasterTexture,
    rootStore,
  }: {
    ctx: REGL.Regl
    rasterTexture: REGL.Texture2D
    rootStore?: RootStore
  }) {
    this.ctx = ctx
    this.rasterTexture = rasterTexture
    this.rootStore = rootStore

    this.renderer = ctx<IUniforms, IAttributes, IProps>({
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
        raster: this.rasterTexture,
        rasterWidth: this.rootStore.rasterWidth,
        rasterHeight: this.rootStore.rasterHeight,
        atlasSize: constants.DATA_TEXTURE_SIZE,
      },
      count: constants.DATA_SQUARE_POSITIONS.length,
    })
  }
}

export default RasterAverage
