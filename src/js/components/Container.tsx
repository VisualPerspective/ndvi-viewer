import * as React from 'react'
import Helmet from 'react-helmet'
import { inject, observer } from 'mobx-react'
import Header from './Header'
import Footer from './Footer'
import SingleView from './SingleView'
import RootStore from '../models/RootStore'

const Container: React.SFC<{ rootStore?: RootStore }> = (props) => (
  props.rootStore.initialized ? (
    <>
      <Helmet title="Iceland NDVI">
        <link href="https://fonts.googleapis.com/css?family=Heebo:300,400,500" rel="stylesheet" />
      </Helmet>
      <Header />
      <SingleView />
      <Footer />
    </>
  ) : (
    <div className="loading"></div>
  )
)

export default inject('rootStore')(observer(Container))
