import * as PIXI from 'pixi.js'

/**
 * 虚线纹理
 * @param w 图形宽度 
 * @param h 图形高度
 * @returns 
 */
export default function createDashedTexture(w: number, h: number) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = w
  canvas.height = h
  // 设置虚线的样式
  context.strokeStyle = '#000000'
  context.lineWidth = h / 10
  context.setLineDash([5, 5]) // 设置虚线的间隔
  // 绘制水平虚线
  context.beginPath()
  context.moveTo(0, h / 2)
  context.lineTo(w, h / 2)
  context.stroke()
  // 绘制垂直虚线
  context.lineWidth = w / 10
  context.beginPath()
  context.moveTo(w / 2, 0)
  context.lineTo(w / 2, h)
  context.stroke()
  return PIXI.Texture.from(canvas)
}
