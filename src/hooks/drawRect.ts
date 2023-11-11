import * as PIXI from 'pixi.js'

interface IPoint {
  x: number
  y: number
}

const offset = () => Math.random() * 10 - 5

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
const handDrawnStyle = (graphics: PIXI.Graphics, downPoint: IPoint, movePoint: IPoint) => {
  const { x, y } = downPoint
  const { x: mx, y: my } = movePoint
  const width = mx - x
  const height = my - y
  graphics.lineStyle({
    width: 1,
    color: 0x000000,
    alpha: 1
  })
  graphics.moveTo(x + offset(), y + offset())
  graphics.quadraticCurveTo(x + width/2, y + offset(), mx, y)
  graphics.moveTo(x + offset(), y + offset())
  graphics.quadraticCurveTo(x + width/2, y + offset(), mx, y)

  graphics.moveTo(mx + offset(), y + offset())
  graphics.quadraticCurveTo(mx, y + height/2, mx + offset(), my + offset())
  graphics.moveTo(mx + offset(), y + offset())
  graphics.quadraticCurveTo(mx, y + height/2, mx + offset(), my + offset())

  graphics.moveTo(mx + offset(), my + offset())
  graphics.quadraticCurveTo(x + width/2, my + offset(), x, my)
  graphics.moveTo(mx + offset(), my + offset())
  graphics.quadraticCurveTo(x + width/2, my + offset(), x, my)

  graphics.moveTo(x + offset(), my + offset())
  graphics.quadraticCurveTo(x, y + height/2, x + offset(), y + offset())
  graphics.moveTo(x + offset(), my + offset())
  graphics.quadraticCurveTo(x, y + height/2, x + offset(), y + offset())
}

export const useDrawRect = (CreateSceen: any) => {
  CreateSceen.prototype.drawRect = function (mx: number, my: number) {
    this.ghContainer.removeChildren()
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    // simpleStyle(graphics, this.downPoint, {x: mx, y: my})
    handDrawnStyle(graphics, this.downPoint, {x: mx, y: my})
    // this.ghContainer.x = x
    // this.ghContainer.y = y
  }
}
