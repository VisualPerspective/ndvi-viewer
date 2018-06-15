import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import SizedElement from '@app/components/SizedElement'
import MapComponent from '@app/components/MapComponent'

class SingleView extends React.Component<{
  rootStore?: RootStore
}, any> {
  render () {
    return (
      <article className='single-view'>
        <SizedElement className='container' render={({ width, height }) => (
          <MapComponent width={width} height={height} />
        )} />
      </article>
    )
  }
}

export default inject('rootStore')(observer(SingleView))
