import { observable } from 'mobx'
import earcut from 'earcut'
import * as _ from 'lodash'

class VectorLayer {
  readonly vertices = observable<number>([])
  readonly indices = observable<number>([])
  readonly holes = observable<number>([])
  @observable dimensions: number

  async initialize (url: string) {
    const response: Response = await window.fetch(url)

    // TODO: filter countries during build
    const countries = await response.json()
    const iceland = _.find(countries.features, (feature: any) => (
      feature.properties.ADM0_A3 === 'ISL'
    ))

    iceland.geometry.coordinates.forEach((polygon: any) => {
      const data = earcut.flatten(polygon)
      this.vertices.replace(this.vertices.concat(data.vertices))
      this.holes.replace(this.vertices.concat(data.holes))
      this.dimensions = data.dimensions
      this.indices.replace(this.indices.concat(
        earcut(data.vertices, data.holes, data.dimensions)
      ))
    })

    // tslint:disable-next-line
    console.log(this)
  }
}

export default VectorLayer
