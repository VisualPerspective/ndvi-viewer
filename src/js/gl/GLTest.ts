import * as REGL from 'regl'
import constants from '@app/constants'

const TEST_SIZE = 16

class GLTest {
  canvas: HTMLCanvasElement
  ctx: any
  texture: REGL.Texture2D
  fbo: REGL.Framebuffer

  constructor () {
    this.canvas = document.createElement('canvas')

    this.ctx = REGL({
      canvas: this.canvas,
      extensions: constants.GL_EXTENSIONS,
      attributes: { alpha: false },
    })

    const data = new Float32Array(TEST_SIZE * TEST_SIZE * 4)

    this.texture = this.ctx.texture({
      ...(constants.DATA_TEXTURE_OPTIONS),
      radius: 16,
      data,
    })

    this.fbo = this.ctx.framebuffer({ color: this.texture })

    this.ctx({ framebuffer: this.fbo })(() => {
      this.ctx.clear({ color: [0.5, 0.5, 0.5, 0.5] })
      this.ctx.read()
    })
  }
}

export default GLTest
