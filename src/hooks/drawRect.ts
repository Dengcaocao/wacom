import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import { useStroke } from '@/hooks/stroke'

const config = useConfigStore(pinia)
const { stroke } = useStroke()

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
    config.context.lineStyle === 'stroke' && stroke(graphics, this.points)
    this.fillBgColor(graphics)
    graphics.endFill()
  }
}
