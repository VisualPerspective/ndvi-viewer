import * as React from 'react'
import Container from '@app/components/Container'
import RootStore from '@app/models/RootStore'
import { Provider } from 'mobx-react'

const rootStore: RootStore = new RootStore()

const App = () => (
  <Provider rootStore={rootStore}>
    <Container />
  </Provider>
)

export default App
