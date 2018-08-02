import * as React from 'react'
import constants from '@app/constants'
import ModeSelect from '@app/components/ModeSelect'
import Heading from '@app/components/Heading'

const Header = () => (
  <header>
    <div>
      <Heading />
    </div>
    <div className='center'>
      <ModeSelect />
    </div>
    <div className='logo'>
      <a className='info' href={constants.BLOG_URL}>
        <i>i</i> Read about this project
      </a>
      <a href='https://visualperspective.io'>
        <img src='/img/vplogo.svg' />
      </a>
    </div>
  </header>
)

export default Header
