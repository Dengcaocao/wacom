import * as PIXI from 'pixi.js'
import createDashedTexture from '@/texture/dashed'

/**
 * 设置鼠标样式
 * @param graphics 
 * @param index 
 * @returns 
 */
const setCursor = (graphics: PIXI.Graphics, index: number) => {
  switch (true) {
    case [0, 4].includes(index): {
      return graphics.cursor = 'ew-resize'
    }
    case [2, 6].includes(index): {
      return graphics.cursor = 'ns-resize'
    }
    case [1, 5].includes(index): {
      return graphics.cursor = 'nwse-resize'
    }
    case [3, 7].includes(index): {
      return graphics.cursor = 'nesw-resize'
    }
  }
}

const controlPoint = (
  container: PIXI.Graphics,
  width: number,
  height: number
) => {
  // 操控点大小
  const size = 8
  width += size / 2
  height += size / 2
  // 原点到顶点的弧度
  const radian = Math.atan(height / width)
  // 剩余的弧度
  const residueRadian = Math.PI / 2 - radian
  // 从负 radian 开始，没两个切换增加的弧度 1)
  let sumRadian = -radian
  // 绘制操控点
  new Array(8)
    .fill(8)
    .forEach((_, index: number) => {
      const child = new PIXI.Graphics()
      container.addChild(child)
      setCursor(child, index)
      const baseAngle = index % 4 <= 1 ? radian : residueRadian // 1)
      sumRadian += baseAngle
      const r = Math.pow(width * width + height * height, 1/2)
      let x = Math.cos(sumRadian) * r
      let y = Math.sin(sumRadian) * r
      // 边界值判断
      if (x < -width || x > width) {
        x = x < 0 ? -width : width
      }      
      if (y < -height || y > height) {
        y = y < 0 ? -height : height
      }
      child.position.set(x, y)
      child.beginFill(0xffffff, 0.8)
      child.lineStyle({
        width: 1,
        color: 0x000000
      })
      child.drawRect(-size / 2, -size / 2, size, size)
    })
}

export default (pixiContainer: PIXI.Container) => {
  pixiContainer.getBounds()
  const geometry = (pixiContainer.children[0] as PIXI.Graphics).geometry
  const { minX, minY, maxX, maxY } = geometry.bounds
  const width = maxX - minX,
        height = maxY - minY,
        halfWidth = width / 2,
        halfHeight = height / 2
  const graphics = new PIXI.Graphics()
  pixiContainer.addChild(graphics)
  graphics.beginFill(0, 0)
  graphics.lineTextureStyle({
    width: 1,
    texture: createDashedTexture(width, height)
  })
  graphics.position.set(minX + halfWidth, minY + halfHeight)
  graphics.scale.set(1.1)
  graphics.drawPolygon([
    -halfWidth, -halfHeight,
    halfWidth, -halfHeight,
    halfWidth, halfHeight,
    -halfWidth, halfHeight
  ])
  controlPoint(graphics, halfWidth, halfHeight)
}