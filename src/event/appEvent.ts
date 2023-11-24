import * as PIXI from 'pixi.js'
import Application from '@/actions/application'
import type { ExtendGraphics } from '@/actions/types'

/**
 * 处理场景滚动
 * @param this 
 * @param stage 场景
 * @param param2 
 * @returns 
 */
function handleWheel (this: Application, stage: PIXI.Container, { deltaX, deltaY }: WheelEvent) {
  // 输入时禁止滚动
  const textareaList = document.querySelectorAll('textarea')
  if (textareaList.length) return
  stage.x += deltaX * -1
  stage.y += deltaY * -1
  const screenWidth = this.app.screen.width,
        screenHeight = this.app.screen.height
  // 过滤掉网格元素
  const elements = stage.children.filter(item => item.name !== 'mesh')
  if (stage.x >= 0 || stage.x <= -screenWidth) {
    elements
      .forEach(item => {
        item.x = item.x + (screenWidth / this.scale) / 2 * (deltaX < 0 ? 1 : -1)
      })
    stage.x = -(screenWidth / this.scale)
  }
  if (stage.y >= 0 || stage.y <= -screenHeight) {
    elements
      .forEach(item => {
        item.y = item.y + (screenHeight / this.scale) / 2 * (deltaY < 0 ? 1 : -1)
      })
    stage.y = -(screenHeight / this.scale)
  }
}

function handlePointerdown (this: Application, { x, y }: MouseEvent) {
  // 绘制之前删除选中效果
  if (this.container) {
    const selectedElm = this.container.getChildByName('selected') as ExtendGraphics
    this.container.removeChild(selectedElm)
  }
  this.container = undefined
  this.isDraw = true
  this.startPoints = this.getMappingPoints(x, y)
}

// 开始绘制
function handlePointermove (this: Application, { x, y }: MouseEvent) {
  if (!this.isDraw) return
  const point = this.getMappingPoints(x, y)
  this.drawRect(point.x, point.y)
}

// 结束绘制
function handleDrawEnd (this: Application) {
  this.container && this.drawSelected()
  this.isDraw = false
}

function installAppEvent (this: Application, stage: PIXI.Container) {
  /**
   * 滚动事件处理
   * @param e 事件对象
   */
  stage.on('wheel', (e) => handleWheel.bind(this)(stage, e))
  stage.on('pointerdown', handlePointerdown.bind(this))
  stage.on('pointermove', handlePointermove.bind(this))
  stage.on('pointerup', handleDrawEnd.bind(this))
  stage.on('pointerleave', handleDrawEnd.bind(this))
}

export default installAppEvent
