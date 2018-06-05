import { mat4 } from 'gl-matrix'
import { reaction } from 'mobx'
import * as Viewport from 'viewport-mercator-project'
import RasterLayer from '@app/gl/RasterLayer'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

import vert from '@app/gl/shaders/viewVert'
import frag from '@app/gl/shaders/viewFrag'

class RasterView {
  renderer: any
  pendingRender: boolean = false
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
      frag: frag(),
      vert: vert(),
      attributes: { position: ctx.prop('triangles') },
      uniforms: {
        model: mat4.fromTranslation([], [0, 0, 0]),
        view: ctx.prop('view'),
        projection: ctx.prop('projection'),
        raster: this.rasterLayer.rasterTexture,
        rasterWidth: this.rootStore.rasterWidth,
        rasterHeight: this.rootStore.rasterHeight,
        rasterBBoxMeters: ctx.prop('rasterBBoxMeters'),
        atlasSize: constants.DATA_TEXTURE_SIZE,
        timePeriod: ctx.prop('timePeriod'),
        scale: ctx.prop('scale'),
      },
      count: ctx.prop('trianglesLength'),
    })

    reaction(() => ({
      timePeriod: this.rootStore.timePeriod,
    }), this.render.bind(this))
  }

  render () {
    const canvas = this.rasterLayer.canvas

    if (canvas.width !== canvas.offsetWidth * 2 ||
      canvas.height !== canvas.offsetHeight * 2) {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
    }

    if (!this.pendingRender) {
      this.pendingRender = true
      window.requestAnimationFrame(() => {
        this.renderCanvasGL()
      })
    }
  }

  renderCanvasGL () {
    this.pendingRender = false
    this.rasterLayer.ctx.poll()

    this.rasterLayer.ctx.clear({ color: [0.8, 0.8, 0.8, 1] })

    const mercator = new Viewport.WebMercatorViewport({
      ...this.rootStore.viewport,
      width: this.rasterLayer.canvas.width,
      height: this.rasterLayer.canvas.height,
    })

    this.renderer({
      scale: mercator.scale * constants.TILE_SIZE,
      view: mercator.viewMatrix,
      projection: mercator.projectionMatrix,
      timePeriod: this.rootStore.timePeriod,
      triangles: this.rootStore.boundingBox.triangles,
      trianglesLength: this.rootStore.boundingBox.triangles.length,
      rasterBBoxMeters: this.rootStore.boundingBox.array,
    })
  }
}

export default RasterView
