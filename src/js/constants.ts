import * as REGL from 'regl'

export const strings = {
  HEADING: 'Iceland Vegetation',
  APP_NAME: 'Iceland Vegetation viewer',
  MODE_SELECT_LABEL: 'View:',
}

export enum Modes {
  NDVI = 'NDVI',
  NDVI_GROUPED = 'NDVI By Month',
  NDVI_ANOMALY = 'NDVI Anomaly',
  NDVI_ANOMALY_GROUPED = 'NDVI Anomaly By Month',
}

const NDVI_CONFIG = {
  ATLAS: process.env.NDVI_ATLAS,
  ATLAS_CONFIG: 'atlas/ndvi.atlas.json',
  Y_TICKS: [ -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0 ],
  RANGE: [-0.2, 1.0],
  CHART_RANGE: [-0.2, 1.0],
  NO_DATA_COLOR: [0.2, 0.2, 0.2, 1.0],
  SELECTED_COLOR: [1, 1, 1, 1],
  UNSELECTED_COLOR: [0.6, 0.6, 0.6, 1],
  DATA_LABEL: 'NDVI',
  LEGEND_OFFSET: 155,
}

const NDVI_ANOMALY_CONFIG = {
  ATLAS: process.env.NDVI_ANOMALY_ATLAS,
  ATLAS_CONFIG: 'atlas/ndvi-anomaly.atlas.json',
  Y_TICKS: [ -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6 ],
  RANGE: [-1.2, 1.2],
  CHART_RANGE: [-0.6, 0.6],
  NO_DATA_COLOR: [1, 1, 1, 1],
  SELECTED_COLOR: [0.4, 0.4, 0.4, 1],
  UNSELECTED_COLOR: [0.6, 0.6, 0.6, 1],
  DATA_LABEL: 'NDVI anomaly',
  LEGEND_OFFSET: 195,
}

export default {
  BLOG_URL: 'https://visualperspective.io/blog/iceland-ndvi-viewer',
  BLOG_ANOMALY_URL: 'https://visualperspective.io/blog/ndvi-anomaly',
  GITHUB_URL: 'https://github.com/VisualPerspective/ndvi-viewer',
  CONTACT_US_URL: 'https://visualperspective.io/contact',
  VECTOR_URL: '/geojson/vectors.json',
  DATA_TEXTURE_SIZE: 4096,
  NO_DATA_THRESHOLD: 0.001,
  NO_DATA_VALUE: 0,
  TILE_SIZE: 512,
  MONTHS: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ],
  START_YEAR: 2001,
  START_TIME_PERIOD: 6,
  SELECTED_BOX_PADDING: 20,
  PROFILE: JSON.parse(process.env.PROFILE),
  MODE_CONFIGS: {
    [Modes.NDVI]: {
      ...NDVI_CONFIG,
    },
    [Modes.NDVI_GROUPED]: {
      ...NDVI_CONFIG,
    },
    [Modes.NDVI_ANOMALY]: {
      ...NDVI_ANOMALY_CONFIG,
    },
    [Modes.NDVI_ANOMALY_GROUPED]: {
      ...NDVI_ANOMALY_CONFIG,
    },
  },
  DATA_TEXTURE_OPTIONS: ({
    type: 'float',
    format: 'rgba',
    min: 'nearest',
    mag: 'nearest',
    mipmap: false,
    wrapS: 'clamp',
    wrapT: 'clamp',
    flipY: false,
  } as REGL.Texture2DOptions),
  DATA_SQUARE_POSITIONS: [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, -1],
    [1, 1],
    [-1, 1],
  ],
  GL_EXTENSIONS: [
    'OES_texture_float',
    'OES_element_index_uint',
  ],
}
