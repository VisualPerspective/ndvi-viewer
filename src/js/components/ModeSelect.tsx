import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore, { Modes } from '@app/models/RootStore'

const ModeSelect: React.SFC<{ rootStore?: RootStore }> = ({ rootStore }) => (
  <select value={rootStore.mode}
    onChange={(e: any) => {
      rootStore.mode = e.target.value
    }}>
    <option value={Modes.NDVI}>{Modes.NDVI}</option>
    <option value={Modes.NDVI_GROUPED}>{Modes.NDVI_GROUPED}</option>
  </select>
)

export default inject('rootStore')(observer(ModeSelect))
