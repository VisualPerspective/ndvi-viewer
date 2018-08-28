import * as REGL from 'regl'
import { mat4 } from 'gl-matrix'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'

import vert from '@app/gl/shaders/viewVert'
import frag from '@app/gl/shaders/viewFrag'

interface IUniforms {
  model: REGL.Mat4
  view: REGL.Mat4
  projection: REGL.Mat4
  raster: REGL.Texture2D
  mask: REGL.Texture2D
  imagesWide: number
  imageSize: number[]
  rasterBBoxMeters: number[]
  selectedBBoxLngLat: number[]
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
  selectedBBoxLngLat: number[]
  scale: number
  triangles: number[][]
  trianglesLength: number
  timePeriod: number
}

class RasterView {
  renderer: any
  ctx: REGL.Regl
  rasterTexture: REGL.Texture2D
  rasterMaskTexture: REGL.Texture2D
  rootStore: RootStore

  constructor ({
    ctx,
    rasterTexture,
    rasterMaskTexture,
    rootStore,
  }: {
    ctx: REGL.Regl,
    rasterTexture: REGL.Texture2D,
    rasterMaskTexture: REGL.Texture2D,
    rootStore?: RootStore,
  }) {
    this.ctx = ctx
    this.rasterTexture = rasterTexture
    this.rasterMaskTexture = rasterMaskTexture
    this.rootStore = rootStore

    this.renderer = ctx<IUniforms, IAttributes, IProps>({
      frag: frag({
        noDataThreshold: constants.NO_DATA_THRESHOLD,
        colorScale: 'interpolateBrBG',
      }),
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
        mask: this.rasterMaskTexture,
        rasterBBoxMeters: ctx.prop<IProps, 'rasterBBoxMeters'>('rasterBBoxMeters'),
        selectedBBoxLngLat: ctx.prop<IProps, 'selectedBBoxLngLat'>('selectedBBoxLngLat'),
        atlasSize: constants.DATA_TEXTURE_SIZE,
        timePeriod: ctx.prop<IProps, 'timePeriod'>('timePeriod'),
        scale: ctx.prop<IProps, 'scale'>('scale'),
      },
      count: ctx.prop<IProps, 'trianglesLength'>('trianglesLength'),
      blend: {
        enable: true,
        func: {
          src: 'src alpha',
          dst: 'one minus src alpha',
        },
      },
    })
  }

  render () {
    const triangles = this.rootStore.boundingBox.lngLatFromSinusoidal.triangles

    this.renderer({
      ...(this.rootStore.camera.renderInfo),
      timePeriod: this.rootStore.timePeriod,
      triangles,
      trianglesLength: triangles.length,
      rasterBBoxMeters: this.rootStore.boundingBox.array,
      selectedBBoxLngLat: this.rootStore.selectedBox.array,
    })
  }
}

export default RasterView
