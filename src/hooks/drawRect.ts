import * as PIXI from 'pixi.js'
import { type ExtendGraphics } from '@/hooks/drawInstantce'
import { useStroke } from '@/hooks/stroke'
import { createOffsetArr } from '@/utils/utils'

const { stroke } = useStroke()

export const useDrawRect = (CreateSceen: any) => {

  CreateSceen.prototype.drawRect = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics: ExtendGraphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    // 获取图形在容器中位置，并设置随机偏移点
    const index = this.ghContainer.getChildIndex(graphics)
    this.ghContainer.offsetPoints[index] = this.ghContainer.offsetPoints[index] || createOffsetArr(4)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    const width = mx - x, height = my - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      x, y, x + width / 2, y, mx, y,
      mx, y, mx, y + height / 2, mx, my,
      mx, my, x + width / 2, my, x, my,
      x, my, x, y + height / 2, x, y
    ]
    graphics.drawPolygon([
      x, y,
      mx, y,
      mx, my,
      x, my
    ])
    this.fillBgColor(graphics, vertex)
    stroke(graphics, vertex, this.ghContainer.offsetPoints[index])
    graphics.endFill()
  }
}
