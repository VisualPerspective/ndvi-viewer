const EARTH_CIRCUMFERENCE: number = 6371007 * Math.PI * 2

export const sinusoidalToLngLat = (
  { x, y }: { x: number, y: number }
) => {
  const normalizedY: number = y / EARTH_CIRCUMFERENCE * 2 + 0.5
  const scaledX: number = x / Math.sin(Math.PI * normalizedY)
  const normalizedX: number = scaledX / EARTH_CIRCUMFERENCE * 2 + 0.5
  return {
    x: (normalizedX - 0.5) * 180,
    y: (normalizedY - 0.5) * 180,
  }
}

export const translate = (x: number, y: number) => (
  `translate(${x} ${y})`
)

export const debugImageFromArray = (
  { data, width, height }: { data: any, width: number, height: number }
) => {
  const rgbaArray = data.map((x: number, i: number) => (
    [
      x,
      x,
      x,
      255,
    ][i % 4]
  ))

  let canvas = (document.querySelector('.debug-image') as HTMLCanvasElement)
  if (canvas === null) {
    canvas = document.createElement('canvas')
    canvas.className = 'debug-image'
    document.body.appendChild(canvas)
  }

  const ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  const imageData = ctx.createImageData(width, height)
  imageData.data.set(rgbaArray)
  ctx.putImageData(imageData, 0, 0)
}

export const compensatedSquareUVs = ({ width, height }: {
  width: number,
  height: number
}) => {
  return [
    [-0.5, -0.5],
    [width - 0.5, -0.5],
    [width - 0.5, height - 0.5],
    [-0.5, -0.5],
    [width - 0.5, height - 0.5],
    [-0.5, height - 0.5],
  ]
}

export const uniformArrayAsObject = (name: string, array: any[]): any => {
  const object: any = {}
  array.forEach((entry, i) => {
    object[`${name}[${i}]`] = entry
  })

  return object
}
