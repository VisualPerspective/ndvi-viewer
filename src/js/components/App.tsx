import * as React from 'react'
import * as REGL from 'regl'
import Container from '@app/components/Container'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'
import { Provider } from 'mobx-react'

const rootStore: RootStore = new RootStore()

// Check for needed JS features
if (Array.prototype.find === undefined) {
  rootStore.compatible = false
}

// Check for needed GL features
try {
  REGL({
    extensions: constants.GL_EXTENSIONS,
  })
} catch (e) {
  rootStore.compatible = false
}

const App = () => (
  <Provider rootStore={rootStore}>
    <Container />
  </Provider>
)

export default App
