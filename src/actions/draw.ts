import Text from './text'
import { Graphics } from 'pixi.js'
import type { ExtendContainer, IExtendAttribute } from './types'

class Draw extends Text {
  paintingBrush (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const container = <ExtendContainer>this.container
    const customInfo = <IExtendAttribute>container.customInfo
    let main_graphics = container.getChildByName('main_graphics') as Graphics
    if (!main_graphics) {
      main_graphics = new Graphics()
      main_graphics.name = 'main_graphics'
      container.addChild(main_graphics)
      customInfo.vertexData.push(0, 0)
    }
    customInfo.vertexData.push(mX - x, mY - y)
    this.drawStroke(main_graphics)
  }
}

export default Draw
