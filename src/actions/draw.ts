import Text from './text'
import { Graphics } from 'pixi.js'
import type { ExtendContainer } from './types'

class Draw extends Text {
  paintingBrush (mX: number, mY: number) {
    const container = this.container as ExtendContainer
    let main_graphics = container.getChildByName('main_graphics') as Graphics
    if (!main_graphics) {
      main_graphics = new Graphics()
      main_graphics.name = 'main_graphics'
      container.addChild(main_graphics)
    }
    this.drawStroke(main_graphics)
    const { x, y } = this.startPoints
    main_graphics.moveTo(x - container.x, y - container.y)
    main_graphics.lineTo(mX - container.x, mY - container.y)
    this.startPoints = { x: mX, y: mY }
  }
}

export default Draw
