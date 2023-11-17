import * as PIXI from 'pixi.js'

export const useDrawLine = (CreateSceen: any) => {

  CreateSceen.prototype.drawLine = function (mx: number, my: number) {
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    this.setGraphicsStyle(graphics)
    const { x, y } = this.downPoint
    graphics.moveTo(x, y)
    graphics.lineTo(mx, my)
    // 调用后才可获取bounds
    graphics.getBounds()
    const { minX, minY, maxX, maxY } = graphics.geometry.bounds
    const width = maxX - minX, height = maxY - minY
    // BUG 移动过快导致区域不对
    graphics.hitArea = new PIXI.Rectangle(
      minX - Math.abs(width) / 2 - 8,
      minY - Math.abs(height) / 2 - 8,
      16, 16
    )
    this.downPoint = { x: mx, y: my }
    graphics.endFill()
  }
}
