import * as PIXI from 'pixi.js'
import Selected, { gapSize } from '@/actions/selected'
import type { ExtendContainer, IExtendAttribute, IPoint, MainElm } from '@/actions/types'

// 记录点击时的数据
let containerElm: ExtendContainer // 图形装载容器
let customInfo: IExtendAttribute // 容器上的自定义消息
let mainElm: MainElm // 主元素
let dp: IPoint // 鼠标点击的点
let isTextOrSprite: boolean // 是否 text | sprite 元素

export let elmInitWidth: number, elmInitHeight: number // 元素调整前的宽高

/**
 * 根据控制点下标返回定位
 * @param index 控制点元素下标
 * @returns 
 */
function getPosition (index: number) {
  const { width, height } = mainElm
  elmInitWidth = width, elmInitHeight = height
  const { x, y } = dp
  const pObj: any = {
    0: { x: x - width - gapSize, y: y - height/2 },
    1: { x: x - width - gapSize, y: y - height - gapSize },
    2: { x: x - width/2, y: y - height - gapSize },
    3: { x: x + width + gapSize, y: y - height - gapSize },
    4: { x: x + width + gapSize, y: y + height/2 },
    5: { x: x + width + gapSize, y: y + height + gapSize },
    6: { x: x + width/2, y: y + height + gapSize },
    7: { x: x - width - gapSize, y: y + height + gapSize }
  }
  return pObj[index]
}

function handlePointerdown (
  this: PIXI.Graphics,
  rootThis: Selected,
  index: number,
  e: MouseEvent
) {
  e.stopPropagation()
  // 获取父容器
  containerElm = this.parent.parent
  customInfo = <IExtendAttribute>containerElm.customInfo
  mainElm = <MainElm>containerElm.children.find(elm => /^main/.test(<string>elm.name))
  dp = rootThis.getMappingPoints(e.x, e.y)
  isTextOrSprite = /(text|sprite)$/.test(<string>mainElm.name)
  rootThis.startPoints = getPosition(index)
  rootThis.isDraw = customInfo.drawType !== 'paintingBrush'
  customInfo.isReSize = true
  customInfo.controlIndex = index
  rootThis.app.stage.on('pointermove', ({x, y}) => {
    if (!customInfo?.isReSize || !isTextOrSprite) return
    const { x: sx, y: sy } = rootThis.startPoints
    const { x: mx, y: my } = rootThis.getMappingPoints(x, y)
    const w = Math.abs(mx - sx), h = Math.abs(my - sy)
    const pX = Math.min(sx, mx), pY = Math.min(sy, my)
    switch (index) {
      case 0: {
        mainElm.width = w
        mainElm.height = elmInitHeight
        containerElm.position.set(pX, Math.min(sy, dp.y))
        break
      }
      case 2: {
        mainElm.width = elmInitWidth
        mainElm.height = h
        containerElm.position.set(Math.min(sx, dp.x), pY)
        break
      }
      case 4: {
        mainElm.width = w
        mainElm.height = elmInitHeight
        containerElm.position.set(pX, Math.min(sy, dp.y) - elmInitHeight/2)
        break
      }
      case 6: {
        mainElm.width = elmInitWidth
        mainElm.height = h
        containerElm.position.set(Math.min(sx, dp.x) - elmInitWidth/2, pY)
        break
      }
      default: {
        mainElm.width = w
        mainElm.height = h
        containerElm.position.set(pX, pY)
      }
    }
    rootThis.removeSelected()
    rootThis.drawSelected()
  })
}

function installControlElmEvent (
  this: Selected,
  controlElm: PIXI.Graphics,
  index: number
) {
  controlElm.on('pointerdown', handlePointerdown.bind(controlElm, this, index))
}

export default installControlElmEvent
