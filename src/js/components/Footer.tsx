import * as React from 'react'
import { observer } from 'mobx-react'
import SizedElement from '@app/components/SizedElement'
import MouseElement from '@app/components/MouseElement'
import TouchElement from '@app/components/TouchElement'
import Chart from '@app/components/timeSeries/Chart'

const Footer = () => (
  <footer>
    <SizedElement className='horizontal-chart' render={({ width, height }) => (
      <MouseElement render={({
        mouseTarget,
        dragging,
        startDragging,
      }) => (
        <TouchElement render={({
          touchTarget,
          panning,
        }) => (
          <Chart
            width={width}
            height={height}
            mouseTarget={mouseTarget}
            dragging={dragging}
            startDragging={startDragging}
            touchTarget={touchTarget}
            panning={panning} />
        )} />
      )} />
    )} />
  </footer>
)

export default observer(Footer)
