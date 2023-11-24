import * as PIXI from 'pixi.js'
import Application from '@/actions/application'
import { gapSize } from '@/actions/selected'
import type { ExtendGraphics } from '@/actions/types'

// 记录点击时的数据
let containerElm: PIXI.Container
let main_graphics: PIXI.Graphics
let main_graphics_position: PIXI.ObservablePoint
let selectedElm: PIXI.Graphics
let pointsGap: number[]

function handlePointerdown (
  this: ExtendGraphics,
  rootThis: Application,
  index: number,
  e: MouseEvent
) {
  e.stopPropagation()
  this.isMove = true
  // 获取父容器
  containerElm = this.parent.parent
  selectedElm = containerElm.getChildByName('selected') as PIXI.Graphics
  main_graphics = containerElm.getChildByName('main_graphics') as PIXI.Graphics
  // 保存最开始的定位信息
  main_graphics_position = main_graphics_position || main_graphics.position
  const { minX, minY, maxX, maxY } = main_graphics.geometry.bounds
  const w = maxX - minX, h = maxY - minY
  // 设置绘制起始点 和空隙
  switch (index) {
    case 0: {
      rootThis.startPoints = main_graphics.position
      return pointsGap = [-gapSize, h/2]
    }
    case 1: {
      rootThis.startPoints = main_graphics.position
      return pointsGap = [-gapSize, -gapSize]
    }
    case 2: {
      rootThis.startPoints = main_graphics.position
      return pointsGap = [w/2, -gapSize]
    }
    case 3: {
      rootThis.startPoints = {
        x: main_graphics_position.x + w,
        y: main_graphics_position.y
      }
      return pointsGap = [gapSize, -gapSize]
    }
    case 4: {
      rootThis.startPoints = {
        x: main_graphics_position.x + w,
        y: main_graphics_position.y
      }
      return pointsGap = [gapSize, h/2]
    }
    case 5: {
      rootThis.startPoints = {
        x: main_graphics_position.x + w,
        y: main_graphics_position.y + h
      }
      return pointsGap = [gapSize, gapSize]
    }
    case 6: {
      rootThis.startPoints = {
        x: main_graphics_position.x + w,
        y: main_graphics_position.y + h
      }
      return pointsGap = [w/2 * -1, gapSize]
    }
    case 7: {
      rootThis.startPoints = {
        x: main_graphics_position.x,
        y: main_graphics_position.y + h
      }
      return pointsGap = [-gapSize, gapSize]
    }
  }
}

function handleActionEnd (
  this: ExtendGraphics,
  e: MouseEvent
) {
  e.stopPropagation()
  this.isMove = false
}

function handlePointermove (
  this: ExtendGraphics,
  rootThis: Application,
  e: MouseEvent
) {
  e.stopPropagation()
  if (!this.isMove) return
  containerElm.removeChild(main_graphics)
  // tips 这里要加上container移动的位置的取反
  const point = rootThis.getMappingPoints(
    containerElm.position.x * -1 + e.x,
    containerElm.position.y * -1 + e.y
  )
  const [gapX, gapY] = pointsGap
  rootThis.drawRect(
    point.x + gapX,
    point.y + gapY
  )
  // 保存选中节点引用，避免重新绘制导致事件丢失
  containerElm.addChild(selectedElm)
  rootThis.drawSelected()
}

function installControlElmEvent (
  this: Application,
  elm: ExtendGraphics,
  index: number
) {
  elm.on('pointerdown', e => {
    handlePointerdown.call(elm, this, index, e)
  })
  elm.on('pointerup', e => {
    handleActionEnd.call(elm, e)
  })
  // 使用最外层容器触发移动事件，控制点太小容易掉
  elm.parent.parent.parent.on('pointerup', e => {
    handleActionEnd.call(elm, e)
  })
  elm.parent.parent.parent.on('pointermove', e => {
    handlePointermove.call(elm, this, e)
  })
}

export default installControlElmEvent
