import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { type ExtendGraphics } from '@/types/types'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore(pinia)

export const useStroke = () => {
  /**
   * 描边绘制
   * @param graphics 图形对象
   * @param vertex 顶点信息
   * @param offset 随机偏移大小
   */
  const stroke = (
    graphics: ExtendGraphics,
    vertex: number[] = [],
    offset: number[] = []
  ) => {
    // 记录点位消息
    const qcPoints = offset
      .map((item, index) => {
        const vertexIndex = index % vertex.length
        return item + vertex[vertexIndex]
      })
    graphics.qcPoints = qcPoints.length
      ? qcPoints
      : graphics.qcPoints
    if (config.context.lineStyle !== 'stroke') return
    graphics.lineStyle({
      width: config.context.strokeWidth,
      color: config.context.strokeColor,
      alpha: config.context.alpha,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND
    })
    for (let i = 0; i < (graphics.qcPoints as number[]).length; i+=6) {
      const [x, y, cpX, cpY, toX, toY] = (graphics.qcPoints as number[]).slice(i, i+6)
      graphics.moveTo(x, y)
      graphics.quadraticCurveTo(cpX, cpY, toX, toY)
    }
  }
  return { stroke }
}
