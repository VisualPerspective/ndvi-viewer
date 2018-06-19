import * as REGL from 'regl'
import { reaction } from 'mobx'
import RasterView from '@app/gl/RasterView'
import RasterWidthGather from '@app/gl/RasterWidthGather'
import RasterHeightGather from '@app/gl/RasterHeightGather'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

class GLManager {
  canvas: HTMLCanvasElement
  ctx: any
  rasterView: RasterView
  rasterWidthGather: RasterWidthGather
  rasterHeightGather: RasterHeightGather
  rootStore: RootStore
  rasterTexture: REGL.Texture2D
  widthGatherTexture: REGL.Texture2D
  heightGatherTexture: REGL.Texture2D
  pendingRender: boolean = false

  constructor ({
    canvas,
    rootStore,
  }: {
    canvas: HTMLCanvasElement,
    rootStore?: RootStore
  }) {
    this.canvas = canvas
    this.rootStore = rootStore

    this.ctx = REGL({
      canvas: this.canvas,
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

    reaction(() => ({
      timePeriod: this.rootStore.timePeriod,
    }), this.render.bind(this))
  }

  render () {
    const devicePixelRatio = window.devicePixelRatio || 1
    const newWidth = this.canvas.offsetWidth * devicePixelRatio
    const newHeight = this.canvas.offsetHeight * devicePixelRatio

    if (this.canvas.width !== newWidth ||
        this.canvas.height !== newHeight) {
      this.canvas.width = newWidth
      this.canvas.height = newHeight
    }

    if (!this.pendingRender) {
      this.pendingRender = true
      window.requestAnimationFrame(() => {
        this.pendingRender = false
        this.rasterView.render({
          width: this.canvas.width,
          height: this.canvas.height,
        })
      })
    }
  }
}

export default GLManager
