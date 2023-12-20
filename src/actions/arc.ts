import { Graphics } from 'pixi.js'
import Diamond from './diamond'
import type { ExtendContainer, IExtendAttribute } from './types'

class Arc extends Diamond {
  drawArc (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const container = this.container as ExtendContainer
    const customInfo = container.customInfo as IExtendAttribute
    const w = mX - x, h = mY - y
    const path: [number, number, number, number] = [w / 2, h / 2, Math.abs(w / 2), Math.abs(h / 2)]
    const vertexData = []
    /**
     * 创建一个空的图形对象，用于获取图形上的点
     */
    const emptyElm = new Graphics()
    emptyElm.drawEllipse(...path)
    emptyElm.getBounds()
    const points = emptyElm.geometry.graphicsData[0].points
    // 没12点取一条控制点
    for (let i = 0; i < points.length; i+=12) {
      const arr = points.slice(i, i+12)
      const [x, y] = arr.slice(0, 2)
      const [cpX, cpY] = arr.slice(arr.length/2, arr.length/2 + 2)
      const [toX, toY] = arr.slice(-2)
      vertexData.push(x, y, cpX, cpY, toX, toY)
    }
    vertexData.push(...points.slice(-4), points[0], points[1])
    customInfo.vertexData = vertexData
    this.createElement()
  }
}

export default Arc
