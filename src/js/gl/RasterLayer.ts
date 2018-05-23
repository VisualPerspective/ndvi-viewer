import { mat4 } from 'gl-matrix'
import { reaction } from 'mobx'
import * as regl from 'regl'
import RootStore from '../models/RootStore'
import constants from '../constants'

const vert = require('./shaders/vert')
const frag = require('./shaders/frag')

const pixelWidth = 590
const pixelHeight = 416

const width = pixelWidth / Math.max(pixelWidth, pixelHeight)
const height = pixelHeight / Math.max(pixelWidth, pixelHeight)

const bounds = [
  [0, 0],
  [width, 0],
  [width, height],
  [0, 0],
  [width, height],
  [0, height]
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
        model: mat4.fromTranslation([], [-width / 2, -height / 2, 0]),
        view: mat4.lookAt([], [0, 0, -3], [0, 0, 0], [0, 1, 0]),
        projection: this.ctx.prop('projection'),
        ndvi: this.ndviTexture
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

    this.renderer({
      projection: mat4.perspective(
        [],
        0.4,
        this.canvas.width / this.canvas.height,
        0.01,
        1000
      )
    })
  }
}

export default RasterLayer
