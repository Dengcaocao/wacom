import * as PIXI from 'pixi.js'
import Selected from '@/actions/selected'
import { gapSize } from '@/actions/selected'
import type { ExtendContainer, IExtendAttribute } from '@/actions/types'

// 记录点击时的数据
let containerElm: ExtendContainer
let customInfo: IExtendAttribute | undefined
let main_graphics: PIXI.Graphics
let selectedElm: PIXI.Graphics
let pointsGap: number[]
let initSize = { width: 0, height: 0 }

function handlePointerdown (
  this: PIXI.Graphics,
  rootThis: Selected,
  index: number,
  e: MouseEvent
) {
  e.stopPropagation()
  // 获取父容器
  containerElm = this.parent.parent
  customInfo = containerElm.customInfo as IExtendAttribute
  customInfo.isMove = true
  customInfo.startPoint = { x: e.x, y: e.y }
  selectedElm = containerElm.getChildByName('selected') as PIXI.Graphics
  main_graphics = containerElm.getChildByName('main_graphics') as PIXI.Graphics
  const { width, height } = containerElm
  initSize = { width, height }
  // 保存最开始的定位信息
  // main_graphics_position = main_graphics_position || main_graphics.position
  // const { minX, minY, maxX, maxY } = main_graphics.geometry.bounds
  // const w = maxX - minX, h = maxY - minY
}

function handleActionEnd (
  this: PIXI.Graphics,
  e: MouseEvent
) {
  e.stopPropagation()
  if (!customInfo) return
  customInfo.isMove = false
}

function handlePointermove (
  this: PIXI.Graphics,
  rootThis: Selected,
  e: MouseEvent
) {
  e.stopPropagation()
  if (!customInfo?.isMove) return
  const { width, height } = initSize
  const { x, y } = customInfo.startPoint || { x: 0, y: 0 }
  const mX = e.x - x
  const mY = e.y - y
  containerElm.scale.set(1 + mX/width, 1+mY/height)
  return console.log(mX, width)
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
  this: Selected,
  controlElm: PIXI.Graphics,
  index: number
) {
  controlElm.on('pointerdown', e => {
    console.log(999)
    handlePointerdown.call(controlElm, this, index, e)
  })
  controlElm.on('pointerup', e => {
    handleActionEnd.call(controlElm, e)
  })
  // 使用最外层容器触发移动事件，控制点太小容易掉
  controlElm.parent.parent.parent.on('pointerup', e => {
    handleActionEnd.call(controlElm, e)
  })
  controlElm.parent.parent.parent.on('pointermove', e => {
    handlePointermove.call(controlElm, this, e)
  })
}

export default installControlElmEvent
