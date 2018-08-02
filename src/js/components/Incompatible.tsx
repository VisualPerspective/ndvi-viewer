import * as React from 'react'
import { inject, observer } from 'mobx-react'
import constants, { strings } from '@app/constants'
import RootStore from '@app/models/RootStore'
import Heading from '@app/components/Heading'

const Incompatible = ({ rootStore }: { rootStore?: RootStore }) => (
  <div className='centered-content'>
    <div className='incompatible'>
      <Heading />
      <p>
        {strings.APP_NAME} does not support certain
        browsers or mobile devices yet.
        Try Chrome, Firefox, or Edge.
        Also, you can <a href={constants.BLOG_URL}>
        read about this project</a> on our blog.
      </p>
    </div>
  </div>
)

export default inject('rootStore')(observer(Incompatible))
