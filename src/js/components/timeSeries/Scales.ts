import {
  scaleLinear,
  scalePoint,
  scaleSequential,
  scaleBand,
  range,
} from 'd3'

import {
  interpolateViridis,
  interpolateBrBG,
} from 'd3-scale-chromatic'

import constants from '@app/constants'

export const makeYScaleNDVI = ({ height, margin }: {
  height: number,
  margin: any,
}) => (
  scaleLinear()
    .domain([-0.2, 1.0])
    .range([height - margin.bottom, margin.top])
)

export const makeYScaleNDVIAnomaly = ({ height, margin }: {
  height: number,
  margin: any,
}) => (
  scaleLinear()
    .domain([-1.2, 1.2])
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

export const makeColorScaleNDVI = () =>
  scaleSequential(interpolateViridis).domain([-0.2, 1.0])

export const makeColorScaleNDVIAnomaly = () =>
  scaleSequential(interpolateBrBG).domain([-1.2, 1.2])
