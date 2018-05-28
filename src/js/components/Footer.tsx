import * as React from 'react'
import { strings } from '../constants'
import { inject, observer } from 'mobx-react'
import RootStore from '../models/RootStore'

const Footer = ({ rootStore } : { rootStore?: RootStore }) => (
  <footer>
    <input type="range"
      min={0}
      max={rootStore.timePeriods - 1}
      value={rootStore.timePeriod}
      onChange={e => {
        rootStore.timePeriod = Number(e.target.value)
      }}/>
  </footer>
)

export default inject('rootStore')(observer(Footer))
