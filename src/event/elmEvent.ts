import * as PIXI from 'pixi.js'
import Application from '@/actions/application'
import type { ExtendGraphics, IPoint } from '@/actions/types'

function handlePointerenter (this: ExtendGraphics) {
  this.cursor = 'move'
}

function handlePointerdown (
  this: ExtendGraphics,
  rootThis: Application,
  e: MouseEvent
) {
  e.stopPropagation()
  /**
   * 判断是否有元素被选中，如果当前点击的元素与选中元素不相等
   * 移出之前元素选中的效果，将点击的元素设置为选中元素
   */
  if (rootThis.container && this.parent !== rootThis.container) {
    const selectedElm = rootThis.container.getChildByName('selected') as PIXI.Graphics
    rootThis.container.removeChild(selectedElm)
    rootThis.container = this.parent
    rootThis.drawSelected()
  }
  this.isMove = true
  this.startPoint = { x: e.x, y: e.y}
}

function handleActionEnd (this: ExtendGraphics, e: MouseEvent) {
  e.stopPropagation()
  this.isMove = false
}

function handlePointermove (this: ExtendGraphics, e: MouseEvent) {
  if (!this.isMove) return
  const mX = e.x - (this.startPoint as IPoint).x,
        mY = e.y - (this.startPoint as IPoint).y
  this.startPoint = { x: e.x, y: e.y }
  this.parent.x += mX
  this.parent.y += mY
}

function installElmEvent (this: Application, elm: ExtendGraphics) {
  elm.on('pointerenter', handlePointerenter)
  elm.on('pointerdown', (e) => {
    handlePointerdown.call(elm, this, e)
  })
  elm.on('pointerup', handleActionEnd)
  elm.on('pointerleave', handleActionEnd)
  elm.on('pointermove', handlePointermove)
}

export default installElmEvent
