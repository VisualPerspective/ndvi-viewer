import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'

const Zoom: React.SFC<{ rootStore?: RootStore }> = ({ rootStore }) => (
  <div className='zoom'>
    <label>
      <span>Zoom</span>
      <input type='range' step='any' min={0} max={1}
        value={rootStore.camera.zoom}
        onChange={(e: any) => {
          rootStore.camera.zoom = Number(e.target.value)
        }} />
    </label>
  </div>
)

export default inject('rootStore')(observer(Zoom))
