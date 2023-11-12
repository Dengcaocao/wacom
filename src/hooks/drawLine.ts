import * as PIXI from 'pixi.js'
import { useStroke } from '@/hooks/stroke'

const { stroke } = useStroke()

export const useDrawLine = (CreateSceen: any) => {

  CreateSceen.prototype.drawLine = function (mx: number, my: number, type: string = 'line') {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    const width = mx - x, height = my - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      x, y, x + width / 2, y + height / 2, mx, my
    ];
    (this.ghContainer as any).points = this.points
      .map((item: any, index: number) => {
        const vertexIndex = index % vertex.length
        return item + vertex[vertexIndex]
      });
    graphics.moveTo(x, y)
    graphics.lineTo(mx, my)
    if (type === 'arrow') {
      // 箭头方向
      const direction = width < 0 ? -1 : 1
      // 旋转角度
      let deg = Math.atan2(height, height)
      if (direction === -1) {
        deg = height < 0 ? -Math.PI + deg : Math.PI + deg
      }
      graphics.rotation = deg
      graphics.moveTo(mx, my)
      graphics.lineTo(mx - 20, my - 8)
      graphics.moveTo(mx, my)
      graphics.lineTo(mx - 20, my + 8)
    }
    stroke(graphics, this.ghContainer.points)
    this.fillBgColor(graphics)
    graphics.endFill()
  }
}
