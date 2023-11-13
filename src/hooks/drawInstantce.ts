import * as PIXI from 'pixi.js'
import { toRaw, type Ref } from 'vue'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import { useFillBgColor } from '@/hooks/fillBgColor'
import { useDrawRect } from '@/hooks/drawRect'
import { useDrawDiamond } from '@/hooks/drawDiamond'
import { useDrawArc } from '@/hooks/drawArc'
import { useDrawLineSegment } from '@/hooks/drawLineSegment'
import { useDrawLine } from '@/hooks/drawLine'
import { useStroke } from '@/hooks/stroke'

interface IExtendThis {
  isMove: boolean,
  startPoint: {
    x: number
    y: number
  }
}

interface IExtendContainer {
  offsetPoints?: number[]
}

interface IExtendGraphics {
  qcPoints?: number[]
}

export type ExtendContainer = PIXI.Container & IExtendContainer

export type ExtendGraphics = PIXI.Graphics & IExtendGraphics

const config = useConfigStore(pinia)
const { stroke } = useStroke()

export const usePixiApp = () => {
  class CreateSceen {
    app: PIXI.Application<PIXI.ICanvas>
    container: Ref
    ghContainer: ExtendContainer | undefined
    width: number
    height: number
    // 是否允许绘制
    isDraw: boolean = false
    // 鼠标按下的坐标
    downPoint: { x: number; y: number} = { x: 0, y: 0 }
    // 鼠标抬起的坐标
    upPoint: { x: number; y: number} = { x: 0, y: 0 }
    graphics: PIXI.Graphics | undefined
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
      // 添加可交互区域
      const height = this.app.screen.height
      mesh.hitArea = new PIXI.Rectangle(0, 0, width, height)
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
    }

    installDrawMehtds () {
      useDrawRect(CreateSceen)
      useFillBgColor(CreateSceen)
      useDrawDiamond(CreateSceen)
      useDrawArc(CreateSceen)
      useDrawLineSegment(CreateSceen)
      useDrawLine(CreateSceen)
    }

    /**
     * 设置图形绘制样式
     * @param graphics 图形对象
     */
    setGraphicsStyle (graphics: PIXI.Graphics) {
      if (!graphics) return
      graphics.lineStyle({
        width: config.context.strokeWidth,
        color: config.context.strokeColor,
        alpha: config.context.lineStyle === 'simple'
          ? config.context.alpha
          : 0,
        cap: PIXI.LINE_CAP.ROUND
      })
      graphics.beginFill(
        config.context.fillStyle === 'fill'
          ? config.context.fillColor
          : 'transparent',
        config.context.fillColor === 'transparent' ||
        config.context.fillStyle !== 'fill'
          ? 0
          : config.context.alpha
      );
    }

    /**
     * 重写渲染
     */
    reRenderer () {
      const graphicsInfo = this.ghContainer?.children
        .map((graphics: any) =>
          ({
            shape: toRaw(graphics).geometry.graphicsData[0].shape,
            qcPoints: toRaw(graphics.qcPoints)
          })
        )
      this.ghContainer?.removeChildren()
      graphicsInfo?.forEach(info => {
        const graphics: ExtendGraphics = new PIXI.Graphics()
        this.ghContainer?.addChild(graphics)
        this.setGraphicsStyle(graphics)
        graphics.qcPoints = info.qcPoints
        graphics.drawShape(info.shape)
        if (config.context.fillStyle !== 'fill') {
          config.drawInstance.fillBgColor(graphics)
        }
        stroke(graphics)
      })
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
            .slice(1)
            .forEach(item => {
              item.x = item.x + this.width / 2 * (e.deltaX < 0 ? 1 : -1)
            })
          this.app.stage.x = -this.width
        }
        if (this.app.stage.y >= 0 || this.app.stage.y <= -this.app.screen.height) {
          this.app.stage.children
            .slice(1)
            .forEach(item => {
              item.y = item.y + this.height / 2 * (e.deltaY < 0 ? 1 : -1)
            })
          this.app.stage.y = -this.height
        }
    }

    _handlePointerdown (e: PointerEvent) {
      if (['select', 'text', 'pic'].includes(config.drawType)) return
      const _this = this
      const { x, y } = e
      this.isDraw = true
      this.downPoint = {
        x: x + Math.abs(this.app.stage.x) / 2,
        y: y + Math.abs(this.app.stage.y) / 2
      }
      this.ghContainer = new PIXI.Container()
      // 保存每个图形的随机偏移点
      this.ghContainer.offsetPoints = []
      this.ghContainer.on('pointerenter', function (this: PIXI.Container) {
        this.children[0].cursor = 'move'
      })
      this.ghContainer.on('pointerdown', function (this: PIXI.Container & IExtendThis, e) {
        e.stopPropagation()
        this.isMove = true
        this.startPoint = { x: e.x, y: e.y}
        _this.ghContainer = this
      })
      this.ghContainer.on('pointerup', function (this: PIXI.Container & IExtendThis, e) {
        e.stopPropagation()
        this.isMove = false
      })
      this.ghContainer.on('pointermove', function (this: PIXI.Container & IExtendThis, e) {
        if (!this.isMove) return
        const mX = e.x - this.startPoint.x,
              mY = e.y - this.startPoint.y
        this.startPoint = { x: e.x, y: e.y }
        this.x += mX
        this.y += mY
      })
    }

    _handlePointerup () {
      this.isDraw = false
      this.ghContainer = undefined
      config.drawType = 'select'
    }

    _handlePointermove (e: PointerEvent) {
      if (!this.isDraw) return
      this.app.stage.addChild(this.ghContainer as PIXI.Container)
      const mX = e.x + Math.abs(this.app.stage.x) / 2
      const mY = e.y + Math.abs(this.app.stage.y) / 2
      const type: any = {
        rect: () => (this as any).drawRect(mX, mY),
        diamond: () => (this as any).drawDiamond(mX, mY),
        arc: () => (this as any).drawArc(mX, mY),
        arrow: () => (this as any).drawLineSegment(mX, mY, 'arrow'),
        line: () => (this as any).drawLineSegment(mX, mY),
        pen: () => (this as any).drawLine(mX, mY)
      }
      type[config.drawType]()
    }

    installEventListener () {
      this.app.stage.on('wheel', (e: WheelEvent) => this._handleWheel(e))
      this.app.stage.on('pointerdown', (e: PointerEvent) => this._handlePointerdown(e))
      this.app.stage.on('pointerup', () => this._handlePointerup())
      this.app.stage.on('pointermove', (e: PointerEvent) => this._handlePointermove(e))
    }
  }
  return {
    CreateSceen
  }
}
