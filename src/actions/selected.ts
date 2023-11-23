import * as PIXI from 'pixi.js'
import Rect from './rect'
import createDashedTexture from '@/texture/dashed'
import type { ExtendContainer } from '@/actions/types'

/**
 * 设置鼠标样式
 * @param childElm 
 * @param index 
 * @returns 
 */
const setCursor = (childElm: PIXI.Graphics, index: number) => {
  switch (true) {
    case [0, 4].includes(index): {
      return childElm.cursor = 'ew-resize'
    }
    case [2, 6].includes(index): {
      return childElm.cursor = 'ns-resize'
    }
    case [1, 5].includes(index): {
      return childElm.cursor = 'nwse-resize'
    }
    case [3, 7].includes(index): {
      return childElm.cursor = 'nesw-resize'
    }
  }
}

/**
 * 创建控制点
 * @param elm 图形装载器
 * @param width 图形宽度一半
 * @param height ...
 */
const controlPoint = (
  elm: PIXI.Graphics,
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
      const childElm = new PIXI.Graphics()
      elm.addChild(childElm)
      setCursor(childElm, index)
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
      childElm.position.set(x, y)
      childElm.beginFill(0xffffff, 0.8)
      childElm.lineStyle({
        width: 1,
        color: 0x000000
      })
      childElm.drawRect(-size / 2, -size / 2, size, size)
    })
}

class Selected extends Rect {
  drawSelected () {
    const elm = this.container as ExtendContainer
    const selectedElm = elm.getChildByName('selected') as PIXI.Graphics
    elm.removeChild(selectedElm)
    elm.getBounds()
    const main_graphics = elm.getChildByName('main_graphics') as PIXI.Graphics
    const { minX, minY, maxX, maxY } = main_graphics.geometry.bounds
    const width = maxX - minX,
          height = maxY - minY,
          halfWidth = width / 2,
          halfHeight = height / 2
    const selectedGraphics = new PIXI.Graphics()
    selectedGraphics.name = 'selected'
    elm.addChild(selectedGraphics)
    selectedGraphics.beginFill(0, 0)
    selectedGraphics.lineTextureStyle({
      width: 1,
      texture: createDashedTexture(width, height)
    })
    selectedGraphics.position.set(minX + halfWidth, minY + halfHeight)
    selectedGraphics.scale.set(1.1)
    selectedGraphics.drawPolygon([
      -halfWidth, -halfHeight,
      halfWidth, -halfHeight,
      halfWidth, halfHeight,
      -halfWidth, halfHeight
    ])
    controlPoint(selectedGraphics, halfWidth, halfHeight)
  }
}

export default Selected
