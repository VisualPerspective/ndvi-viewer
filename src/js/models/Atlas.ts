import axios from 'axios'
import { observable } from 'mobx'

class Atlas {
  data: Uint8Array
  config: any
  @observable loadProgress: number = 0

  async initialize ({
    url,
    configUrl,
  }: {
    url: string
    configUrl: string
  }) {
    const configResponse = await axios.get(configUrl)

    this.config = configResponse.data

    const atlasResponse = await axios.get(url, {
      responseType: 'arraybuffer',
      onDownloadProgress: (e: any) => {
        this.loadProgress = Math.min(
          e.loaded /
          this.config.approximateDownloadSize *
          100,
          100
        )
      },
    })

    this.data = new Uint8Array(atlasResponse.data)
  }
}

export default Atlas
