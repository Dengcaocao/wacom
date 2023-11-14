import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore(pinia)

const getMaximum = (vertex: number[]) => {
  // 6 ==> (x, y, cpX, cpY, toX, toY)
  const points = vertex.filter((_, index) => [0, 1].includes(index % 6))
  const xArr = points.filter((_, index) => index % 2 === 0)
  const yArr = points.filter((_, index) => index % 2 === 1)
  return {
    minX: Math.min(...xArr),
    minY: Math.min(...yArr),
    maxX: Math.max(...xArr),
    maxY: Math.max(...yArr)
  }
}

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
    // BUG 当图形透明时，获取不到bounds
    
    const { minX, minY, maxX, maxY } = getMaximum(vertex)
    const width = maxX - minX, height = maxY - minY
    const arr = []
    const getRandomNum = () => Math.random() * 8 + 4
    // 生成线段点
    for (let i = getRandomNum(); i < width; i+=getRandomNum()) {
      const y = i / width * height
      arr.push(minX + i, minY, minX, minY + y)
      arr.push(maxX - i, maxY, maxX, maxY - y)
    }
    for (let i = 0; i < arr.length; i+=4) {
      const [x, y, toX, toY] = arr.slice(i, i+4)
      graphics.moveTo(x, y)
      graphics.lineTo(toX, toY)
    }
  }
}
