import * as PIXI from 'pixi.js'

interface IPoint {
  x: number
  y: number
}

export const useFillBgColor = (CreateSceen: any) => {
  CreateSceen.prototype.fillBgColor = function (movePoint: IPoint) {
    const graphics = new PIXI.Graphics()
    this.ghContainer.addChild(graphics)
    graphics.lineStyle({
      width: 1,
      color: 0xff0000,
      alpha: 1
    })
    const { x: sX, y: sY } = this.downPoint
    const { x: mX, y: mY } = movePoint
    const width = Math.abs(mX - sX)
    const height = Math.abs(mY - sY)
    const arr = []
    for (let i = 10; i < width; i+=10) {
      const y = i / width * height
      arr.push(sX + i, sY, sX, sY + y)
      arr.push(mX - i, mY, mX, mY - y)
    }
    for (let i = 0; i < arr.length; i+=4) {
      const [x, y, toX, toY] = arr.slice(i, i+4)
      graphics.moveTo(x, y)
      graphics.lineTo(toX, toY)
    }
  }
}
