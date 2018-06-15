import * as React from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import ReactMapGL from 'react-map-gl'
import RootStore from '@app/models/RootStore'
import RasterLayer from '@app/gl/RasterLayer'

class MapComponent extends React.Component<{
  width: number,
  height: number,
  rootStore?: RootStore
}, any> {
  map: any
  rasterLayer: RasterLayer
  @observable customized = false

  customizeRenderer () {
    this.rasterLayer = new RasterLayer({
      gl: this.map.painter.context.gl,
      rootStore: this.props.rootStore,
    })

    const standardRender = this.map.painter.render
    this.map.painter.render = (...args: any[]) => {
      this.rasterLayer.rasterView.renderCanvasGL()
      standardRender.call(this.map.painter, ...args)
    }

    this.customized = true
  }

  render () {

    return (
      <ReactMapGL
        {...this.props.rootStore.viewport}
        width={this.props.width || 100}
        height={this.props.height || 100}
        mapboxApiAccessToken='pk.eyJ1Ijoia2oxMjM0NSIsImEiOiJjamllb2gwb20wb2Z0M2twZTl2aGttaHlxIn0.0JoeAePlpOWqX31yS8fgxA'
        onViewportChange={(viewport: any) => (
          this.props.rootStore.viewport = viewport
        )}
        ref={(reactMapGL: any) => {
          if (reactMapGL !== null) {
            this.map = reactMapGL.getMap()
            if (!this.customized) {
              this.customizeRenderer()
            }
          }
        }}
        onLoad={() => {
        }}
      />
    )
  }
}

export default inject('rootStore')(observer(MapComponent))
