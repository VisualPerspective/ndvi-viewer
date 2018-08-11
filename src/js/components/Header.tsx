import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RootStore from '@app/models/RootStore'
import constants, { strings } from '@app/constants'
import ModeSelect from '@app/components/ModeSelect'
import Heading from '@app/components/Heading'

const Header = ({ rootStore }: { rootStore?: RootStore }) => (
  <header className={rootStore.menuOpen ? 'open' : ''}>
    <div className='nav'
      onClick={() => { rootStore.menuOpen = !rootStore.menuOpen }}>
      <Heading />
      <img src={
        rootStore.menuOpen ? '/img/fa-times.svg' : '/img/fa-bars.svg'
      } />
    </div>
    <div className='center'>
      {strings.MODE_SELECT_LABEL} <ModeSelect />
    </div>
    <a className='info half-width' href={constants.BLOG_URL}>
      <i>i</i> Read about this project
    </a>
    <div className='logo half-width'>
      <a href='https://visualperspective.io'>
        <img src='/img/vplogo.svg' />
      </a>
    </div>
  </header>
)

export default inject('rootStore')(observer(Header))
