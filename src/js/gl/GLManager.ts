import * as REGL from 'regl'
import { reaction } from 'mobx'
import RasterView from '@app/gl/RasterView'
import RasterMask from '@app/gl/RasterMask'
import RasterWidthGather from '@app/gl/RasterWidthGather'
import RasterHeightGather from '@app/gl/RasterHeightGather'
import VectorView from '@app/gl/VectorView'
import OutlineView from '@app/gl/OutlineView'
import BoxSelectView from '@app/gl/BoxSelectView'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

class GLManager {
  canvas: HTMLCanvasElement
  ctx: any
  rasterView: RasterView
  rasterMask: RasterMask
  rasterWidthGather: RasterWidthGather
  rasterHeightGather: RasterHeightGather
  vectorView: VectorView
  outlineView: OutlineView
  boxSelectView: BoxSelectView
  rootStore: RootStore
  rasterTexture: REGL.Texture2D
  rasterMaskTexture: REGL.Texture2D
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
      profile: constants.PROFILE,
      canvas: this.canvas,
      extensions: constants.GL_EXTENSIONS,
      attributes: { alpha: false },
    })

    const atlasConfig = this.rootStore.atlas.config
    this.rasterTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      type: 'uint8',
      width: atlasConfig.rasterWidth * atlasConfig.rastersWide,
      height: atlasConfig.rasterHeight * atlasConfig.rastersHigh,
      data: this.rootStore.atlas.data,
    })

    this.vectorView = new VectorView({
      rootStore,
      ctx: this.ctx,
    })

    this.outlineView = new OutlineView({
      rootStore,
      ctx: this.ctx,
    })

    this.boxSelectView = new BoxSelectView({
      rootStore,
      ctx: this.ctx,
    })

    this.rasterMaskTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      type: 'uint8',
      width: rootStore.rasterWidth,
      height: rootStore.rasterHeight,
    })

    this.rasterMask = new RasterMask({
      rootStore,
      ctx: this.ctx,
      rasterMaskTexture: this.rasterMaskTexture,
    })

    this.rasterView = new RasterView({
      rootStore,
      ctx: this.ctx,
      rasterTexture: this.rasterTexture,
      rasterMaskTexture: this.rasterMaskTexture,
    })

    this.widthGatherTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      width: rootStore.samplesWide,
      height: constants.DATA_TEXTURE_SIZE,
    })

    this.rasterWidthGather = new RasterWidthGather({
      rootStore,
      ctx: this.ctx,
      rasterTexture: this.rasterTexture,
      rasterMaskTexture: this.rasterMaskTexture,
      widthGatherTexture: this.widthGatherTexture,
    })

    this.heightGatherTexture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      width: rootStore.samplesWide,
      height: rootStore.textureRastersHigh,
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
      zoom: this.rootStore.camera.zoom,
      cameraPosition: this.rootStore.camera.position.array,
      selectedBox: this.rootStore.selectedBox.array,
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
      this.rootStore.camera.size.set(
        this.canvas.offsetWidth,
        this.canvas.offsetHeight
      )
    }

    if (!this.pendingRender) {
      this.pendingRender = true
      window.requestAnimationFrame(() => {
        this.pendingRender = false
        this.ctx.poll()
        this.ctx.clear({ color: [0.2, 0.2, 0.2, 1] })
        this.rasterMask.render()
        this.vectorView.render()
        this.rasterView.render()
        this.outlineView.render()
        this.boxSelectView.render()

        this.rasterWidthGather.compute()
        this.rootStore.timePeriodAverages.replace(
          this.rasterHeightGather.compute()
        )
      })
    }
  }
}

export default GLManager
