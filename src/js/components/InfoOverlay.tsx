import * as React from 'react'
import { inject, observer } from 'mobx-react'
import RightNav from '@app/components/RightNav'
import constants from '@app/constants'

const InfoOverlay = ({ rootStore }: { rootStore?: RootStore }) => (
  <div className='info-overlay'>
    <div className='overlay' onClick={() => {
      rootStore.moreInfoOpen = false
    }} />
    <div className='info'>
      <RightNav />
      <div className='right-nav-items'>
        <a href={constants.BLOG_URL}>
          <i>i</i> Read about this project and NDVI
        </a>
        <a href={constants.BLOG_URL}>
          <i>i</i> Read about NDVI anomaly
        </a>
        <a href={constants.BLOG_URL}>
          <i>i</i> View the source on GitHub
        </a>
      </div>
    </div>
  </div>
)

export default inject('rootStore')(observer(InfoOverlay))
