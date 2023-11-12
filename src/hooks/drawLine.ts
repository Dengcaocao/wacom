import * as PIXI from 'pixi.js'
import { useStroke } from '@/hooks/stroke'

const { stroke } = useStroke()

export const useDrawLine = (CreateSceen: any) => {

  CreateSceen.prototype.drawLine = function (mx: number, my: number) {
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
    stroke(graphics, this.ghContainer.points)
    this.fillBgColor(graphics)
    graphics.endFill()
  }
}
