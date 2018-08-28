import * as REGL from 'regl'
import RootStore, { Modes } from '@app/models/RootStore'
import constants from '@app/constants'
import {
  compensatedSquareUVs
} from '@app/utils'

import vert from '@app/gl/shaders/gatherVert'
import frag from '@app/gl/shaders/gatherFragWidth'

interface IUniforms {
  raster: REGL.Texture2D
  mask: REGL.Texture2D
  imageSize: number[]
  imagesWide: number
  targetHeight: number
  minValue: number
  maxValue: number
}

interface IAttributes {
  position: number[][]
  uv: number[][]
}

interface IProps {
  framebufferWidth: number
  framebufferHeight: number
  minValue: number
  maxValue: number
}

class RasterWidthGather {
  renderer: any
  ctx: REGL.Regl
  rasterTexture: REGL.Texture2D
  rasterMaskTexture: REGL.Texture2D
  widthGatherTexture: REGL.Texture2D
  widthGatherFBO: REGL.Framebuffer
  rootStore: RootStore

  constructor ({
    ctx,
    rasterTexture,
    rasterMaskTexture,
    widthGatherTexture,
    rootStore,
  }: {
    ctx: REGL.Regl
    rasterTexture: REGL.Texture2D
    rasterMaskTexture: REGL.Texture2D
    widthGatherTexture: REGL.Texture2D
    rootStore?: RootStore
  }) {
    this.ctx = ctx
    this.rasterTexture = rasterTexture
    this.rasterMaskTexture = rasterMaskTexture
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
      depth: {
        enable: false,
      },
      attributes: {
        position: constants.DATA_SQUARE_POSITIONS,
        uv: compensatedSquareUVs({
          width: rootStore.samplesWide,
          height: constants.DATA_TEXTURE_SIZE,
        }),
      },
      uniforms: {
        raster: this.rasterTexture,
        mask: this.rasterMaskTexture,
        imageSize: this.rootStore.rasterSizePercent.array,
        imagesWide: this.rootStore.textureRastersWide,
        targetHeight: constants.DATA_TEXTURE_SIZE,
        minValue: ctx.prop<IProps, 'minValue'>('minValue'),
        maxValue: ctx.prop<IProps, 'maxValue'>('maxValue'),
      },
      count: constants.DATA_SQUARE_POSITIONS.length,
    })
  }

  compute () {
    let modeUniforms = {}
    switch (this.rootStore.mode) {
      case Modes.NDVI:
      case Modes.NDVI_GROUPED:
        modeUniforms = {
          minValue: constants.MIN_VALUE_NDVI,
          maxValue: constants.MAX_VALUE_NDVI,
        }
        break
      case Modes.NDVI_ANOMALY:
      case Modes.NDVI_ANOMALY_GROUPED:
        modeUniforms = {
          minValue: constants.MIN_VALUE_NDVI_ANOMALY,
          maxValue: constants.MAX_VALUE_NDVI_ANOMALY,
        }
    }

    this.ctx({ framebuffer: this.widthGatherFBO })(() => {
      this.renderer({
        framebufferWidth: this.rootStore.samplesWide,
        framebufferHeight: constants.DATA_TEXTURE_SIZE,
        ...modeUniforms,
      })
    })
  }
}

export default RasterWidthGather
