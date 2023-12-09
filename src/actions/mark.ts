import Arc from './arc'
import * as PIXI from 'pixi.js'
import { getAngle } from '@/utils/utils'
import type { ExtendContainer, IExtendAttribute, IExtremePoint } from './types'

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
  const { x, y } = getSize(distance, direction)
  const vertex = type === 'arrow'
    ? [
        0, 0, x / 2, -y / 2, x, -y,
        0, 0, x / 2, y / 2, x, y
      ]
    : [
        0, -y, 0, 0, 0, y
      ]
  this.drawStroke(graphics, vertex)
}

class Mark extends Arc {
  drawMark (mX: number, mY: number) {
    const container = this.container as ExtendContainer
    const { drawType, styleConfig } = container.customInfo as IExtendAttribute
    const { extremePoint_left, extremePoint_right} = styleConfig
    const { width: w, height: h, distance, angle } = getAngle(this.startPoints, { x: mX, y: mY })
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertex = [
      0, 0, w / 2, h / 2, w, h
    ]
    const markElm = this.createElement(vertex)
    if (drawType === 'straightLine') {
      styleConfig.extremePoint_left = 'none'
      styleConfig.extremePoint_right = 'none'
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
