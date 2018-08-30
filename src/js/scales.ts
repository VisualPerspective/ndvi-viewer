import {
  scaleLinear,
  scalePoint,
  scaleSequential,
  scaleBand,
  range,
  color,
  interpolateBrBG,
  easeQuadInOut,
} from 'd3'

import * as _ from 'lodash'

import {
  interpolateViridis,
} from 'd3-scale-chromatic'

import constants, { Modes } from '@app/constants'

export const makeYScaleNDVI = ({ height, margin }: {
  height: number,
  margin: any,
}) => (
  scaleLinear()
    .domain(constants.MODE_CONFIGS[Modes.NDVI].CHART_RANGE)
    .range([height - margin.bottom, margin.top])
)

export const makeYScaleNDVIAnomaly = ({ height, margin }: {
  height: number,
  margin: any,
}) => (
  scaleLinear()
    .domain(constants.MODE_CONFIGS[Modes.NDVI_ANOMALY].CHART_RANGE)
    .range([height - margin.bottom, margin.top])
)

export const makeXScale = ({ numTimePeriods, width, margin }: {
  numTimePeriods: number,
  width: number,
  margin: any,
}) => (
  scalePoint()
    .domain(range(-2, numTimePeriods))
    .range([
      margin.left,
      width - margin.right,
    ])
)

export const makeXScaleSortedBands = ({ width, margin }: {
  width: number,
  margin: any,
}) => (
  scaleBand()
    .domain(constants.MONTHS)
    .range([margin.left, width - margin.right])
    .padding(0.15)
)

export const makeXScaleSorted = ({ numTimePeriods, width, margin }: {
  numTimePeriods: number,
  width: number,
  margin: any,
}) => {
  const bands = makeXScaleSortedBands({ width, margin })

  const scale: any = (i: number) => {
    const n = numTimePeriods
    const month = i % 12
    const year = Math.floor(i / 12)
    const years = Math.floor(n / 12)

    return bands(constants.MONTHS[month]) +
      (bands.bandwidth() * (year) / (years - 1))
  }

  scale.step = () => (
    bands.bandwidth() /
    (numTimePeriods / 12)
  )

  return scale
}

// Creates an array of 9 interpolated vec4 colors for a d3
// color scale interpolator. These can be passed into the
// colorScale shader.
export const glColors = (interpolate: any) => (
  _.times(9, (i: number) => {
    const interpolated = color(interpolate(i / 8))

    return [
      interpolated.r / 255,
      interpolated.g / 255,
      interpolated.b / 255,
      1.0,
    ]
  })
)

export const makeColorScaleNDVI = () =>
  scaleSequential(interpolateViridis).domain(
    constants.MODE_CONFIGS[Modes.NDVI].RANGE
  )

export const GL_COLORS_NDVI = glColors(interpolateViridis)

const interpolateNDVIAnomaly = (i: number) => (
  interpolateBrBG(easeQuadInOut(i))
)

export const makeColorScaleNDVIAnomaly = () =>
  scaleSequential(interpolateNDVIAnomaly).domain(
    constants.MODE_CONFIGS[Modes.NDVI_ANOMALY].RANGE
  )

export const GL_COLORS_NDVI_ANOMALY = glColors(interpolateNDVIAnomaly)
