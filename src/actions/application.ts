import CompleteApp from './copy'
import installAppEvent from '@/event/appEvent'
import { installKeyboardEvent } from '@/keyboard/key'
import type { IBaseParams } from './types'

class Application extends CompleteApp {
  keys: string[]
  constructor (params: IBaseParams) {
    super(params)
    this.keys = []
    installAppEvent.call(this)
    installKeyboardEvent.call(this)
  }
}

export default Application
