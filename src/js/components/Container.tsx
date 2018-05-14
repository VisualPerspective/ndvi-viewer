import * as React from 'react'
import Helmet from 'react-helmet'
import Header from './Header'

const Container = () => (
  <div className="container">
    <Helmet title="Iceland NDVI">
      <link href="https://fonts.googleapis.com/css?family=Heebo:300,400,500" rel="stylesheet" />
    </Helmet>
    <Header />
  </div>
)

export default Container
