import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import Times from '@app/components/icons/Times'
import Bars from '@app/components/icons/Bars'

const RightNav = ({ rootStore }: { rootStore?: RootStore }) => (
  <div className='right-nav'
    onClick={() => { rootStore.moreInfoOpen = !rootStore.moreInfoOpen }}>
    <span>
      {
        rootStore.moreInfoOpen
          ? <Times />
          : <Bars />
      }
      More Info
    </span>
    <div className='logo'>
      <a href='https://visualperspective.io'>
        <img src='/img/vplogo.svg' />
      </a>
    </div>
  </div>
)

export default inject('rootStore')(observer(RightNav))
