import * as PIXI from 'pixi.js'
import { usePixiApp } from './drawInstantce'
const { CreateSceen } = usePixiApp()
console.log(CreateSceen.prototype)

export const useDrawRect = () => {
  CreateSceen.prototype.drawRect = function (mx: number, my: number) {
    const graphics = new PIXI.Graphics()
    this.app.stage.addChild(graphics)
    const { x, y } = this.downPoint
    graphics.drawPolygon([
      x, y,
      mx, y,
      mx, my,
      x, my
    ])
  }
  return {}
}
