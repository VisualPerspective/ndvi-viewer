import * as React from 'react'
import Helmet from 'react-helmet'
import Header from '@app/components/Header'
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
