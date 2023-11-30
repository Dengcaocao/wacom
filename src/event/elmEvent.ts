import * as PIXI from 'pixi.js'
import Application from '@/actions/application'
import type { IPoint, MainElm } from '@/actions/types'

function handlePointerdown (
  this: MainElm,
  rootThis: Application,
  e: MouseEvent
) {
  /**
   * 判断是否有元素被选中，如果当前点击的元素与选中元素不相等
   * 移出之前元素选中的效果，将点击的元素设置为选中元素
   */
  if (rootThis.container && this.parent !== rootThis.container) {
    const selectedElm = rootThis.container.getChildByName('selected') as PIXI.Graphics
    rootThis.container.removeChild(selectedElm)
  }
  if (rootThis.styleConfig?.drawType === 'select') {
    e.stopPropagation()
  } else { return }
  rootThis.container = this.parent
  rootThis.drawSelected()
  this.isMove = true
  this.startPoint = { x: e.x, y: e.y}
}

function handleActionEnd (this: MainElm) {
  this.isMove = false
}

function handlePointermove (this: MainElm, e: MouseEvent) {
  if (!this.isMove) return
  const mX = e.x - (this.startPoint as IPoint).x,
        mY = e.y - (this.startPoint as IPoint).y
  this.startPoint = { x: e.x, y: e.y }
  this.parent.x += mX
  this.parent.y += mY
}

function installElmEvent (this: Application, elm: MainElm) {
  elm.on('pointerenter', () => {
    if (this.styleConfig?.drawType !== 'select') return elm.cursor = 'crosshair'
    elm.cursor = 'move'
  })
  elm.on('pointerdown', (e) => {
    handlePointerdown.call(elm, this, e)
  })
  elm.on('pointerup', handleActionEnd)
  elm.on('pointerleave', handleActionEnd)
  elm.on('pointermove', handlePointermove)
}

export default installElmEvent
