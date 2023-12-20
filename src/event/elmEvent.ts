import { Container, Graphics } from 'pixi.js'
import Application from '@/actions/application'
import type { ExtendContainer, IExtendAttribute, IPoint, MainElm } from '@/actions/types'

// 保存容器元素和信息
let container: ExtendContainer
let customInfo: IExtendAttribute | undefined

/**
 * 比较两个容器是否相等，否：重置交互区域移除选中并将容器赋值给实例容器
 * @param this 实例对象
 * @param currContainer 当前点击的容器 
 */
export function equalContainer (this: Application, currContainer: Container) {
  if (currContainer === this.container) return
  const mainElm = this.container?.getChildByName('main_graphics')
  if (mainElm) {
    mainElm.hitArea = null
    this.removeSelected()
    this.setHitArea(<Graphics>mainElm)
  }
  this.container = currContainer
}

function handlePointerdown (
  this: MainElm,
  rootThis: Application,
  e: MouseEvent
) {
  /**
   * 判断是否有元素被选中，如果当前点击的元素与选中元素不相等
   * 移出之前元素选中的效果，将点击的元素设置为选中元素
   */
  container = this.parent as ExtendContainer
  customInfo = container.customInfo as IExtendAttribute
  const { drawType } = rootThis.graphicsConfig
  if (drawType !== 'select') return
  e.stopPropagation()
  equalContainer.call(rootThis, container)
  const getElmStyleConfig = new CustomEvent('getElmStyleConfig', {
    detail: {
      drawType: customInfo.drawType,
      styleConfig: customInfo.styleConfig
    }
  })
  document.dispatchEvent(getElmStyleConfig)
  rootThis.drawSelected()
  rootThis.app.stage.setChildIndex(
    container,
    rootThis.app.stage.children.length - 1
  )
  customInfo.isMove = true
  customInfo.startPoint = { x: e.x, y: e.y}
}

function handleActionEnd (this: MainElm) {
  if (!customInfo) return
  customInfo.isMove = false
}

function handlePointermove (this: MainElm, e: MouseEvent) {
  if (!customInfo?.isMove) return
  const mX = e.x - (customInfo.startPoint as IPoint).x,
        mY = e.y - (customInfo.startPoint as IPoint).y;
  customInfo.startPoint = { x: e.x, y: e.y }
  container.x += mX
  container.y += mY
}

function installElmEvent (this: Application, elm: MainElm) {
  elm.on('pointerenter', () => {
    const { drawType } = this.graphicsConfig
    elm.cursor = drawType === 'select' ? 'move' : 'crosshair'
  })
  elm.on('pointerdown', (e) => handlePointerdown.call(elm, this, e))
  elm.on('pointerup', handleActionEnd)
  elm.on('pointerleave', handleActionEnd)
  elm.on('pointermove', handlePointermove)
}

export default installElmEvent
