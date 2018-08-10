import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'

const Zoom: React.SFC<{ rootStore?: RootStore }> = ({ rootStore }) => (
  <div className='zoom'>
    <label>
      <img src='/img/fa-search-plus.svg' onClick={() => {
        rootStore.camera.zoom += 0.1
      }} />
      <input type='range' step='any' min={0} max={1}
        value={rootStore.camera.zoom}
        onChange={(e: any) => {
          rootStore.camera.zoom = Number(e.target.value)
        }} />
      <img className='bottom' src='/img/fa-search-minus.svg' onClick={() => {
        rootStore.camera.zoom -= 0.1
      }} />
    </label>
  </div>
)

export default inject('rootStore')(observer(Zoom))
