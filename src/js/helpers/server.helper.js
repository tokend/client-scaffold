import { Server, Network } from 'tokend-js-sdk'
import config from '../../config'

export function initHorizonServer () {
  Network.use(new Network(config.NETWORK_PASSPHRASE))
  return new Server(config.HORIZON_SERVER, { allowHttp: true })
}
