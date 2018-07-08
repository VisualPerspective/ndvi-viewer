import * as REGL from 'regl'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'
import {
  compensatedSquareUVs
} from '@app/utils'

import vert from '@app/gl/shaders/maskVert'
import frag from '@app/gl/shaders/maskFrag'

interface IUniforms {
  mask: REGL.Texture2D
  rasterBBoxMeters: number[]
  selectedBBoxLngLat: number[]
  rasterWidth: number
  rasterHeight: number
}

interface IAttributes {
  position: number[][]
  uv: number[][]
}

interface IProps {
  framebufferWidth: number
  framebufferHeight: number
  rasterBBoxMeters: number[]
  selectedBBoxLngLat: number[]
}

class RasterMask {
  renderer: any
  ctx: REGL.Regl
  rasterMaskTexture: REGL.Texture2D
  rootStore: RootStore
  maskFBO: REGL.Framebuffer

  constructor ({
    ctx,
    rasterMaskTexture,
    rootStore,
  }: {
    ctx: REGL.Regl
    rasterMaskTexture: REGL.Texture2D
    rootStore?: RootStore
  }) {
    this.ctx = ctx
    this.rasterMaskTexture = rasterMaskTexture
    this.rootStore = rootStore

    this.maskFBO = ctx.framebuffer({
      color: this.rasterMaskTexture,
    })

    this.renderer = ctx<IUniforms, IAttributes, IProps>({
      framebuffer: this.maskFBO,
      context: {
        framebufferWidth: ctx.prop<IProps, 'framebufferWidth'>('framebufferWidth'),
        framebufferHeight: ctx.prop<IProps, 'framebufferHeight'>('framebufferHeight'),
      },
      frag: frag(),
      vert: vert(),
      depth: {
        enable: false,
      },
      attributes: {
        position: constants.DATA_SQUARE_POSITIONS,
        uv: compensatedSquareUVs({
          width: rootStore.rasterWidth,
          height: rootStore.rasterHeight,
        }),
      },
      uniforms: {
        mask: this.rasterMaskTexture,
        rasterWidth: rootStore.rasterWidth,
        rasterHeight: rootStore.rasterHeight,
        rasterBBoxMeters: ctx.prop<IProps, 'rasterBBoxMeters'>('rasterBBoxMeters'),
        selectedBBoxLngLat: ctx.prop<IProps, 'selectedBBoxLngLat'>('selectedBBoxLngLat'),
      },
      count: constants.DATA_SQUARE_POSITIONS.length,
    })
  }

  render () {
    this.ctx({ framebuffer: this.maskFBO })(() => {
      this.ctx.poll()
      this.renderer({
        framebufferWidth: this.rootStore.rasterWidth,
        framebufferHeight: this.rootStore.rasterHeight,
        rasterBBoxMeters: this.rootStore.boundingBox.array,
        selectedBBoxLngLat: this.rootStore.selectedBox.array,
      })
    })
  }
}

export default RasterMask
