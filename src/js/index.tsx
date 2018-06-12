require('es6-promise/auto')

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from '@app/components/App'

require('@scss/styles.scss')

const div = document.createElement('div')
div.className = 'container'
document.body.appendChild(div)

ReactDOM.render(
  <App />,
  div
)
