import * as React from 'react'
import { observer } from 'mobx-react'
import MouseElement from '@app/components/MouseElement'
import SizedElement from '@app/components/SizedElement'
import SingleView from '@app/components/SingleView'

const SingleViewContainer = () => (
  <SizedElement className='single-view' render={({ width, height }) => (
    <MouseElement render={({
      previousMousePosition,
      mousePosition,
      dragging,
      startDragging,
    }) => (
      <SingleView
        width={width}
        height={height}
        previousMousePosition={previousMousePosition}
        mousePosition={mousePosition}
        dragging={dragging}
        startDragging={startDragging} />
    )} />
  )} />
)

export default observer(SingleViewContainer)
