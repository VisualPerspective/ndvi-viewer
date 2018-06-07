abstract class View {
  canvas: HTMLCanvasElement
  pendingRender: boolean = false

  constructor ({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
  }

  render () {
    const devicePixelRatio = window.devicePixelRatio || 1
    const newWidth = this.canvas.offsetWidth * devicePixelRatio
    const newHeight = this.canvas.offsetHeight * devicePixelRatio

    if (this.canvas.width !== newWidth ||
        this.canvas.height !== newHeight) {
      this.canvas.width = newWidth
      this.canvas.height = newHeight
    }

    if (!this.pendingRender) {
      this.pendingRender = true
      window.requestAnimationFrame(() => {
        this.pendingRender = false
        this.renderCanvasGL()
      })
    }
  }

  abstract renderCanvasGL (): void
}

export default View
