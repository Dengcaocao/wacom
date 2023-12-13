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
      customInfo.vertexData.push(x - container.x, y - container.y)
    }
    customInfo.vertexData.push(mX - container.x, mY - container.y)
    this.drawStroke(main_graphics)
    // main_graphics.moveTo(x - container.x, y - container.y)
    // main_graphics.lineTo(mX - container.x, mY - container.y)
    // this.startPoints = { x: mX, y: mY }
  }
}

export default Draw
