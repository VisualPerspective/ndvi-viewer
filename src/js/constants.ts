import * as REGL from 'regl'

export const strings = {
  HEADING: 'Iceland NDVI',
}

export default {
  VECTOR_URL: '/geojson/vectors.json',
  DATA_TEXTURE_SIZE: 4096,
  NO_DATA_THRESHOLD: -0.5,
  NO_DATA_VALUE: -1,
  TILE_SIZE: 512,
  START_YEAR: 2001,
  START_TIME_PERIOD: 6,
  TIFF_URLS: [
    require('@assets/rasters/modis_2001_NDVI.tif'),
    require('@assets/rasters/modis_2002_NDVI.tif'),
    require('@assets/rasters/modis_2003_NDVI.tif'),
    require('@assets/rasters/modis_2004_NDVI.tif'),
    require('@assets/rasters/modis_2005_NDVI.tif'),
    require('@assets/rasters/modis_2006_NDVI.tif'),
    require('@assets/rasters/modis_2007_NDVI.tif'),
    require('@assets/rasters/modis_2008_NDVI.tif'),
    require('@assets/rasters/modis_2009_NDVI.tif'),
    require('@assets/rasters/modis_2010_NDVI.tif'),
    require('@assets/rasters/modis_2011_NDVI.tif'),
    require('@assets/rasters/modis_2012_NDVI.tif'),
    require('@assets/rasters/modis_2013_NDVI.tif'),
    require('@assets/rasters/modis_2014_NDVI.tif'),
    require('@assets/rasters/modis_2015_NDVI.tif'),
    require('@assets/rasters/modis_2016_NDVI.tif'),
    require('@assets/rasters/modis_2017_NDVI.tif'),
  ],
  DATA_Y_TICKS: [ -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0 ],
  DATA_TEXTURE_OPTIONS: ({
    type: 'float',
    format: 'rgba',
    min: 'nearest',
    mag: 'nearest',
    mipmap: false,
    wrapS: 'clamp',
    wrapT: 'clamp',
    flipY: true,
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
