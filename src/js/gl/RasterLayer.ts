import { mat4, vec3 } from 'gl-matrix'
import { reaction } from 'mobx'
import * as regl from 'regl'
import * as Viewport from 'viewport-mercator-project'
import RootStore from '../models/RootStore'
import constants from '../constants'

const vert = require('./shaders/vert')
const frag = require('./shaders/frag')

const pixelWidth = 590
const pixelHeight = 416

const bounds = [
  [-180, -80],
  [180, -80],
  [180, 80],
  [-180, -80],
  [180, 80],
  [-180, 80]
]

const uvs = [
  [1, 1],
  [0, 1],
  [0, 0],
  [1, 1],
  [0, 0],
  [1, 0]
]

class RasterLayer {
  canvas: HTMLCanvasElement
  ctx: any
  renderer: any
  pendingRender: boolean = false
  rootStore: RootStore
  rasterTexture: any
  rasterTextureFbo: any

  constructor ({
    canvas,
    rootStore
  } : {
    canvas: HTMLCanvasElement,
    rootStore?: RootStore
  }) {
    this.canvas = canvas
    this.rootStore = rootStore

    this.ctx = regl({
      canvas: this.canvas,
      extensions: [ 'OES_texture_float', 'webgl_color_buffer_float' ],
      attributes: { alpha: false }
    })

    this.rasterTexture = this.ctx.texture({
      radius: constants.DATA_TEXTURE_SIZE,
      type: 'float',
      format: 'rgba',
      min: 'nearest',
      mag: 'nearest',
      mipmap: false
    })

    this.renderer = this.ctx({
      frag,
      vert,

      attributes: {
        position: bounds,
        uvs: uvs
      },

      uniforms: {
        model: mat4.fromTranslation([], [0, 0, 0]),
        view: this.ctx.prop('view'),
        projection: this.ctx.prop('projection'),
        raster: this.rasterTexture,
        rasterWidth: this.rootStore.rasterWidth,
        rasterHeight: this.rootStore.rasterHeight,
        textureRastersWide: this.rootStore.textureRastersWide,
        textureRastersHigh: this.rootStore.textureRastersHigh,
        atlasSize: constants.DATA_TEXTURE_SIZE,
        timePeriod: this.ctx.prop('timePeriod'),
        scale: this.ctx.prop('scale'),
      },

      count: bounds.length
    })

    this.rasterTextureFbo = this.ctx.framebuffer({
      color: this.rasterTexture
    })

    for (let i = 0; i < this.rootStore.dataTiffs[0].rasters.length; i++) {
      const xIndex = i % this.rootStore.textureRastersWide
      const yIndex = Math.floor(i / this.rootStore.textureRastersWide)
      this.rasterTexture.subimage(
        {
          width: this.rootStore.rasterWidth,
          height: this.rootStore.rasterHeight,
          data: this.rootStore.dataTiffs[0].rasters[i]
        },
        this.rootStore.rasterWidth * xIndex,
        this.rootStore.rasterHeight * yIndex
      )
    }

    reaction(() => ({
      timePeriod: this.rootStore.timePeriod
    }), this.render.bind(this))
  }

  render () {
    if (this.canvas.width != this.canvas.offsetWidth * 2 ||
        this.canvas.height != this.canvas.offsetHeight * 2) {
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
      height: this.canvas.height
    })

    this.renderer({
      scale: mercator.scale * constants.TILE_SIZE,
      view: mercator.viewMatrix,
      projection: mercator.projectionMatrix,
      timePeriod: this.rootStore.timePeriod
    })
  }
}

export default RasterLayer
