import {
  invokeScript,
  broadcast,
  nodeInteraction,
  waitForTx
} from '@waves/waves-transactions'
import { sha256, base58Encode, stringToBytes } from '@waves/waves-crypto'
import './components/app'

window.wc = {
  sha256,
  base58Encode,
  stringToBytes
}
window.wt = {
  invokeScript,
  broadcast,
  nodeInteraction,
  waitForTx
}
