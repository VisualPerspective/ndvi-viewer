class Atlas {
  data: Float32Array
  config: any

  async initialize ({
    url,
    configUrl,
  }: {
    url: string
    configUrl: string
  }) {
    const configResponse: Response = await window.fetch(configUrl)
    this.config = await configResponse.json()

    const atlasResponse = await fetch(url)
    this.data = new Float32Array(await atlasResponse.arrayBuffer())

    // tslint:disable-next-line
    console.log(this.data.length)
  }
}

export default Atlas
