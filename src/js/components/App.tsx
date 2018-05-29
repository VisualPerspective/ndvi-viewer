import * as React from 'react'
import Helmet from 'react-helmet'
import Header from './Header'
import Container from './Container'
import RootStore from '../models/RootStore'
import WindowStore from '../models/WindowStore'
import { Provider } from 'mobx-react'

const rootStore: RootStore = new RootStore()
const windowStore: WindowStore = new WindowStore()

const App = () => (
  <Provider rootStore={rootStore} windowStore={windowStore}>
    <Container />
  </Provider>
)

export default App
