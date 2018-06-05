export const strings = {
  HEADING: 'Iceland NDVI',
}

export default {
  DATA_TEXTURE_SIZE: 4096,
  NO_DATA_THRESHOLD: -0.5,
  TILE_SIZE: 512,
  TIFF_URLS: [
    require('@assets/iceland_year.tif'),
  ],
  DATA_Y_TICKS: [ -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0 ],
  DATA_TEXTURE_OPTIONS: {
    type: 'float',
    format: 'rgba',
    min: 'nearest',
    mag: 'nearest',
    mipmap: false,
    wrapS: 'clamp',
    wrapT: 'clamp',
  },
  DATA_SQUARE_POSITIONS: [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, -1],
    [1, 1],
    [-1, 1],
  ],
  DATA_SQUARE_UVS: [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 0],
    [1, 1],
    [0, 1],
  ],
}
