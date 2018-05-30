import * as React from 'react'
import { observer } from 'mobx-react'
import SizedElement from './SizedElement'
import MouseElement from './MouseElement'
import TimeSeries from './TimeSeries'

const Footer = () => (
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

export default observer(Footer)
