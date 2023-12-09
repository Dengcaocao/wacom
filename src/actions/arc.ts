import { Ellipse, Graphics } from 'pixi.js'
import Diamond from './diamond'
import type { ExtendContainer, IExtendAttribute } from './types'

class Arc extends Diamond {
  drawArc (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const container = this.container as ExtendContainer
    const customInfo = container.customInfo as IExtendAttribute
    const { type, fillStyle } = customInfo.styleConfig
    const w = mX - x, h = mY - y
    /**
     * 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
     * +3/-3是为了形成闭合
     */
    const vertex = [
      0, h / 2 + 3, 0, 0, w / 2 + 3, 0,
      w / 2 - 3, 0, w, 0, w, h / 2 + 3,
      w, h / 2 - 3, w, h, w / 2 - 3, h,
      w / 2 + 3, h, 0, h, 0, h / 2 - 3
    ]
    const path: [number, number, number, number] = [w / 2, h / 2, Math.abs(w / 2), Math.abs(h / 2)]
    const arcElm = this.createElement(vertex)
    arcElm.hitArea = new Ellipse(...path)
    type === 'simple' && arcElm.drawEllipse(...path)
    const backgroundElm = this.container?.getChildByName('background_elm_left') as Graphics
    fillStyle === 'simple'
      ? backgroundElm?.drawEllipse(...path)
      : this.drawBackground(arcElm)
  }
}

export default Arc
