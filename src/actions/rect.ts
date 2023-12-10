import { Polygon } from 'pixi.js'
import Base from './base'
import type { ExtendContainer, IExtendAttribute } from './types'

class Rect extends Base {
  drawRect (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const container = <ExtendContainer>this.container
    const customInfo = <IExtendAttribute>container.customInfo
    const w = mX - x, h = mY - y
    const vertexData = [
      0, 0, w / 2, 0, w, 0,
      w, 0, w, h / 2, w, h,
      w, h, w / 2, h, 0, h,
      0, h, 0, h / 2, 0, 0
    ]
    customInfo.vertexData = vertexData
    const rectElm = this.createElement()
    rectElm.hitArea = new Polygon(vertexData)
  }
}

export default Rect
