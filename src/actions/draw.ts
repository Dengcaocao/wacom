import Text from './text'
import { Graphics } from 'pixi.js'
import type { ExtendGraphics } from './types'

class Draw extends Text {
  paintingBrush (mX: number, mY: number) {
    const elmContainer = this.container as ExtendGraphics
    const main_graphics = elmContainer.getChildByName('main_graphics') as ExtendGraphics
    const paintingBrushElm: ExtendGraphics = main_graphics || new Graphics()
    elmContainer.addChild(paintingBrushElm)
    paintingBrushElm.name = 'main_graphics'
    paintingBrushElm.styleConfig = { ...this.styleConfig }
    this.drawStroke(paintingBrushElm, 0)
    const { x, y } = this.startPoints
    paintingBrushElm.moveTo(x - elmContainer.x, y - elmContainer.y)
    paintingBrushElm.lineTo(mX - elmContainer.x, mY - elmContainer.y)
    this.startPoints = { x: mX, y: mY }
  }
}

export default Draw
