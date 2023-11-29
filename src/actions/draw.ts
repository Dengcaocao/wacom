import Text from './text'
import { Container, Graphics } from 'pixi.js'
import type { ExtendGraphics } from './types'

class Draw extends Text {
  paintingBrush (mX: number, mY: number) {
    this.container = this.container || new Container()
    this.app.stage.addChild(this.container)
    const main_graphics = this.container.getChildByName('main_graphics') as ExtendGraphics
    const paintingBrushElm: ExtendGraphics = main_graphics || new Graphics()
    this.drawStroke(paintingBrushElm, 0)
    paintingBrushElm.name = 'main_graphics'
    paintingBrushElm.styleConfig = this.styleConfig
    this.container.addChild(paintingBrushElm)
    const { x, y } = this.startPoints
    paintingBrushElm.moveTo(x, y)
    paintingBrushElm.lineTo(mX, mY)
    this.startPoints = { x: mX, y: mY }
  }
}

export default Draw
