import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import RasterLayer from  '@app/gl/RasterLayer'

class SingleView extends React.Component<{
  rootStore?: RootStore
}, any> {
  rasterLayer: RasterLayer
  canvas: HTMLCanvasElement

  renderLayer () {
    this.rasterLayer.render()
  }

  componentDidMount () {
    this.rasterLayer = new RasterLayer({
      canvas: this.canvas,
      rootStore: this.props.rootStore
    })

    this.renderLayer()
    window.addEventListener('resize', this.renderLayer.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.renderLayer.bind(this))
  }

  render () {
    return (
      <article className="single-view">
        <canvas ref={
          canvas => { this.canvas = canvas }
        }></canvas>
      </article>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
