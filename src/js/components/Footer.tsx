import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action, observable, reaction, IReactionDisposer } from 'mobx'
import { strings } from '../constants'
import SizedElement from './SizedElement'
import MouseElement from './MouseElement'
import TimeSeries from './TimeSeries'
import WindowStore from '../models/WindowStore'

class Footer extends React.Component<{
  windowStore?: WindowStore,
}, any> {
  render () {
    return (
      <footer>
        <SizedElement className="horizontal-chart" render={({ width, height }) => (
          <MouseElement render={({ mousePosition, dragging, startDragging }) => (
            <TimeSeries
              width={width}
              height={height}
              mousePosition={mousePosition}
              dragging={dragging}
              startDragging={startDragging} />
          )} />
        )} />
      </footer>
    )
  }
}

export default inject('rootStore', 'windowStore')(observer(Footer))
