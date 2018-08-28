import * as REGL from 'regl'
import { mat4 } from 'gl-matrix'
import RootStore, { Modes } from '@app/models/RootStore'
import constants from '@app/constants'
import { uniformArrayAsObject } from '@app/utils'
import { GL_COLORS_NDVI, GL_COLORS_NDVI_ANOMALY } from '@app/scales'
import vert from '@app/gl/shaders/viewVert'
import frag from '@app/gl/shaders/viewFrag'

interface IUniforms {
  'model': REGL.Mat4
  'view': REGL.Mat4
  'projection': REGL.Mat4
  'raster': REGL.Texture2D
  'mask': REGL.Texture2D
  'imagesWide': number
  'imageSize': number[]
  'rasterBBoxMeters': number[]
  'selectedBBoxLngLat': number[]
  'atlasSize': number
  'timePeriod': number
  'scale': number
  'colors': number[][]
  'colors[0]': number[]
  'colors[1]': number[]
  'colors[2]': number[]
  'colors[3]': number[]
  'colors[4]': number[]
  'colors[5]': number[]
  'colors[6]': number[]
  'colors[7]': number[]
  'colors[8]': number[]
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
  'colors': number[][],
  'colors[0]': number[],
  'colors[1]': number[],
  'colors[2]': number[],
  'colors[3]': number[],
  'colors[4]': number[],
  'colors[5]': number[],
  'colors[6]': number[],
  'colors[7]': number[],
  'colors[8]': number[],
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
      }),
      vert: vert(),
      attributes: {
        position: ctx.prop<IProps, 'triangles'>('triangles'),
      },
      uniforms: {
        'model': mat4.fromTranslation([], [0, 0, 0]),
        'view': ctx.prop<IProps, 'view'>('view'),
        'projection': ctx.prop<IProps, 'projection'>('projection'),
        'imagesWide': this.rootStore.textureRastersWide,
        'imageSize': this.rootStore.rasterSizePercent.array,
        'raster': this.rasterTexture,
        'mask': this.rasterMaskTexture,
        'rasterBBoxMeters': ctx.prop<IProps, 'rasterBBoxMeters'>('rasterBBoxMeters'),
        'selectedBBoxLngLat': ctx.prop<IProps, 'selectedBBoxLngLat'>('selectedBBoxLngLat'),
        'atlasSize': constants.DATA_TEXTURE_SIZE,
        'timePeriod': ctx.prop<IProps, 'timePeriod'>('timePeriod'),
        'scale': ctx.prop<IProps, 'scale'>('scale'),
        'colors': ctx.prop<IProps, 'colors'>('colors'),
        'colors[0]': ctx.prop<IProps, 'colors[0]'>('colors[0]'),
        'colors[1]': ctx.prop<IProps, 'colors[1]'>('colors[1]'),
        'colors[2]': ctx.prop<IProps, 'colors[2]'>('colors[2]'),
        'colors[3]': ctx.prop<IProps, 'colors[3]'>('colors[3]'),
        'colors[4]': ctx.prop<IProps, 'colors[4]'>('colors[4]'),
        'colors[5]': ctx.prop<IProps, 'colors[5]'>('colors[5]'),
        'colors[6]': ctx.prop<IProps, 'colors[6]'>('colors[6]'),
        'colors[7]': ctx.prop<IProps, 'colors[7]'>('colors[7]'),
        'colors[8]': ctx.prop<IProps, 'colors[8]'>('colors[8]'),
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

    let modeUniforms
    switch (this.rootStore.mode) {
      case Modes.NDVI:
      case Modes.NDVI_GROUPED:
        modeUniforms = {
          colors: GL_COLORS_NDVI,
          ...uniformArrayAsObject('colors', GL_COLORS_NDVI),
        }
        break
      case Modes.NDVI_ANOMALY:
      case Modes.NDVI_ANOMALY_GROUPED:
        modeUniforms = {
          colors: GL_COLORS_NDVI_ANOMALY,
          ...uniformArrayAsObject('colors', GL_COLORS_NDVI_ANOMALY),
        }
    }

    this.renderer({
      ...(this.rootStore.camera.renderInfo),
      timePeriod: this.rootStore.timePeriod,
      triangles,
      trianglesLength: triangles.length,
      rasterBBoxMeters: this.rootStore.boundingBox.array,
      selectedBBoxLngLat: this.rootStore.selectedBox.array,
      ...modeUniforms,
    })
  }
}

export default RasterView
