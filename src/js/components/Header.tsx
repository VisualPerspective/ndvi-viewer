import * as React from 'react'
import { strings } from '@app/constants'
import ModeSelect from '@app/components/ModeSelect'

const Header = () => (
  <header>
    <div>
      <h1>
        <img src='/img/vegetation.svg' />
        {strings.HEADING}
      </h1>
    </div>
    <div className='center'>
      <ModeSelect />
    </div>
    <div className='logo'>
      <a className='info' href='https://visualperspective.io/blog/iceland'>
        <i>i</i> Read about this project
      </a>
      <a href='https://visualperspective.io'>
        <img src='/img/vplogo.svg' />
      </a>
    </div>
  </header>
)

export default Header
