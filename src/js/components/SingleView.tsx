import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '../models/RootStore'
import RasterLayer from  '../gl/RasterLayer'

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
    const { rootStore } = this.props

    return (
      <>
        <article className="single-view">
          <canvas ref={
            canvas => { this.canvas = canvas }
          }></canvas>
        </article>
        <footer>
          <input type="range"
            min={0}
            max={rootStore.timePeriods - 1}
            value={rootStore.timePeriod}
            onChange={e => {
              rootStore.timePeriod = Number(e.target.value)
            }}/>
        </footer>
      </>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
