import { Polygon } from 'pixi.js'
import Base from './base'

class Rect extends Base {
  drawRect (mX: number, mY: number) {
    if (!this.isDraw) return
    const { x, y } = this.startPoints
    const w = mX - x, h = mY - y
    const vertex = [
      x, y, x + w / 2, y, mX, y,
      mX, y, mX, y + h / 2, mX, mY,
      mX, mY, x + w / 2, mY, x, mY,
      x, mY, x, y + h / 2, x, y
    ]
    const rect = this.createElement(4)
    this.initElementStyle(rect, this.styleConfig)
    rect.drawPolygon(vertex)
    this.handDrawStroke(rect, vertex)
    rect.hitArea = new Polygon(vertex)
  }
}

export default Rect
