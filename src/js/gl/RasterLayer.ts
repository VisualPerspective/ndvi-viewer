import { mat4, vec3 } from 'gl-matrix'
import { reaction } from 'mobx'
import * as regl from 'regl'
import * as Viewport from 'viewport-mercator-project'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

const vert = require('@app/gl/shaders/vert')
const frag = require('@app/gl/shaders/frag')

class RasterLayer {
  canvas: HTMLCanvasElement
  ctx: any
  renderer: any
  pendingRender: boolean = false
  rootStore: RootStore
  rasterTexture: any

  constructor ({
    canvas,
    rootStore,
  }: {
    canvas: HTMLCanvasElement,
    rootStore?: RootStore
  }) {
    this.canvas = canvas
    this.rootStore = rootStore

    this.ctx = regl({
      canvas: this.canvas,
      extensions: [ 'OES_texture_float', 'webgl_color_buffer_float' ],
      attributes: { alpha: false },
    })

    this.rasterTexture = this.ctx.texture({
      radius: constants.DATA_TEXTURE_SIZE,
      type: 'float',
      format: 'rgba',
      min: 'nearest',
      mag: 'nearest',
      mipmap: false,
      wrapS: 'clamp',
      wrapT: 'clamp',
    })

    this.renderer = this.ctx({
      frag,
      vert,

      attributes: {
        position: this.ctx.prop('triangles'),
      },

      uniforms: {
        model: mat4.fromTranslation([], [0, 0, 0]),
        view: this.ctx.prop('view'),
        projection: this.ctx.prop('projection'),
        raster: this.rasterTexture,
        rasterWidth: this.rootStore.rasterWidth,
        rasterHeight: this.rootStore.rasterHeight,
        rasterBBoxMeters: this.ctx.prop('rasterBBoxMeters'),
        textureRastersWide: this.rootStore.textureRastersWide,
        textureRastersHigh: this.rootStore.textureRastersHigh,
        atlasSize: constants.DATA_TEXTURE_SIZE,
        timePeriod: this.ctx.prop('timePeriod'),
        scale: this.ctx.prop('scale'),
      },

      count: this.ctx.prop('trianglesLength'),
    })

    this.rootStore.rasterSubimages.forEach(({ width, height, data, x, y }) => {
      this.rasterTexture.subimage({ width, height, data }, x, y)
    })

    reaction(() => ({
      timePeriod: this.rootStore.timePeriod,
    }), this.render.bind(this))
  }

  render () {
    if (this.canvas.width !== this.canvas.offsetWidth * 2 ||
        this.canvas.height !== this.canvas.offsetHeight * 2) {
      this.canvas.width = this.canvas.offsetWidth * 2
      this.canvas.height = this.canvas.offsetHeight * 2
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
    this.ctx.poll()

    this.ctx.clear({ color: [1, 1, 1, 1] })

    const mercator = new Viewport.WebMercatorViewport({
      ...this.rootStore.viewport,
      width: this.canvas.width,
      height: this.canvas.height,
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

export default RasterLayer
