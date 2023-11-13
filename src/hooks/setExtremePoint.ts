import pinia from '@/stores'
import * as PIXI from 'pixi.js'
import { useConfigStore } from '@/stores/config'
import { useStroke } from '@/hooks/stroke'
import { createOffsetArr } from '@/utils/utils'

const config = useConfigStore(pinia)
const { stroke } = useStroke()

const lineSegment = (
  graphics: PIXI.Graphics,
  mx: number,
  my: number,
  size: { x: number, y: number },
  offsetPoints: number[]
) => {
  graphics.moveTo(0, -size.y)
  graphics.lineTo(0, size.y)
  const vertex = [
    0, -size.y, 0, 0, 0, size.y
  ]
  stroke(graphics, vertex, offsetPoints)
}

const arrow = (
  graphics: PIXI.Graphics,
  size: { x: number, y: number },
  offsetPoints: number[]
) => {
  graphics.moveTo(0, 0)
  graphics.lineTo(size.x, -size.y)
  graphics.moveTo(0, 0)
  graphics.lineTo(size.x, size.y)
  const vertex = [
    0, 0, size.x / 2, -size.y / 2, size.x, -size.y,
    0, 0, size.x / 2, size.y / 2, size.x, size.y
  ]
  stroke(graphics, vertex, offsetPoints)
}

export const useSetExtremePoint = (CreateSceen: any) => {
  const type = 'line' // arrow
  CreateSceen.prototype.setExtremePoint = function (mx: number, my: number) {
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    // 获取图形在容器中位置，并设置随机偏移点
    const index = this.ghContainer.getChildIndex(graphics)
    this.ghContainer.offsetPoints[index] = this.ghContainer.offsetPoints[index] || createOffsetArr(2, 3)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    const width = mx - x, height = my - y
    // 方向
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
    type === 'line'
      ? lineSegment(graphics, mx, my, size, this.ghContainer.offsetPoints[index])
      : arrow(graphics, size, this.ghContainer.offsetPoints[index])
  }
}
