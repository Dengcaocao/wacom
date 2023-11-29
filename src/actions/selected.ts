import * as PIXI from 'pixi.js'
import Rect from './rect'
import createDashedTexture from '@/texture/dashed'
import installControlElmEvent from '@/event/controlElmEvent'
import type { ExtendContainer, ExtendGraphics, ExtendSprite, ExtendText, MainElm } from '@/actions/types'

// 绘制选中效果的间隙大小
export const gapSize = 12
// 控制点的大小
const controlSize = 8

/**
 * 设置鼠标样式
 * @param childElm 
 * @param index 
 * @returns 
 */
const setCursor = (childElm: ExtendGraphics, index: number) => {
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
function controlPoint (
  this: Selected,
  elm: ExtendGraphics,
  width: number,
  height: number
) {
  width += controlSize / 2
  height += controlSize / 2
  // 原点到顶点的弧度
  const radian = Math.atan(height / width)
  // 剩余的弧度
  const residueRadian = Math.PI / 2 - radian
  // 从负 radian 开始，没两个切换增加的弧度 1)
  let sumRadian = -radian
  // 绘制操控点
  const isNewCreate = !elm.children.length
  const controlElms = isNewCreate
    ? new Array(8).fill(8).map(() => new PIXI.Graphics)
    : elm.children as PIXI.Graphics[]
  controlElms.forEach((controlElm, index) => {
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
    if (isNewCreate) {
      elm.addChild(controlElm)
      setCursor(controlElm, index)
      installControlElmEvent.call(this as any, controlElm, index)
    }
    controlElm.position.set(x, y)
    controlElm.beginFill(0xffffff, 0.8)
    controlElm.lineStyle({
      width: 1,
      color: 0x000000
    })
    controlElm.drawRect(-controlSize / 2, -controlSize / 2, controlSize, controlSize)
  })
}

/**
 * 获取主图的最值
 * @param mainElm 主图元素
 * @returns 
 */
const getMaximum = (mainElm: MainElm) => {
  switch (mainElm.name) {
    case 'main_graphics': {
      return (mainElm as ExtendGraphics).geometry.bounds
    }

    case 'main_text': {
      return {
        minX: 0, minY: 0,
        maxX: (mainElm as ExtendText).width,
        maxY: (mainElm as ExtendText).height
      }
    }

    case 'main_sprite': {
      return {
        minX: 0, minY: 0,
        maxX: (mainElm as ExtendSprite).width,
        maxY: (mainElm as ExtendSprite).height
      }
    }

    default: {
      return (mainElm as ExtendGraphics).geometry.bounds
    }
  }
}

class Selected extends Rect {
  drawSelected () {
    const containerElm = this.container as ExtendContainer
    // 获取容器中的主图形
    const mainElm = containerElm.children
      .filter(item => item.name && /^main/.test(item.name))[0] as MainElm    
    const selectedElm = containerElm.getChildByName('selected') as ExtendGraphics
    const selectedGraphics: ExtendGraphics = selectedElm || new PIXI.Graphics()
    const { minX, minY, maxX, maxY } = getMaximum(mainElm)
    const width = maxX - minX + gapSize,
          height = maxY - minY + gapSize,
          halfWidth = width / 2,
          halfHeight = height / 2
    if (!selectedElm) {
      selectedGraphics.name = 'selected'
      containerElm.addChild(selectedGraphics)
    } else {
      selectedGraphics.clear()
    }
    selectedGraphics.beginFill(0, 0)
    selectedGraphics.lineTextureStyle({
      width: 1,
      texture: createDashedTexture(width, height)
    })
    selectedGraphics.position.set(
      mainElm.x + minX + halfWidth - gapSize / 2,
      mainElm.y + minY + halfHeight - gapSize / 2
    )
    selectedGraphics.drawPolygon([
      -halfWidth, -halfHeight,
      halfWidth, -halfHeight,
      halfWidth, halfHeight,
      -halfWidth, halfHeight
    ])
    controlPoint.call(this, selectedGraphics, halfWidth, halfHeight)
  }
}

export default Selected
