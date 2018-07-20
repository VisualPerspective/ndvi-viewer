import * as React from 'react'
import { strings } from '@app/constants'
import ModeSelect from '@app/components/ModeSelect'

const Header = () => (
  <header>
    <h1>{strings.HEADING}</h1>
    <ModeSelect />
  </header>
)

export default Header
