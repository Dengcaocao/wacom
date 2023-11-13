import * as PIXI from 'pixi.js'
import { useStroke } from '@/hooks/stroke'
import { createOffsetArr } from '@/utils/utils'

const { stroke } = useStroke()

const arrow = function (
  this: any,
  mx: number,
  my: number
) {
  const graphics = new PIXI.Graphics()
  this.ghContainer.addChild(graphics)
  // 获取图形在容器中位置，并设置随机偏移点
  const index = this.ghContainer.getChildIndex(graphics)
  this.ghContainer.offsetPoints[index] = this.ghContainer.offsetPoints[index] || createOffsetArr(2, 3)
  this.setGraphicsStyle(graphics)
  const { x, y } = this.downPoint
  const width = mx - x, height = my - y
  // 箭头方向
  const direction = width < 0 ? -1 : 1
  // 旋转角度
  let deg = Math.atan2(height, width)
  if (direction === -1) {
    deg = height < 0 ? -Math.PI + deg : Math.PI + deg
  }
  const size = Math.abs(width) < 100 && Math.abs(height) < 100
      ? { x: 20 * direction * -1, y: 8 }
      : { x: 30 * direction * -1, y: 15 }
  graphics.x = mx
  graphics.y = my
  graphics.rotation = deg
  graphics.moveTo(0, 0)
  graphics.lineTo(size.x, -size.y)
  graphics.moveTo(0, 0)
  graphics.lineTo(size.x, size.y)
  const vertex = [
    0, 0, size.x / 2, -size.y / 2, size.x, -size.y,
    0, 0, size.x / 2, size.y / 2, size.x, size.y
  ]
  stroke(graphics, vertex, this.ghContainer.offsetPoints[index])
}

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
    type === 'arrow' && arrow.call(this, mx, my)
    stroke(graphics, vertex, this.ghContainer.offsetPoints[index])
    graphics.endFill()
  }
}
