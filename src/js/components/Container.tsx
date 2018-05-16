import * as React from 'react'
import Helmet from 'react-helmet'
import Header from './Header'
import SingleView from './SingleView'

const Container = () => (
  <>
    <Helmet title="Iceland NDVI">
      <link href="https://fonts.googleapis.com/css?family=Heebo:300,400,500" rel="stylesheet" />
    </Helmet>
    <Header />
    <SingleView />
  </>
)

export default Container
