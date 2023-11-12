import * as PIXI from 'pixi.js'
import { useStroke } from '@/hooks/stroke'

const { stroke } = useStroke()

export const useDrawDiamond = (CreateSceen: any) => {

  CreateSceen.prototype.drawDiamond = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    const width = mx - x, height = my - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      x + width / 2, y, x + width / 4 * 3, y + height / 4, mx, y + height / 2,
      mx, y + height / 2, x + width / 4 * 3, y + height / 4 * 3, x + width / 2, my,
      x + width / 2, my, x + width / 4, y + height / 4 * 3, x, y + height / 2,
      x, y + height / 2, x + width / 4, y + height / 4, x + width / 2, y
    ];
    (this.ghContainer as any).points = this.points
      .map((item: any, index: number) => {
        const vertexIndex = index % vertex.length
        return item + vertex[vertexIndex]
      });
    graphics.drawPolygon([
      x + width / 2, y,
      mx, y + height / 2,
      x + width / 2, my,
      x, y + height / 2
    ])
    stroke(graphics, this.ghContainer.points)
    this.fillBgColor(graphics)
    graphics.endFill()
  }
}
