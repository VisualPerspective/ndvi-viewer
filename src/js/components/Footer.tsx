import * as React from 'react'
import { observer } from 'mobx-react'
import SizedElement from '@app/components/SizedElement'
import MouseElement from '@app/components/MouseElement'
import Chart from '@app/components/timeSeries/Chart'

const Footer = () => (
  <footer>
    <SizedElement className='horizontal-chart' render={({ width, height }) => (
      <MouseElement render={({ mousePosition, dragging, startDragging }) => (
        <Chart
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
