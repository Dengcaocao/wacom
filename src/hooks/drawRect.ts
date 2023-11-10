import * as PIXI from 'pixi.js'

const computedScalePoint = (arr: number[]) => arr.map(item => item)

export const useDrawRect = (CreateSceen: any) => {
  CreateSceen.prototype.drawRect = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    graphics.beginFill(0xff0000, 1)
    const { x, y } = this.downPoint
    graphics.drawPolygon(computedScalePoint([
      x, y,
      mx, y,
      mx, my,
      x, my
    ]))
    graphics.endFill()
  }
}
