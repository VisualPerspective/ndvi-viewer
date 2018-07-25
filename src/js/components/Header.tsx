import * as React from 'react'
import { strings } from '@app/constants'
import ModeSelect from '@app/components/ModeSelect'

const Header = () => (
  <header>
    <h1>
      <img src='/img/vegetation.svg' />
      {strings.HEADING}
    </h1>
    <div>
      <ModeSelect />
    </div>
    <a className='logo' href='https://visualperspective.io'>
      <img src='/img/vplogo.svg' />
    </a>
  </header>
)

export default Header
