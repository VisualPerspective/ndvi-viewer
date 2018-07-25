import * as REGL from 'regl'

export const strings = {
  HEADING: 'Iceland Vegetation',
}

export default {
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
  SELECTED_BOX_PADDING: 25,
  ATLAS: process.env.ATLAS,
  ATLAS_CONFIG: 'atlas/ndvi.atlas.json',
  DATA_Y_TICKS: [ -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0 ],
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
}
