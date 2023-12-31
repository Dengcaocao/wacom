import Selected from './selected'
import type { ExtendContainer, IExtendAttribute } from './types'

class Diamond extends Selected {
  drawDiamond (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const container = <ExtendContainer>this.container
    const customInfo = <IExtendAttribute>container.customInfo
    const w = mX - x, h = mY - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertexData = [
      0, h / 2, w / 4, h / 4, w / 2, 0,
      w / 2, 0, w * 3 / 4, h / 4, w, h / 2,
      w, h / 2, w * 3 / 4, h * 3 / 4, w / 2, h,
      w / 2, h, w / 4, h * 3 / 4, 0, h / 2
    ]
    customInfo.vertexData = vertexData
    this.createElement()
  }
}

export default Diamond
