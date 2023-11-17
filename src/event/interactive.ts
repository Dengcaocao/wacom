import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'


interface IExtendThis {
  isMove: boolean,
  startPoint: {
    x: number
    y: number
  }
}

const config = useConfigStore(pinia)

export default (_this: any, container: PIXI.Container) => {
  container.on('pointerenter', function (this: PIXI.Container) {
    this.children.forEach(graphics => graphics.cursor = 'move')
  })
  container.on('pointerdown', function (this: PIXI.Container & IExtendThis, e) {
    e.stopPropagation()
    this.isMove = true
    this.startPoint = { x: e.x, y: e.y}
    _this.ghContainer = this
  })
  container.on('pointerup', function (this: PIXI.Container & IExtendThis, e) {
    e.stopPropagation()
    this.isMove = false
    config.drawType = 'select'
  })
  container.on('pointermove', function (this: PIXI.Container & IExtendThis, e) {
    if (!this.isMove) return
    const mX = e.x - this.startPoint.x,
          mY = e.y - this.startPoint.y
    this.startPoint = { x: e.x, y: e.y }
    this.x += mX
    this.y += mY
  })
}
