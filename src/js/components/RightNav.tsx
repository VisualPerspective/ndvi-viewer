import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import Heading from '@app/components/Heading'
import Logo from '@app/components/Logo'
import Times from '@app/components/icons/Times'
import Bars from '@app/components/icons/Bars'

const RightNav = ({ rootStore }: { rootStore?: RootStore }) => (
  <div className={`right-nav ${rootStore.moreInfoOpen ? 'open' : ''}`}
    onClick={() => { rootStore.moreInfoOpen = !rootStore.moreInfoOpen }}>
    <Heading />
    <span>
      {
        rootStore.moreInfoOpen
          ? <Times />
          : <Bars />
      }
      <span className='button-label'>More Info</span>
    </span>
    <Logo />
  </div>
)

export default inject('rootStore')(observer(RightNav))
