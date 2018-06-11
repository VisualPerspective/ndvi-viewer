import * as React from 'react'
import Helmet from 'react-helmet'
import { inject, observer } from 'mobx-react'
import Header from '@app/components/Header'
import Footer from '@app/components/Footer'
import SingleView from '@app/components/SingleView'
import Loading from '@app/components/Loading'
import RootStore from '@app/models/RootStore'

const Container: React.SFC<{ rootStore?: RootStore }> = (props) => (
  <>
    <Helmet title='Iceland NDVI'>
      <link href='https://fonts.googleapis.com/css?family=Heebo:300,400,500' rel='stylesheet' />
    </Helmet>
    {
      props.rootStore.initialized ? (
        <>
          <Header />
          <SingleView />
          <Footer />
        </>
      ) : (
        <Loading />
      )
    }
  </>
)

export default inject('rootStore')(observer(Container))
