const EARTH_CIRCUMFERENCE: number = 6371007 * Math.PI * 2;

export const sinusoidalToLngLat = (
  { x, y }: { x: number, y: number }
) => {
  const normalizedY: number = y / EARTH_CIRCUMFERENCE * 2 + 0.5;
  const scaledX: number = x / Math.sin(Math.PI * normalizedY)
  const normalizedX: number = scaledX / EARTH_CIRCUMFERENCE * 2 + 0.5
  return {
    x: (normalizedX - 0.5) * 180,
    y: (normalizedY - 0.5) * 180
  }
}

export const translate = (x:number, y:number) => (
  `translate(${x} ${y})`
)
