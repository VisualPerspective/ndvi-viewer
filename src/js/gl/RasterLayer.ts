import { mat4 } from 'gl-matrix'
import * as regl from 'regl'
import RootStore from '../models/RootStore'

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
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 0],
  [1, 1],
  [0, 1]
]

class RasterLayer {
  canvas: HTMLCanvasElement
  ctx: any
  renderer: any
  pendingRender: boolean = false
  rootStore: RootStore

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
      extensions: [ 'OES_texture_float' ]
    })

    this.renderer = this.ctx({
      frag,
      vert,

      attributes: {
        position: bounds,
        uvs: uvs
      },

      uniforms: {
        color: [0.6, 0.7, 0.9, 1],
        model: mat4.fromTranslation([], [-width / 2, -height / 2, 0]),
        view: mat4.lookAt([], [0, 0, -3], [0, 0, 0], [0, 1, 0]),
        projection: this.ctx.prop('projection'),
        ndvi: this.ctx.texture({
          width: this.rootStore.ndviTiff.getImage().getWidth(),
          height: this.rootStore.ndviTiff.getImage().getHeight(),
          data: this.rootStore.ndviTiff.getImage().readRasters()[0],
          format: 'luminance',
          min: 'nearest',
          mag: 'nearest',
          mipmap: false
        })
      },

      count: bounds.length
    })

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
