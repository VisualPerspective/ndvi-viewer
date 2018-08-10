import * as REGL from 'regl'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'
import {
  compensatedSquareUVs
} from '@app/utils'

import vert from '@app/gl/shaders/gatherVert'
import frag from '@app/gl/shaders/gatherFragHeight'

interface IUniforms {
  widthGather: REGL.Texture2D
  imageSize: number[]
  imagesWide: number
  imagesHigh: number
}

interface IAttributes {
  position: number[][]
  uv: number[][]
}

interface IProps {
  framebufferWidth: number
  framebufferHeight: number
}

class RasterHeightGather {
  renderer: any
  ctx: REGL.Regl
  widthGatherTexture: REGL.Texture2D
  heightGatherTexture: REGL.Texture2D
  heightGatherFBO: REGL.Framebuffer
  rootStore: RootStore

  constructor ({
    ctx,
    widthGatherTexture,
    heightGatherTexture,
    rootStore,
  }: {
    ctx: REGL.Regl
    widthGatherTexture: REGL.Texture2D
    heightGatherTexture: REGL.Texture2D
    rootStore?: RootStore
  }) {
    this.ctx = ctx
    this.rootStore = rootStore

    this.widthGatherTexture = widthGatherTexture
    this.heightGatherTexture = heightGatherTexture

    this.heightGatherFBO = ctx.framebuffer({
      color: this.heightGatherTexture,
    })

    this.renderer = ctx<IUniforms, IAttributes, IProps>({
      framebuffer: this.heightGatherFBO,
      context: {
        framebufferWidth: ctx.prop<IProps, 'framebufferWidth'>('framebufferWidth'),
        framebufferHeight: ctx.prop<IProps, 'framebufferHeight'>('framebufferHeight'),
      },
      frag: frag({
        rasterHeight: rootStore.rasterHeight,
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
          height: rootStore.textureRastersHigh,
        }),
      },
      uniforms: {
        widthGather: this.widthGatherTexture,
        imageSize: this.rootStore.rasterSizePercent.array,
        imagesWide: this.rootStore.samplesWide,
        imagesHigh: this.rootStore.textureRastersHigh,
      },
      count: constants.DATA_SQUARE_POSITIONS.length,
    })
  }

  compute (): number[] {
    let pixels: Float32Array
    this.ctx({ framebuffer: this.heightGatherFBO })(() => {
      this.renderer({
        framebufferWidth: this.rootStore.samplesWide,
        framebufferHeight: this.rootStore.textureRastersHigh,
      })

      pixels = this.ctx.read({
        x: 0,
        y: 0,
        width: this.rootStore.samplesWide,
        height: this.rootStore.textureRastersHigh,
      })
    })

    return this.valuesFromGatheredPixels(pixels)
  }

  valuesFromGatheredPixels (pixels: Float32Array) {
    const totals: number[] = []
    const pixelCounts: number[] = []
    const values: number[] = []
    for (let i = 0; i < this.rootStore.numTimePeriods; i++) {
      const total = pixels[i * 4]
      const pixelCount = pixels[i * 4 + 1]
      totals.push(total)
      pixelCounts.push(pixelCount)

      values.push(pixelCount === 0 ? undefined : total / pixelCount)
    }

    return values
  }
}

export default RasterHeightGather
