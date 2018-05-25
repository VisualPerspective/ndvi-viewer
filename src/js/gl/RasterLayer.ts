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
  ndviTexture: any
  ndviTextureFbo: any

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

    this.ndviTexture = this.ctx.texture({
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
        ndvi: this.ndviTexture,
        rasterWidth: this.rootStore.ndviWidth,
        rasterHeight: this.rootStore.ndviHeight,
        imagesWide: this.rootStore.imagesWide,
        imagesHigh: this.rootStore.imagesHigh,
        atlasSize: constants.DATA_TEXTURE_SIZE,
        timePeriod: this.ctx.prop('timePeriod'),
        scale: this.ctx.prop('scale'),
      },

      count: bounds.length
    })

    this.ndviTextureFbo = this.ctx.framebuffer({
      color: this.ndviTexture
    })

    for (let i = 0; i < this.rootStore.ndviRasters.length; i++) {
      const xIndex = i % this.rootStore.imagesWide
      const yIndex = Math.floor(i / this.rootStore.imagesWide)
      this.ndviTexture.subimage(
        {
          width: this.rootStore.ndviWidth,
          height: this.rootStore.ndviHeight,
          data: this.rootStore.ndviRasters[i]
        },
        this.rootStore.ndviWidth * xIndex,
        this.rootStore.ndviHeight * yIndex
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
