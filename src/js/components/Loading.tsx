import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'

const Loading: React.SFC<{ rootStore?: RootStore }> = ({ rootStore }) => (
  <div className='loading'>
    <svg className='progress-bar'>
      <text x='50%' y={-12}>Loading...</text>
      <rect className='progress-bar-background' rx={3} ry={3}
        x={0} y={0} width='100%' height='100%' />
      <rect className='progress-bar-bar' rx={3} ry={3}
        x={0} y={0} width={`${rootStore.percentLoaded}%`} height='100%' />
    </svg>
  </div>
)

export default inject('rootStore')(observer(Loading))
