import * as REGL from 'regl'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'
import {
  debugImageFromArray,
  compensatedSquareUVs
} from '@app/utils'

import vert from '@app/gl/shaders/gatherVert'
import frag from '@app/gl/shaders/gatherFragWidth'

interface IUniforms {
  raster: REGL.Texture2D
  imageSize: number[]
  imagesWide: number
  targetHeight: number
}

interface IAttributes {
  position: number[][]
  uv: number[][]
}

interface IProps {
  framebufferWidth: number
  framebufferHeight: number
}

class RasterWidthGather {
  renderer: any
  ctx: REGL.Regl
  rasterTexture: REGL.Texture2D
  widthGatherTexture: REGL.Texture2D
  widthGatherFBO: REGL.Framebuffer
  rootStore: RootStore

  constructor ({
    ctx,
    rasterTexture,
    widthGatherTexture,
    rootStore,
  }: {
    ctx: REGL.Regl
    rasterTexture: REGL.Texture2D
    widthGatherTexture: REGL.Texture2D
    rootStore?: RootStore
  }) {
    this.ctx = ctx
    this.rasterTexture = rasterTexture
    this.rootStore = rootStore

    this.widthGatherTexture = widthGatherTexture

    this.widthGatherFBO = ctx.framebuffer({
      color: this.widthGatherTexture,
    })

    this.renderer = ctx<IUniforms, IAttributes, IProps>({
      framebuffer: this.widthGatherFBO,
      context: {
        framebufferWidth: ctx.prop<IProps, 'framebufferWidth'>('framebufferWidth'),
        framebufferHeight: ctx.prop<IProps, 'framebufferHeight'>('framebufferHeight'),
      },
      frag: frag({
        rasterWidth: rootStore.rasterWidth,
        noDataThreshold: constants.NO_DATA_THRESHOLD,
      }),
      vert: vert(),
      attributes: {
        position: constants.DATA_SQUARE_POSITIONS,
        uv: compensatedSquareUVs({
          width: rootStore.samplesWide,
          height: constants.DATA_TEXTURE_SIZE,
        }),
      },
      uniforms: {
        raster: this.rasterTexture,
        imageSize: this.rootStore.rasterSizePercent.array,
        imagesWide: this.rootStore.textureRastersWide,
        targetHeight: constants.DATA_TEXTURE_SIZE,
      },
      count: constants.DATA_SQUARE_POSITIONS.length,
    })
  }

  compute () {
    this.ctx({ framebuffer: this.widthGatherFBO })(() => {
      this.ctx.poll()
      this.renderer({
        framebufferWidth: this.rootStore.samplesWide,
        framebufferHeight: constants.DATA_TEXTURE_SIZE,
      })

      const pixels = this.ctx.read({
        x: 0,
        y: 0,
        width: this.rootStore.samplesWide,
        height: constants.DATA_TEXTURE_SIZE,
      })

      debugImageFromArray({
        data: pixels,
        width: this.rootStore.samplesWide,
        height: constants.DATA_TEXTURE_SIZE,
      })
    })
  }
}

export default RasterWidthGather
