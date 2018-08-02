import * as React from 'react'
import * as REGL from 'regl'
import Container from '@app/components/Container'
import RootStore from '@app/models/RootStore'
import constants from '@app/constants'
import { Provider } from 'mobx-react'

const rootStore: RootStore = new RootStore()

// Check for needed JS and GL features
try {
  const testContext = REGL({ extensions: constants.GL_EXTENSIONS })

  if (
    Array.prototype.find === undefined ||
    (testContext.limits as any).readFloat === false
  ) {
    rootStore.compatible = false
  }
} catch (e) {
  rootStore.compatible = false
}

const App = () => (
  <Provider rootStore={rootStore}>
    <Container />
  </Provider>
)

export default App
