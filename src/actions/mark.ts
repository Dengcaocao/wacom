import Arc from './arc'
import * as PIXI from 'pixi.js'
import type { IElementStyle } from '@/stores/types'
import { createOffsetArr, getAngle } from '@/utils/utils'
import type { ExtendContainer, IExtremePoint } from './types'

/**
 * 获取端点的大小
 * @param distance 长度
 */
const getSize = (distance: number, direction: string) => {
  const length = Math.abs(distance) < 100
    ? Math.abs(distance) / 10 * 4
    : 40
  let base = distance < 0 ? 1 : -1
  direction === 'left' && (base *= -1)
  return {
    x: length * base,
    y: length / 3
  }
}

function drawExtremePoint (
  this: Arc,
  {
    elm,
    type,
    point,
    direction,
    angle,
    distance
  }: IExtremePoint
) {
  const graphics = new PIXI.Graphics()
  graphics.position.set(point.x, point.y)
  graphics.rotation = angle
  elm.addChild(graphics)
  // offsetPoints 中存储了主图形的数据所以+1
  const index = elm.getChildIndex(graphics) + 1
  const container: ExtendContainer = elm.parent
  const offsetPoints = container.offsetPoints as number[][]
  offsetPoints[index] = offsetPoints[index] || createOffsetArr(type === 'arrow' ? 2 : 1)
  const { x, y } = getSize(distance, direction)
  const vertex = type === 'arrow'
    ? [
        0, 0, x / 2, -y / 2, x, -y,
        0, 0, x / 2, y / 2, x, y
      ]
    : [
        0, -y, 0, 0, 0, y
      ]
  this.drawStroke(graphics, index, vertex)
}

class Mark extends Arc {
  drawMark (mX: number, mY: number) {
    const { width: w, height: h, distance, angle } = getAngle(this.startPoints, { x: mX, y: mY })
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      0, 0, w / 2, h / 2, w, h
    ]
    const markElm = this.createElement(vertex, 1)
    const { drawType, extremePoint_left, extremePoint_right} = this.styleConfig as IElementStyle
    if (drawType === 'straightLine') {
      this.styleConfig.extremePoint_left = 'none'
      this.styleConfig.extremePoint_right = 'none'
    }
    extremePoint_left !== 'none' && drawExtremePoint.call(this, {
      elm: markElm,
      type: extremePoint_left,
      point: { x: 0, y: 0 },
      direction: 'left',
      angle,
      distance
    })
    extremePoint_right !== 'none' && drawExtremePoint.call(this, {
      elm: markElm,
      type: extremePoint_right,
      point: { x: w, y: h },
      direction: 'right',
      angle,
      distance
    })
  }
}

export default Mark
