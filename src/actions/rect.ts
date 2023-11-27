import { Polygon } from 'pixi.js'
import Base from './base'

class Rect extends Base {
  drawRect (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const w = mX - x, h = mY - y
    const vertex = [
      0, 0, w / 2, 0, w, 0,
      w, 0, w, h / 2, w, h,
      w, h, w / 2, h, 0, h,
      0, h, 0, h / 2, 0, 0
    ]
    const rectElm = this.createElement(vertex, 4)
    rectElm.hitArea = new Polygon(vertex)
  }
}

export default Rect
