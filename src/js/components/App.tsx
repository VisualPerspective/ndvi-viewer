import * as React from 'react'
import Helmet from 'react-helmet'
import Header from './Header'
import Container from './Container'
import RootStore from '../models/RootStore'
import { Provider } from 'mobx-react'

const rootStore: RootStore = new RootStore()

const App = () => (
  <Provider rootStore={rootStore}>
    <Container />
  </Provider>
)

export default App
