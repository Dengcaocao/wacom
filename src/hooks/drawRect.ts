import * as PIXI from 'pixi.js'

interface IPoint {
  x: number
  y: number
}

/**
 * 朴素风格
 * @param graphics 图形对象 
 * @param downPoint 鼠标按下点
 * @param movePoint 鼠标移动点
 */
const simpleStyle = (graphics: PIXI.Graphics, downPoint: IPoint, movePoint: IPoint) => {
  const { x, y } = downPoint
  const { x: mx, y: my } = movePoint
  graphics.beginFill(0xff0000, 1)
  graphics.drawPolygon([
    x, y,
    mx, y,
    mx, my,
    x, my
  ])
  graphics.endFill()
}

/**
 * 手绘风格
 * @param graphics 
 * @param downPoint 
 * @param movePoint 
 */
const handDrawnStyle = (graphics: PIXI.Graphics, points: number[]) => {
  graphics.lineStyle({
    width: 1,
    color: 0x000000,
    alpha: 1
  })
  for (let i = 0; i < points.length; i+=6) {
    const [x, y, cpX, cpY, toX, toY] = points.slice(i, i+6)
    graphics.moveTo(x, y)
    graphics.quadraticCurveTo(cpX, cpY, toX, toY)
  }
}

export const useDrawRect = (CreateSceen: any) => {
  CreateSceen.prototype.drawRect = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    // simpleStyle(graphics, this.downPoint, {x: mx, y: my})
    handDrawnStyle(graphics, this.points)
    this.fillBgColor({ x: mx, y: my })
    // this.ghContainer.x = x
    // this.ghContainer.y = y
  }
}
