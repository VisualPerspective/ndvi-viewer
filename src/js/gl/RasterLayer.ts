import { mat4 } from 'gl-matrix'
import * as regl from 'regl'

const vert = require('./shaders/vert')
const frag = require('./shaders/frag')

class RasterLayer {
  canvas: HTMLCanvasElement
  ctx: any
  renderer: any
  pendingRender: boolean = false

  constructor ({
    canvas
  } : {
    canvas: HTMLCanvasElement
  }) {
    this.canvas = canvas
    this.ctx = regl({ canvas: this.canvas })
    this.renderer = this.ctx({
      frag,
      vert,

      attributes: {
        position: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 0],
          [1, 1],
          [0, 1],
        ]
      },

      uniforms: {
        color: [0.6, 0.7, 0.9, 1],
        model: mat4.fromTranslation([], [-0.5, -0.5, 0]),
        view: mat4.lookAt([], [0,0,-3], [0,0,0], [0,1,0]),
        projection: this.ctx.prop('projection')
      },

      count: 6
    })

  }

  render () {
    if (this.canvas.width != this.canvas.offsetWidth ||
        this.canvas.height != this.canvas.offsetHeight) {
      this.canvas.width = this.canvas.offsetWidth
      this.canvas.height = this.canvas.offsetHeight
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
        0.5,
        this.canvas.width / this.canvas.height,
        0.01,
        1000
      )
    })
  }
}

export default RasterLayer
