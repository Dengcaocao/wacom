import * as PIXI from 'pixi.js'
import Application from '@/actions/application'
import type { ExtendContainer, IExtendAttribute } from '@/actions/types'

// 时间戳
let stamp: number = new Date().getTime()
// 是否双击
let isDoubleClick: boolean = false

/**
 * 处理场景滚动
 * @param this 
 * @param stage 场景
 * @param param2 
 * @returns 
 */
function handleWheel (this: Application, { deltaX, deltaY }: WheelEvent) {
  // 输入时禁止滚动
  const textareaList = document.querySelectorAll('.pixi-text')
  if (textareaList.length) return
  const stage = this.app.stage
  const screenWidth = this.app.screen.width,
        screenHeight = this.app.screen.height
  // 过滤掉网格元素
  const elements = stage.children.filter(item => item.name !== 'mesh')
  // 处理边界值.
  if (stage.x >= 0 || stage.x <= -screenWidth) {
    const direction = deltaX < 0 ? 1 : -1
    const offsetValue = (screenWidth / this.scale) / 2
    stage.x = -(screenWidth / this.scale)
    elements
      .forEach(item => {
        item.x = item.x + offsetValue * direction
      })
    this.startPoints.x += offsetValue * direction
    return
  }
  if (stage.y >= 0 || stage.y <= -screenHeight) {
    const direction = deltaY < 0 ? 1 : -1
    const offsetValue = (screenHeight / this.scale) / 2
    stage.y = -(screenHeight / this.scale)
    elements
      .forEach(item => {
        item.y = item.y + offsetValue * direction
      })
    this.startPoints.y += offsetValue * direction
    return
  }
  stage.x += deltaX * -1
  stage.y += deltaY * -1
}

function handleMobileWheel (this: Application, e: TouchEvent) {
  e.preventDefault()
  const length = e.targetTouches.length
  if (length !== 2) return
  this.isDraw = false
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
  this.container.position.set(this.startPoints.x, this.startPoints.y)
  this.app.stage.addChild(this.container)
  if (drawType === 'image') return
  if (
    drawType === 'text' ||
    (drawType === 'select' && isDoubleClick)
  ) {
    this.drawText()
    return isDoubleClick = false
  }
  this.isDraw = true
}

// 开始绘制
function handlePointermove (this: Application, { x, y }: MouseEvent) {
  if (!this.isDraw) return
  const point = this.getMappingPoints(x, y)
  if (this.keys.includes('space')) {
    const deltaX = (point.x - this.startPoints.x) * -1
    const deltaY = (point.y - this.startPoints.y) * -1
    return handleWheel.call(this, <WheelEvent>{ deltaX, deltaY })
  }
  const container = <ExtendContainer>this.container
  const drawType = (container.customInfo as IExtendAttribute).drawType
  const methods: any = {
    rect: this.drawRect.bind(this),
    diamond: this.drawDiamond.bind(this),
    arc: this.drawArc.bind(this),
    mark: this.drawMark.bind(this),
    straightLine: this.drawMark.bind(this),
    paintingBrush: this.paintingBrush.bind(this)
  }
  methods[drawType] && methods[drawType](point.x, point.y)
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
  const drawType = (this.container.customInfo as IExtendAttribute).drawType
  if (!disabledUDS.includes(drawType) && this.container) {
    this.drawSelected()
  }
  // this.styleConfig.drawType !=='paintingBrush' && (drawType.value = 'select')
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
  document.addEventListener('touchmove', handleMobileWheel.bind(this), { passive: false })
}

export default installAppEvent
