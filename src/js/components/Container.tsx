import * as React from 'react'
import Helmet from 'react-helmet'
import { inject, observer } from 'mobx-react'
import Header from './Header'
import SingleView from './SingleView'

interface ContainerProps {
  rootStore?: any
}

const Container: React.SFC<ContainerProps> = (props) => (
  props.rootStore.initialized ? (
    <>
      <Helmet title="Iceland NDVI">
        <link href="https://fonts.googleapis.com/css?family=Heebo:300,400,500" rel="stylesheet" />
      </Helmet>
      <Header />
      <SingleView />
    </>
  ) : (
    <div className="loading"></div>
  )
)

export default inject('rootStore')(observer(Container))
