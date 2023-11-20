import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import skeleton from '@/actions/skeleton'
import { type IPoint, type ExtendContainer } from '@/types/types'

const config = useConfigStore(pinia)

export default (_this: any, container: PIXI.Container) => {
  container.on('pointerenter', function (this: PIXI.Container) {
    this.children.forEach(graphics => graphics.cursor = 'move')
  })
  container.on('pointerdown', function (this: ExtendContainer, e) {
    e.stopPropagation()
    this.isMove = true
    this.startPoint = { x: e.x, y: e.y}
    _this.ghContainer = this
    skeleton(this)
  })
  container.on('pointerup', function (this: ExtendContainer, e) {
    e.stopPropagation()
    this.isMove = false
    config.drawType = 'select'
  })
  container.on('pointermove', function (this: ExtendContainer, e) {
    if (!this.isMove) return
    const mX = e.x - (this.startPoint as IPoint).x,
          mY = e.y - (this.startPoint as IPoint).y
    this.startPoint = { x: e.x, y: e.y }
    this.x += mX
    this.y += mY
  })
}
