import { Ellipse, Graphics } from 'pixi.js'
import Diamond from './diamond'

class Arc extends Diamond {
  drawArc (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const { type, fillStyle } = this.styleConfig
    const w = mX - x, h = mY - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      0, h / 2 + 3, 0, 0, w / 2 + 3, 0,
      w / 2 - 3, 0, w, 0, w, h / 2 + 3,
      w, h / 2 - 3, w, h, w / 2 - 3, h,
      w / 2 + 3, h, 0, h, 0, h / 2 - 3
    ]
    const path: [number, number, number, number] = [w / 2, h / 2, Math.abs(w / 2), Math.abs(h / 2)]
    const arcElm = this.createElement(vertex, 4)
    type === 'simple' && arcElm.drawEllipse(...path)
    if (fillStyle === 'simple') {
      const backgroundElm: Graphics | null = arcElm.getChildByName('background_elm')
      backgroundElm?.drawEllipse(...path)
    }
    arcElm.hitArea = new Ellipse(...path)
  }
}

export default Arc
