import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import { useStroke } from '@/hooks/stroke'
import { createOffsetArr, getMaximum, getAngle } from '@/utils/utils'

const config = useConfigStore(pinia)
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
    const { width, height, distance, angle } = getAngle(this.downPoint, { x: mx, y: my })
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      x, y, x + width / 2, y + height / 2, mx, my
    ]
    graphics.moveTo(x, y)
    graphics.lineTo(mx, my)
    if (type === 'arrow') {
      this.setExtremePoint(
        { x, y },
        width, height,
        angle,
        { 
          direction: 'left',
          type: config.context.extremePoint_left
        }
      )
      this.setExtremePoint(
        { x: mx, y: my },
        width, height,
        angle,
        { 
          direction: 'right',
          type: config.context.extremePoint_right
        }
      )
    }
    const { minX, minY, maxX, maxY } = getMaximum(vertex)
    // const g2 = new PIXI.Graphics()
    // this.setGraphicsStyle(g2)
    // g2.x = x
    // g2.y = y
    // g2.rotation = angle
    // g2.drawPolygon(0, 8, distance, 8, distance, -8, 0, -8)
    // this.ghContainer.addChild(g2)
    stroke(graphics, vertex, this.ghContainer.offsetPoints[index])
    // BUG 旋转后区域发生改变
    graphics.hitArea = new PIXI.Polygon([
      minX, minY + 8, maxX, maxY + 8, maxX, maxY - 8, minX, minY - 8
    ])
    graphics.endFill()
  }
}
