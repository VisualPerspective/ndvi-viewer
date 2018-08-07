import * as React from 'react'
import { observer, inject } from 'mobx-react'
import MouseElement from '@app/components/MouseElement'
import TouchElement from '@app/components/TouchElement'
import SizedElement from '@app/components/SizedElement'
import SingleView from '@app/components/SingleView'
import RootStore from '@app/models/RootStore'

const SingleViewContainer = ({ rootStore }: { rootStore?: RootStore }) => (
  <SizedElement className='single-view' render={({ width, height }) => (
    <MouseElement render={({
      previousMousePosition,
      mousePosition,
      dragging,
      startDragging,
    }) => (
      <TouchElement pinchHandler={(ratio: number) => {
          rootStore.camera.zoom += (ratio - 1) / 10
        }}
        render={({
          pinching,
          pinchScale,
          panning,
          previousPanPosition,
          panPosition,
        }) => (
          <SingleView
            width={width}
            height={height}
            previousMousePosition={previousMousePosition}
            mousePosition={mousePosition}
            dragging={dragging}
            startDragging={startDragging}
            pinching={pinching}
            pinchScale={pinchScale}
            panning={panning}
            previousPanPosition={previousPanPosition}
            panPosition={panPosition} />
        )} />
    )} />
  )} />
)

export default inject('rootStore')(observer(SingleViewContainer))
