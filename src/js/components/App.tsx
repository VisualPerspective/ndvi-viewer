import 'reflect-metadata'
import * as React from 'react'
import Container from '@app/components/Container'
import RootStore from '@app/models/RootStore'
import GLTest from '@app/gl/GLTest'
import { Provider } from 'mobx-react'

const rootStore: RootStore = new RootStore()

// Check for needed JS and GL features
try {
  // tslint:disable-next-line
  new GLTest()

  if (Array.prototype.find === undefined) {
    rootStore.compatible = false
  }
} catch (e) {
  rootStore.compatible = false
}

if (rootStore.compatible) {
  rootStore.initialize()
}

const App = () => (
  <Provider rootStore={rootStore}>
    <Container />
  </Provider>
)

export default App
