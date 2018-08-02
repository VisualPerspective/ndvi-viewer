import * as React from 'react'
import Helmet from 'react-helmet'
import { inject, observer } from 'mobx-react'
import { strings } from '@app/constants'
import Header from '@app/components/Header'
import Footer from '@app/components/Footer'
import SingleViewContainer from '@app/components/SingleViewContainer'
import Loading from '@app/components/Loading'
import Incompatible from '@app/components/Incompatible'
import RootStore from '@app/models/RootStore'

const Container: React.SFC<{ rootStore?: RootStore }> = (props) => (
  <>
    <Helmet title={strings.HEADING}>
      <link rel='icon' type='image/png' href='/img/favicon.png' />
      <link href='https://fonts.googleapis.com/css?family=Heebo:300,400,500' rel='stylesheet' />
    </Helmet>
    {
      props.rootStore.initialized ? (
        props.rootStore.compatible ? (
          <>
            <Header />
            <SingleViewContainer />
            <Footer />
          </>
        ) : (
          <Incompatible />
        )
      ) : (
        <Loading />
      )
    }
  </>
)

export default inject('rootStore')(observer(Container))
