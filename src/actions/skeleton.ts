import * as PIXI from 'pixi.js'

export default (pixiContainer: PIXI.Container) => {
  pixiContainer.getBounds()
  const geometry = (pixiContainer.children[0] as PIXI.Graphics).geometry
  const { minX, minY, maxX, maxY } = geometry.bounds
  const width = maxX - minX,
        height = maxY - minY,
        halfWidth = width / 2,
        halfHeight = height / 2
  const graphics = new PIXI.Graphics()
  const lineStyle = new PIXI.LineStyle()
  lineStyle.width = 1
  lineStyle.color = 0x000000
  pixiContainer.addChild(graphics)
  graphics.beginFill(0, 0)
  graphics.lineStyle({
    width: 1,
    color: 0x00
  })
  graphics.position.set(minX + halfWidth, minY + halfHeight)
  graphics.scale.set(1.1)
  graphics.drawPolygon([
    -halfWidth, -halfHeight,
    halfWidth, -halfHeight,
    halfWidth, halfHeight,
    -halfWidth, halfHeight
  ])
  new Array(8)
    .fill(0)
    .forEach((_, index: number) => {
      const child = new PIXI.Graphics()
      graphics.addChild(child)
      child.rotation = index * Math.PI / 4
      child.position.set(halfWidth, 0)
      child.lineStyle({
        width: 1,
        color: 0x00
      })
      child.drawRect(-4, -4, 8, 8)
    })
  console.log(graphics)
}