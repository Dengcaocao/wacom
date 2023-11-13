import * as PIXI from 'pixi.js'

export const useDrawLine = (CreateSceen: any) => {

  CreateSceen.prototype.drawLine = function (mx: number, my: number) {
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    graphics.moveTo(x, y)
    graphics.lineTo(mx, my)
    this.downPoint = { x: mx, y: my }
    graphics.endFill()
  }
}
