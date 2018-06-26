import * as React from 'react'
import { inject, observer } from 'mobx-react'
import Zoom from '@app/components/Zoom'
import RootStore from '@app/models/RootStore'
import GLManager from '@app/gl/GLManager'

class SingleView extends React.Component<{
  rootStore?: RootStore
}, any> {
  glManager: GLManager
  canvas: HTMLCanvasElement

  renderLayer () {
    this.glManager.render()
  }

  componentDidMount () {
    this.glManager = new GLManager({
      canvas: this.canvas,
      rootStore: this.props.rootStore,
    })

    this.renderLayer()
    window.addEventListener('resize', this.renderLayer.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.renderLayer.bind(this))
  }

  render () {
    return (
      <article className='single-view'>
        <canvas ref={
          canvas => { this.canvas = canvas }
        }></canvas>
        <Zoom />
      </article>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
