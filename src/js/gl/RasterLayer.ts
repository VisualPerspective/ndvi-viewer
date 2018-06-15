import * as REGL from 'regl'
import RasterView from '@app/gl/RasterView'
import RasterWidthGather from '@app/gl/RasterWidthGather'
import RasterHeightGather from '@app/gl/RasterHeightGather'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

class RasterLayer {
  gl: WebGLRenderingContext
  ctx: any
  rasterView: RasterView
  rasterWidthGather: RasterWidthGather
  rasterHeightGather: RasterHeightGather
  rootStore: RootStore
  rasterTexture: REGL.Texture2D
  widthGatherTexture: REGL.Texture2D
  heightGatherTexture: REGL.Texture2D

  constructor ({
    gl,
    rootStore,
  }: {
    gl: WebGLRenderingContext,
    rootStore?: RootStore
  }) {
    this.gl = gl
    this.rootStore = rootStore

    this.ctx = REGL({
      gl: this.gl,
      optionalExtensions: [
        'OES_texture_float',
        'webgl_color_buffer_float',
      ],
      attributes: { alpha: false },
    })

    this.rasterTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      radius: constants.DATA_TEXTURE_SIZE,
      data: new Float32Array(
        constants.DATA_TEXTURE_SIZE *
        constants.DATA_TEXTURE_SIZE *
        4
      ).fill(constants.NO_DATA_VALUE),
    })

    this.rootStore.rasterSubimages.forEach(({ width, height, data, x, y }) => {
      // TODO: figure out why cast to 'any' is needed here
      (this.rasterTexture as any).subimage({ width, height, data }, x, y)
    })

    this.rasterView = new RasterView({
      rootStore,
      ctx: this.ctx,
      rasterTexture: this.rasterTexture,
    })

    this.widthGatherTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      width: rootStore.samplesWide,
      height: constants.DATA_TEXTURE_SIZE,
    })

    this.heightGatherTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      width: rootStore.samplesWide,
      height: rootStore.textureRastersHigh,
    })

    this.rasterWidthGather = new RasterWidthGather({
      rootStore,
      ctx: this.ctx,
      rasterTexture: this.rasterTexture,
      widthGatherTexture: this.widthGatherTexture,
    })

    this.rasterHeightGather = new RasterHeightGather({
      rootStore,
      ctx: this.ctx,
      widthGatherTexture: this.widthGatherTexture,
      heightGatherTexture: this.heightGatherTexture,
    })

    this.rasterWidthGather.compute()
    rootStore.timePeriodAverages.replace(
      this.rasterHeightGather.compute()
    )
  }
}

export default RasterLayer
