import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action, observable, reaction, IReactionDisposer } from 'mobx'
import { strings } from '../constants'
import TimeSeries from './TimeSeries'
import RootStore from '../models/RootStore'
import WindowStore from '../models/WindowStore'

class SizedElement extends React.Component<{
  windowStore?: WindowStore,
  className: string,
  render: (width?: number, height?: number) => React.ReactElement<any>
}, any> {
  container: HTMLDivElement
  @observable width: number
  @observable height: number

  resizeReactionDisposer: IReactionDisposer

  componentDidMount () {
    this.handleSizeChange()
    this.resizeReactionDisposer = reaction(
      () => this.props.windowStore.size,
      () => this.handleSizeChange()
    )
  }

  componentWillUnmount () {
    this.resizeReactionDisposer()
  }

  @action handleSizeChange () {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
  }

  render () {
    return (
      <div className={this.props.className} ref={
        ref => this.container = ref
      }>
       { this.props.render(this.width, this.height) }
      </div>
    )
  }
}

export default inject('windowStore')(observer(SizedElement))
