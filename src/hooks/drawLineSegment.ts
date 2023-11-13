import * as PIXI from 'pixi.js'
import { useStroke } from '@/hooks/stroke'
import { createOffsetArr } from '@/utils/utils'

const { stroke } = useStroke()

export const useDrawLineSegment = (CreateSceen: any) => {
  CreateSceen.prototype.drawLineSegment = function (
    mx: number,
    my: number,
    type: string = 'line'
  ) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    // 获取图形在容器中位置，并设置随机偏移点
    const index = this.ghContainer.getChildIndex(graphics)
    this.ghContainer.offsetPoints[index] = this.ghContainer.offsetPoints[index] || createOffsetArr(1)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    const width = mx - x, height = my - y
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      x, y, x + width / 2, y + height / 2, mx, my
    ]
    graphics.moveTo(x, y)
    graphics.lineTo(mx, my)
    type === 'arrow' && this.setExtremePoint(mx, my)
    stroke(graphics, vertex, this.ghContainer.offsetPoints[index])
    graphics.endFill()
  }
}
