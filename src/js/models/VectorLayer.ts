import { observable } from 'mobx'
import earcut from 'earcut'

class VectorLayer {
  readonly outline = observable<number>([])
  readonly vertices = observable<number>([])
  readonly indices = observable<number>([])
  readonly holes = observable<number>([])
  @observable dimensions: number

  async initialize (url: string) {
    const response: Response = await window.fetch(url)
    const vectors = await response.json()

    vectors.geometry.coordinates.forEach((polygon: any) => {
      const data = earcut.flatten(polygon)
      const polygonOutline: number[] = []
      for (let i = 0; i < (data.vertices.length - 3); i += 2) {
        polygonOutline.push(data.vertices[i])
        polygonOutline.push(data.vertices[i + 1])
        polygonOutline.push(data.vertices[i + 2])
        polygonOutline.push(data.vertices[i + 3])
      }

      this.outline.replace(this.outline.concat(polygonOutline))
      this.vertices.replace(this.vertices.concat(data.vertices))
      this.holes.replace(this.vertices.concat(data.holes))
      this.dimensions = data.dimensions
      this.indices.replace(this.indices.concat(
        earcut(data.vertices, data.holes, data.dimensions)
      ))
    })
  }
}

export default VectorLayer
