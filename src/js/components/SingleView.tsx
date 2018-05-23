import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '../models/RootStore'
import RasterLayer from  '../gl/RasterLayer'

class SingleView extends React.Component<{
  rootStore?: RootStore
}, any> {
  rasterLayer: RasterLayer

  renderLayer () {
    this.rasterLayer.render()
  }

  componentDidMount () {
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
          canvas => {
            this.rasterLayer = new RasterLayer({
              canvas,
              rootStore: this.props.rootStore
            })
          }
        }></canvas>
      </article>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
