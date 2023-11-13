import * as PIXI from 'pixi.js'
import { type LineSegmentType } from '@/stores/config'
import { useStroke } from '@/hooks/stroke'
import { createOffsetArr } from '@/utils/utils'

const { stroke } = useStroke()

/**
 * 获取端点的大小
 * @param width 线的宽度
 * @param height 线的高度
 */
const getSize = (width: number, height: number) => {
  const direction = width < 0 ? 1 : -1
  return  Math.abs(width) < 100 && Math.abs(height) < 100
      ? { x: 20 * direction, y: 8 }
      : { x: 30 * direction, y: 15 }
}

/**
 * 端点-线条
 * @param graphics 图形对象
 * @param size 端点大小信息
 * @param offsetPoints 偏移量
 */
const lineSegment = (
  graphics: PIXI.Graphics,
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

/**
 * 端点-箭头
 * @param graphics 图形对象
 * @param size 端点大小信息
 * @param offsetPoints 偏移量
 * @param direction 方向
 */
const arrow = (
  graphics: PIXI.Graphics,
  size: { x: number, y: number },
  offsetPoints: number[],
  direction: number
) => {
  graphics.moveTo(0, 0)
  graphics.lineTo(size.x * direction, -size.y)
  graphics.moveTo(0, 0)
  graphics.lineTo(size.x * direction, size.y)
  const vertex = [
    0, 0, size.x / 2 * direction, -size.y / 2, size.x * direction, -size.y,
    0, 0, size.x / 2 * direction, size.y / 2, size.x * direction, size.y
  ]
  stroke(graphics, vertex, offsetPoints)
}

const methodsObj = {
  arrow,
  lineSegment
}

export const useSetExtremePoint = (CreateSceen: any) => {
  CreateSceen.prototype.setExtremePoint = function (
    { x, y }: { x: number, y: number},
    width: number,
    height: number,
    deg: number,
    { direction, type}: { direction: string, type: LineSegmentType }
  ) {
    if (type === 'none') return
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    graphics.x = x
    graphics.y = y
    graphics.rotation = deg
    // 获取图形在容器中位置，并设置随机偏移点
    const index = this.ghContainer.getChildIndex(graphics)
    this.ghContainer.offsetPoints[index] =
      this.ghContainer.offsetPoints[index] ||
      createOffsetArr(type ==='arrow' ? 2 : 1, 3)
    this.setGraphicsStyle(graphics)
    const size = getSize(width, height)
    methodsObj[type] && methodsObj[type](
      graphics, size,
      this.ghContainer.offsetPoints[index],
      direction === 'left' ? -1 : 1
    )
  }
}
