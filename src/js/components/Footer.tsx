import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action, observable, reaction, IReactionDisposer } from 'mobx'
import { strings } from '../constants'
import SizedElement from './SizedElement'
import TimeSeries from './TimeSeries'
import RootStore from '../models/RootStore'
import WindowStore from '../models/WindowStore'

class Footer extends React.Component<{
  rootStore?: RootStore,
  windowStore?: WindowStore,
}, any> {
  render () {
    const { rootStore } = this.props

    return (
      <footer>
        <SizedElement className="horizontal-chart" render={(width, height) => (
          <TimeSeries width={width} height={height} />
        )} />
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

export default inject('rootStore', 'windowStore')(observer(Footer))
