import * as React from 'react'
import { inject, observer } from 'mobx-react'
import constants from '@app/constants'
import RootStore from '@app/models/RootStore'
import RightNav from '@app/components/RightNav'
import Comment from '@app/components/icons/Comment'
import FileText from '@app/components/icons/FileText'
import GitHub from '@app/components/icons/GitHub'
import ModeSelect from '@app/components/ModeSelect'
import Logo from '@app/components/Logo'

const InfoOverlay = ({ rootStore }: { rootStore?: RootStore }) => (
  <div className='info-overlay'>
    <div className='overlay' onClick={() => {
      rootStore.moreInfoOpen = false
    }} />
    <div className='info'>
      <RightNav />
      <div className='right-nav-items'>
        <div className='mobile'><ModeSelect /></div>
        <a href={constants.BLOG_URL}>
          <FileText /> Learn about this project and NDVI
        </a>
        <a href={constants.BLOG_ANOMALY_URL}>
          <FileText /> Learn about NDVI anomaly
        </a>
        <a href={constants.GITHUB_URL}>
          <GitHub /> View the source on GitHub
        </a>
        <a href={constants.CONTACT_US_URL}>
          <Comment /> Contact us
        </a>
        <div className='mobile'><Logo /></div>
      </div>
    </div>
  </div>
)

export default inject('rootStore')(observer(InfoOverlay))
