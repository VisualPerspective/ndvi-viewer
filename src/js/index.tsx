import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Container from './components/Container'

require('../scss/styles.scss')

const div = document.createElement('div')
document.body.appendChild(div)

ReactDOM.render(
    <Container />,
    div
)
