import * as PIXI from 'pixi.js'
import { useStroke } from '@/hooks/stroke'

const { stroke } = useStroke()

export const useDrawRect = (CreateSceen: any) => {

  CreateSceen.prototype.drawRect = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    const width = mx - x, height = my - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      x, y, x + width / 2, y, mx, y,
      mx, y, mx, y + height / 2, mx, my,
      mx, my, x + width / 2, my, x, my,
      x, my, x, y + height / 2, x, y
    ];
    (this.ghContainer as any).points = this.points
      .map((item: any, index: number) => {
        const vertexIndex = index % vertex.length
        return item + vertex[vertexIndex]
      });
    graphics.drawPolygon([
      x, y,
      mx, y,
      mx, my,
      x, my
    ])
    stroke(graphics, this.ghContainer.points)
    this.fillBgColor(graphics)
    graphics.endFill()
  }
}
