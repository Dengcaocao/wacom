import * as PIXI from 'pixi.js'
import type { Ref } from 'vue'
import { useDrawRect } from '@/hooks/drawRect'

export const usePixiApp = () => {
  class CreateSceen {
    app: PIXI.Application<PIXI.ICanvas>
    container: Ref
    ghContainer: PIXI.Container | undefined
    width: number
    height: number
    // 是否允许绘制
    isDraw: boolean
    // 鼠标按下的坐标
    downPoint: { x: number; y: number}
    // 鼠标抬起的坐标
    upPoint: { x: number; y: number}
    graphics: PIXI.Graphics | undefined
    // drawRect: ((mx: number, my: number) => void) | undefined
    constructor (container: Ref, width: number, height: number) {
      this.app = new PIXI.Application({
        width: width * 2,
        height: height * 2,
        backgroundColor: 0xffffff,
        antialias: true,
        eventMode: 'static'
      })
      container.value.appendChild(this.app.view)
      this.container = container
      this.width = width
      this.height = height
      this.isDraw = false
      this.downPoint = this.upPoint = { x: 0, y: 0 }
      this.initCanvasSize(width, height)
      this.createBgMesh()
      this.installDrawMehtds()
      this.installEventListener()
    }
    // setBgColor () {
    //   this.app.renderer.background.color = '#00ff00'
    // }
    /**
     * @description: 网格背景绘制
     * @return {*}
     */
    createBgMesh () {
      const mesh = new PIXI.Graphics()
      this.app.stage.addChild(mesh)
      const width = this.app.screen.width
      const height = this.app.screen.height
      mesh.lineStyle(1, 0x000000, 0.1)
      // 垂直线条
      for (let i = 0; i < width; i += 20) {
        mesh.moveTo(i, 0)
        mesh.lineTo(i, height)
      }
      // 水平线条
      for (let i = 0; i < height; i += 20) {
        mesh.moveTo(0, i)
        mesh.lineTo(width, i)
      }
    }

    /**
     * 初始化画布大小
     * @param width 
     * @param height 
     */
    initCanvasSize (width: number, height: number) {
      if (this.app.view.style) {
        this.app.view.style.width = `${width}px`
        this.app.view.style.height = `${height}px`
      }
      this.app.stage.scale.set(this.app.screen.width / width)
      this.app.stage.position = { x: -width, y: -height }

      const mesh = new PIXI.Graphics()
      this.app.stage.addChild(mesh)
      mesh.beginFill('#ff0000', 1)
      mesh.drawCircle(width, height, 8)
      mesh.endFill()
    }

    installDrawMehtds () {
      useDrawRect(CreateSceen)
    }

    /**
     * 滚动事件处理
     * @param e 事件对象
     */
    _handleWheel (e: WheelEvent) {
      this.app.stage.x += e.deltaX * -1
        this.app.stage.y += e.deltaY * -1
        if (this.app.stage.x >= 0 || this.app.stage.x <= -this.app.screen.width) {
          this.app.stage.children
            .slice(0, 1)
            .forEach(item => {
              item.x = item.x + this.width / 2 * (e.deltaX < 0 ? 1 : -1)
            })
          this.app.stage.x = -this.width
        }
        if (this.app.stage.y >= 0 || this.app.stage.y <= -this.app.screen.height) {
          this.app.stage.children
            .slice(0, 1)
            .forEach(item => {
              item.y = item.y + this.height / 2 * (e.deltaY < 0 ? 1 : -1)
            })
          this.app.stage.y = -this.height
        }
    }

    _handlePointerdown (e: PointerEvent) {
      const { x, y } = e
      this.isDraw = true
      this.downPoint = {
        x: x + Math.abs(this.app.stage.x) / 2,
        y: y + Math.abs(this.app.stage.y) / 2
      }
    }

    _handlePointerup (e: PointerEvent) {
      const { x, y } = e
      this.isDraw = false
      this.ghContainer = undefined
    }

    _handlePointermove (e: PointerEvent) {
      if (!this.isDraw) return
      this.ghContainer = this.ghContainer || new PIXI.Container()
      this.app.stage.addChild(this.ghContainer)
      const x = e.x + Math.abs(this.app.stage.x) / 2
      const y = e.y + Math.abs(this.app.stage.y) / 2;
      (this as any).drawRect(x, y)
    }

    installEventListener () {
      this.container.value.addEventListener('wheel', (e: WheelEvent) => this._handleWheel(e))
      this.container.value.addEventListener('pointerdown', (e: PointerEvent) => this._handlePointerdown(e))
      this.container.value.addEventListener('pointerup', (e: PointerEvent) => this._handlePointerup(e))
      this.container.value.addEventListener('pointermove', (e: PointerEvent) => this._handlePointermove(e))
    }
  }
  return {
    CreateSceen
  }
}
