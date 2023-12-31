import * as PIXI from 'pixi.js'
import Application from '@/actions/application'
import { gapSize } from '@/actions/selected'
import { elmInitWidth, elmInitHeight } from '@/event/controlElmEvent'
import type { ExtendContainer, IExtendAttribute, IPoint } from '@/actions/types'

// 时间戳
let stamp: number = new Date().getTime()
// 是否双击
let isDoubleClick: boolean = false

function adjustMovePoint (this: Application, { x, y }: IPoint, controlIndex: number) {
  const container = <ExtendContainer>this.container
  const mPObj: any = {
    0: { x: x - gapSize, y: container.y + elmInitHeight },
    1: { x: x - gapSize, y: y - gapSize },
    2: { x: container.x + elmInitWidth, y: y - gapSize },
    3: { x: x + gapSize, y: y - gapSize },
    4: { x: x + gapSize, y: container.y - elmInitHeight },
    5: { x: x + gapSize, y: y + gapSize },
    6: { x: container.x - elmInitWidth, y: y + gapSize },
    7: { x: x - gapSize, y: y + gapSize }
  }
  return mPObj[controlIndex]
}

/**
 * 处理场景滚动
 * @param this 
 * @param stage 场景
 * @param param2 
 * @returns 
 */
function handleWheel (this: Application, { deltaX, deltaY }: WheelEvent) {
  // 输入时禁止滚动
  const textarea = document.querySelector('.pixi-text')
  if (textarea) return
  const stage = this.app.stage
  const { width, height } = this.app.screen
  const { offsetX, offsetY, stageNeedScale } = this.getOS()
  // 过滤掉网格元素
  const elements = stage.children.filter(item => item.name !== 'mesh')
  // 处理边界值.
  if (stage.x >= 0 || stage.x <= offsetX * 2) {
    const direction = deltaX < 0 ? 1 : -1
    const translateX = width * stageNeedScale * direction
    elements.forEach(item => item.x += translateX)
    this.startPoints.x += translateX
    return stage.x = offsetX
  }
  if (stage.y >= 0 || stage.y <= offsetY * 2) {
    const direction = deltaY < 0 ? 1 : -1
    const translateY = height * stageNeedScale * direction
    elements.forEach(item => item.y += translateY)
    this.startPoints.y += translateY
    return stage.y = offsetY
  }
  stage.x += deltaX * -1
  stage.y += deltaY * -1
}

function handleTouchstart (this: Application, e: TouchEvent) {
  if (e.targetTouches.length > 1) this.isDraw = false
}

function handleMobileWheel (this: Application, e: TouchEvent) {
  const a = document.querySelector('.config-container')
  !a?.contains(<HTMLElement>e.target) && e.preventDefault()
  const length = e.targetTouches.length
  if (length !== 2) return
  const textarea = <HTMLTextAreaElement>document.querySelector('.pixi-text')
  textarea && !textarea.value && textarea.parentNode?.removeChild(textarea)
  const { clientX, clientY } = e.targetTouches[length - 1]
  const point = this.getMappingPoints(clientX, clientY)
  const deltaX = (point.x - this.startPoints.x) * -1
  const deltaY = (point.y - this.startPoints.y) * -1
  handleWheel.call(this, <WheelEvent>{ deltaX, deltaY })
}

function handlePointerdown (this: Application, { x, y }: MouseEvent) {
  const nowTime = new Date().getTime()
  const bool = nowTime - stamp < 500
  bool && (isDoubleClick = !isDoubleClick)
  stamp = nowTime
  const { drawType, styleConfig } = this.graphicsConfig
  this.startPoints = this.getMappingPoints(x, y)
  // 绘制之前删除选中效果并重置交互区域
  if (this.container) {
    this.removeSelected()
    const main_graphics = this.container.getChildByName('main_graphics')
    if (main_graphics) {
      main_graphics.hitArea = null
      this.setHitArea(<PIXI.Graphics>main_graphics)
    }
    this.container = undefined
  }
  this.container = new PIXI.Container()
  this.container.customInfo = {
    drawType,
    vertexData: [],
    styleConfig: { ...styleConfig }
  }
  this.container.position = this.startPoints
  this.app.stage.addChild(this.container)
  if (drawType === 'image') return
  if (
    drawType === 'text' ||
    (drawType === 'select' && isDoubleClick)
  ) {
    isDoubleClick = false
    return this.drawText() 
  }
  this.isDraw = true
}

// 开始绘制
function handlePointermove (this: Application, { x, y }: MouseEvent) {
  if (!this.isDraw) return
  let point = this.getMappingPoints(x, y)
  if (this.keys.includes('space')) {
    const deltaX = (point.x - this.startPoints.x) * -1
    const deltaY = (point.y - this.startPoints.y) * -1
    return handleWheel.call(this, <WheelEvent>{ deltaX, deltaY })
  }
  const container = <ExtendContainer>this.container
  const { drawType, isReSize, controlIndex } = <IExtendAttribute>container.customInfo
  const methods: any = {
    rect: this.drawRect.bind(this),
    diamond: this.drawDiamond.bind(this),
    arc: this.drawArc.bind(this),
    mark: this.drawMark.bind(this),
    straightLine: this.drawMark.bind(this),
    paintingBrush: this.paintingBrush.bind(this)
  }
  if (isReSize) {
    container.position = this.startPoints
    point = adjustMovePoint.call(this, point, <number>controlIndex)
  }
  methods[drawType] && methods[drawType](point.x, point.y)
  isReSize && this.drawSelected()
}

// 结束绘制
function handleDrawEnd (this: Application) {
  // if (isDoubleClick) return
  this.isDraw = false
  if (!this.container) return
  if (!this.container.children.length) {
    this.app.stage.removeChild(this.container)
    return this.container = undefined
  }
  const disabledUDS = ['select', 'paintingBrush', 'text', 'image']
  const customInfo = <IExtendAttribute>this.container.customInfo
  customInfo.isReSize = false
  if (!disabledUDS.includes(customInfo.drawType)) {
    this.drawSelected()
  }
}

function installAppEvent (this: Application) {
  /**
   * 滚动事件处理
   * @param e 事件对象
   */
  const stage = this.app.stage
  stage.on('wheel', handleWheel.bind(this))
  stage.on('pointerenter', () => {
    stage.cursor = this.graphicsConfig.drawType === 'select' ? 'default' : 'crosshair'
  })
  stage.on('pointerdown', handlePointerdown.bind(this))
  stage.on('pointermove', handlePointermove.bind(this))
  stage.on('pointerup', handleDrawEnd.bind(this))
  stage.on('pointerleave', handleDrawEnd.bind(this))
  // 处理移动端画布移动
  document.addEventListener('touchstart', handleTouchstart.bind(this))
  document.addEventListener('touchmove', handleMobileWheel.bind(this), { passive: false })
}

export default installAppEvent
