import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore(pinia)

export const useStroke = () => {
  /**
   * 描边绘制
   * @param graphics 图形对象
   * @param points 顶点信息
   */
  const stroke = (graphics: PIXI.Graphics, points: number[]) => {
    graphics.lineStyle({
      width: config.context.strokeWidth,
      color: config.context.strokeColor,
      alpha: config.context.alpha
    })
    for (let i = 0; i < points.length; i+=6) {
      const [x, y, cpX, cpY, toX, toY] = points.slice(i, i+6)
      graphics.moveTo(x, y)
      graphics.quadraticCurveTo(cpX, cpY, toX, toY)
    }
  }
  return { stroke }
}
