import CompleteApp from './draw'
import installAppEvent from '@/event/appEvent'
import type { IBaseParams } from './types'

class Application extends CompleteApp {
  constructor (params: IBaseParams) {
    super(params)
    installAppEvent.call(this, this.app.stage)
  }
}

export default Application
