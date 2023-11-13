import * as PIXI from 'pixi.js'
import { useStroke } from '@/hooks/stroke'
import { createOffsetArr } from '@/utils/utils'

const { stroke } = useStroke()

export const useDrawDiamond = (CreateSceen: any) => {

  CreateSceen.prototype.drawDiamond = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    // 获取图形在容器中位置，并设置随机偏移点
    const index = this.ghContainer.getChildIndex(graphics)
    this.ghContainer.offsetPoints[index] = this.ghContainer.offsetPoints[index] || createOffsetArr(4)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    const width = mx - x, height = my - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      x + width / 2, y, x + width / 4 * 3, y + height / 4, mx, y + height / 2,
      mx, y + height / 2, x + width / 4 * 3, y + height / 4 * 3, x + width / 2, my,
      x + width / 2, my, x + width / 4, y + height / 4 * 3, x, y + height / 2,
      x, y + height / 2, x + width / 4, y + height / 4, x + width / 2, y
    ]
    graphics.drawPolygon([
      x + width / 2, y,
      mx, y + height / 2,
      x + width / 2, my,
      x, y + height / 2
    ])
    stroke(graphics, vertex, this.ghContainer.offsetPoints[index])
    this.fillBgColor(graphics)
    graphics.endFill()
  }
}
