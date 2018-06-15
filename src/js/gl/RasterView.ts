import * as REGL from 'regl'
import { mat4 } from 'gl-matrix'
import { reaction } from 'mobx'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

import vert from '@app/gl/shaders/viewVert'
import frag from '@app/gl/shaders/viewFrag'

interface IUniforms {
  model: REGL.Mat4
  view: REGL.Mat4
  projection: REGL.Mat4
  raster: REGL.Texture2D
  imagesWide: number
  imageSize: number[]
  rasterBBoxMeters: number[]
  atlasSize: number
  timePeriod: number
  scale: number
}

interface IAttributes {
  position: number[][]
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

class RasterView {
  renderer: any
  ctx: REGL.Regl
  rasterTexture: REGL.Texture2D
  rootStore: RootStore

  constructor ({
    ctx,
    rasterTexture,
    rootStore,
  }: {
    ctx: REGL.Regl,
    rasterTexture: REGL.Texture2D,
    rootStore?: RootStore,
  }) {
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
        imagesWide: this.rootStore.textureRastersWide,
        imageSize: this.rootStore.rasterSizePercent.array,
        raster: this.rasterTexture,
        rasterBBoxMeters: ctx.prop<IProps, 'rasterBBoxMeters'>('rasterBBoxMeters'),
        atlasSize: constants.DATA_TEXTURE_SIZE,
        timePeriod: ctx.prop<IProps, 'timePeriod'>('timePeriod'),
        scale: ctx.prop<IProps, 'scale'>('scale'),
      },
      count: ctx.prop<IProps, 'trianglesLength'>('trianglesLength'),
    })

    reaction(() => ({
      timePeriod: this.rootStore.timePeriod,
    }), this.renderCanvasGL.bind(this))
  }

  renderCanvasGL () {
    this.ctx.poll()
    this.ctx.clear({ color: [0, 0, 0, 1] })

    const mercator = this.rootStore.getViewport()

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
