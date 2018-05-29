import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { strings } from '../constants'
import RootStore from '../models/RootStore'

class Footer extends React.Component<{
  rootStore?: RootStore,
}, any> {
  render () {
    const { rootStore } = this.props

    return (
      <footer>
        <svg className="slider">
          <line x1={0} y1={0} x2={0} y2={10} />
        </svg>
        <input type="range"
          min={0}
          max={rootStore.timePeriods - 1}
          value={rootStore.timePeriod}
          onChange={e => {
            rootStore.timePeriod = Number(e.target.value)
          }} />
      </footer>
    )
  }
}

export default inject('rootStore')(observer(Footer))
