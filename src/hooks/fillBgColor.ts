import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import { getMaximum } from '@/utils/utils'
const config = useConfigStore(pinia)

export const useFillBgColor = (CreateSceen: any) => {
  CreateSceen.prototype.fillBgColor = function (graphics: PIXI.Graphics, vertex: number[]) {
    if (
      config.context.fillColor === 'transparent' ||
      config.context.fillStyle === 'fill'
    ) return
    graphics.lineStyle({
      width: 1,
      color: config.context.fillColor,
      alpha: config.context.alpha
    })
    const { minX, minY, maxX, maxY } = getMaximum(vertex)
    const width = maxX - minX, height = maxY - minY
    const arr = []
    const getRandomNum = () => Math.random() * 8 + 4
    const baseType: any = {
      rect: 1,
      diamond: 1/2,
      arc: 3/4
    }
    // 生成线段点
    const base = baseType[config.drawType]
    const endX = base * width
    // 循环结束值
    const endValue = 2 * width - (1 - base) * width
    for (let i = width - endX + getRandomNum(); i < endValue; i+=getRandomNum()) {
      let options = {
        x: minX + i,
        y: minY,
        toX: minX,
        toY: minY + i / endX * (height * base)
      }
      if (i > endX) {
        // 溢出图形宽高的距离
        const benefitX = (i - endX) * base
        const benefitY = benefitX / endX * (height * base)
        // 最终计算得到的x 和 toY
        const finalX = minX + endX + benefitX
        const finalToY = minY + height * base + benefitY
        options = {
          x: finalX > maxX ? maxX : finalX,
          y: options.y + benefitY,
          toX: minX + benefitX,
          toY: finalToY > maxY ? maxY : finalToY
        } 
      }
      arr.push(options.x, options.y, options.toX, options.toY)
    }
    for (let i = 0; i < arr.length; i+=4) {
      const [x, y, toX, toY] = arr.slice(i, i+4)
      graphics.moveTo(x, y)
      graphics.lineTo(toX, toY)
    }
  }
}
