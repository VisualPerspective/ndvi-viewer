import { mat4 } from 'gl-matrix'
const regl = require('regl')

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
      frag: `
      precision mediump float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,

      vert: `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 model, view, projection;
      void main() {
        gl_Position = projection * view * model * vec4(position, 0, 1);
      }`,

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
