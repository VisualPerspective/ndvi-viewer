import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import { strings } from '@app/constants'
import ModeSelect from '@app/components/ModeSelect'
import Heading from '@app/components/Heading'
import RightNav from '@app/components/RightNav'

const Header = ({ rootStore }: { rootStore?: RootStore }) => (
  <header className={rootStore.menuOpen ? 'open' : ''}>
    <div className='nav'>
      <Heading />
    </div>
    <div className='center'>
      {strings.MODE_SELECT_LABEL} <ModeSelect />
    </div>
    <RightNav />
  </header>
)

export default inject('rootStore')(observer(Header))
