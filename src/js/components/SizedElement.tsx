import * as React from 'react'
import { observer } from 'mobx-react'
import { action, observable } from 'mobx'

class SizedElement extends React.Component<{
  className: string,
  render: ({}: {
    width: number,
    height: number,
  }) => React.ReactElement<any>
}, any> {
  container: HTMLDivElement
  @observable width: number
  @observable height: number

  componentDidMount () {
    this.handleSizeChange()
    window.addEventListener('resize', this.handleSizeChange)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleSizeChange)
  }

  @action handleSizeChange = () => {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
  }

  render () {
    return (
      <div className={this.props.className} ref={
        ref => this.container = ref
      }>
       {
         this.props.render({
           width: this.width,
           height: this.height,
         })
       }
      </div>
    )
  }
}

export default observer(SizedElement)
