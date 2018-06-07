import * as REGL from 'regl'
import { mat4 } from 'gl-matrix'
import { reaction } from 'mobx'
import View from '@app/gl/View'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

import vert from '@app/gl/shaders/viewVert'
import frag from '@app/gl/shaders/viewFrag'

interface IUniforms {
  model: REGL.Mat4
  view: REGL.Mat4
  projection: REGL.Mat4
  raster: REGL.Texture2D
  rasterWidth: number
  rasterHeight: number
  rasterBBoxMeters: number[]
  atlasSize: number
  timePeriod: number
  scale: number
}

interface IAttributes {
  position: number[]
}

interface IProps {
  view: REGL.Mat4
  projection: REGL.Mat4
  rasterBBoxMeters: number[]
  scale: number
  triangles: number[][]
  trianglesLength: number
  timePeriod: number
}

class RasterView extends View {
  renderer: any
  canvas: HTMLCanvasElement
  ctx: REGL.Regl
  rasterTexture: REGL.Texture2D
  rootStore: RootStore

  constructor ({
    canvas,
    ctx,
    rasterTexture,
    rootStore,
  }: {
    canvas: HTMLCanvasElement,
    ctx: REGL.Regl,
    rasterTexture: REGL.Texture2D,
    rootStore?: RootStore,
  }) {
    super({ canvas })
    this.ctx = ctx
    this.rasterTexture = rasterTexture
    this.rootStore = rootStore

    this.renderer = ctx<IUniforms, IAttributes, IProps>({
      frag: frag(),
      vert: vert(),
      attributes: {
        position: ctx.prop<IProps, 'triangles'>('triangles'),
      },
      uniforms: {
        model: mat4.fromTranslation([], [0, 0, 0]),
        view: ctx.prop<IProps, 'view'>('view'),
        projection: ctx.prop<IProps, 'projection'>('projection'),
        raster: this.rasterTexture,
        rasterWidth: this.rootStore.rasterWidth,
        rasterHeight: this.rootStore.rasterHeight,
        rasterBBoxMeters: ctx.prop<IProps, 'rasterBBoxMeters'>('rasterBBoxMeters'),
        atlasSize: constants.DATA_TEXTURE_SIZE,
        timePeriod: ctx.prop<IProps, 'timePeriod'>('timePeriod'),
        scale: ctx.prop<IProps, 'scale'>('scale'),
      },
      count: ctx.prop<IProps, 'trianglesLength'>('trianglesLength'),
    })

    reaction(() => ({
      timePeriod: this.rootStore.timePeriod,
    }), this.render.bind(this))
  }

  renderCanvasGL () {
    this.ctx.poll()
    this.ctx.clear({ color: [0.8, 0.8, 0.8, 1] })

    const mercator = this.rootStore.getViewport(this.canvas)

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
