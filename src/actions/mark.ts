import Arc from './arc'
import * as PIXI from 'pixi.js'
import { getPoint2PointInfo } from '@/utils/utils'
import type { markType } from '@/stores/types'
import type { ExtendContainer, ExtendGraphics, IExtendAttribute, IExtremePoint, IPoint, ISize } from './types'

let container: ExtendContainer
let customInfo: IExtendAttribute

/**
 * 获取端点的大小
 * @param distance 长度
 */
const getSize = (
  distance: number,
  direction: 'left' | 'right'
): ISize => {
  const length = distance < 100
    ? distance / 10 * 3
    : 40
  const base = direction === 'right' ? -1 : 1
  return {
    w: length * base,
    h: length / 3
  }
}

/**
 * 获取端点控制点
 * @param type 端点样式
 * @param param1 端点大小
 * @returns 
 */
const getVertexData = (
  type: markType,
  {w, h}: ISize
): number[] => {
  switch (type) {
    case 'arrow': {
      return [
        0, 0, w / 2, -h / 2, w, -h,
        0, 0, w / 2, h / 2, w, h
      ]
    }
    case 'line': {
      return [
        0, -h, 0, 0, 0, h
      ]
    }
    default: return []
  }
}

export function drawExtremePoint (
  this: Arc,
  {
    elm,
    type,
    direction,
  }: IExtremePoint
) {
  if (type === 'none') return
  // 获取最后一次的控制点
  const [x, y, , , toX, toY] = customInfo.vertexData.slice(-6)
  const { width, distance, angle } = getPoint2PointInfo({ x, y }, { x: toX, y: toY })
  let position: IPoint
  if (direction === 'right') {
    position = width > 0 ? { x: toX, y: toY } : { x, y }
  } else {
    position = width > 0 ? { x, y } : { x: toX, y: toY }
  }
  const name = `extreme_point_elm_${direction}`
  let extremePointElm = <ExtendGraphics>elm.getChildByName(name)
  if (!extremePointElm) {
    extremePointElm = new PIXI.Graphics()
    extremePointElm.name = name
    extremePointElm.position.set(position.x, position.y)
    extremePointElm.rotation = angle
    elm.addChild(extremePointElm)
  }
  const size = getSize(distance, direction)
  const vertexData = getVertexData(type, size)
  extremePointElm.customVertexData = vertexData
  this.drawStroke(extremePointElm, vertexData)
}

class Mark extends Arc {
  drawMark (mX: number, mY: number) {
    container = this.container as ExtendContainer
    customInfo = container.customInfo as IExtendAttribute
    const { drawType, styleConfig: { extremePoint_left, extremePoint_right } } = customInfo
    const { width, height } = getPoint2PointInfo(this.startPoints, { x: mX, y: mY })
    // 贝塞尔曲线点位信息 x, y, cpX, cpY, toX, toY
    const vertexData = [
      0, 0, width / 2, height / 2, width, height
    ]
    customInfo.vertexData = vertexData
    const markElm = this.createElement()
    if (drawType === 'straightLine') {
      customInfo.styleConfig.extremePoint_left = 'none'
      customInfo.styleConfig.extremePoint_right = 'none'
    } else {
      customInfo.styleConfig.extremePoint_right = 'arrow'
    }
    drawExtremePoint.call(this, {
      elm: markElm,
      type: extremePoint_left,
      direction: 'left',
    })
    drawExtremePoint.call(this, {
      elm: markElm,
      type: extremePoint_right,
      direction: 'right'
    })
  }
}

export default Mark
