import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore(pinia)

export const useDrawRect = (CreateSceen: any) => {
  CreateSceen.prototype.drawRect = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    graphics.drawPolygon([
      x, y,
      mx, y,
      mx, my,
      x, my
    ])
    graphics.endFill()
    if (config.context.lineStyle === 'stroke') {
      graphics.lineStyle({
        width: config.context.strokeWidth,
        color: config.context.strokeColor,
        alpha: config.context.alpha
      })
      for (let i = 0; i < this.points.length; i+=6) {
        const [x, y, cpX, cpY, toX, toY] = this.points.slice(i, i+6)
        graphics.moveTo(x, y)
        graphics.quadraticCurveTo(cpX, cpY, toX, toY)
      }
    }
    this.fillBgColor({ x: mx, y: my })
  }
}
