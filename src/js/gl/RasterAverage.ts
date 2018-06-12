import * as REGL from 'regl'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'
import {
  debugImageFromArray,
  compensatedSquareUVs
} from '@app/utils'

import vert from '@app/gl/shaders/averageVert'
import frag from '@app/gl/shaders/averageFragWidth'

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

class RasterAverage {
  renderer: any
  ctx: REGL.Regl
  rasterTexture: REGL.Texture2D
  widthAveragedTexture: REGL.Texture2D
  widthAveragedFBO: REGL.Framebuffer
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

    this.widthAveragedTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      width: rootStore.samplesWide,
      height: constants.DATA_TEXTURE_SIZE,
    })

    this.widthAveragedFBO = ctx.framebuffer({
      color: this.widthAveragedTexture,
    })

    this.renderer = ctx<IUniforms, IAttributes, IProps>({
      framebuffer: this.widthAveragedFBO,
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
    this.ctx({ framebuffer: this.widthAveragedFBO })(() => {
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

export default RasterAverage
