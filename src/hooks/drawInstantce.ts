import * as PIXI from 'pixi.js'
import { toRaw, type Ref } from 'vue'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import { useFillBgColor } from '@/hooks/fillBgColor'
import { useDrawRect } from '@/hooks/drawRect'
import { useStroke } from '@/hooks/stroke'

interface IExtendThis {
  isMove: boolean,
  startPoint: {
    x: number
    y: number
  }
}

const config = useConfigStore(pinia)
const { stroke } = useStroke()

export const usePixiApp = () => {
  class CreateSceen {
    app: PIXI.Application<PIXI.ICanvas>
    container: Ref
    ghContainer: PIXI.Container | undefined
    width: number
    height: number
    // 是否允许绘制
    isDraw: boolean = false
    // 鼠标按下的坐标
    downPoint: { x: number; y: number} = { x: 0, y: 0 }
    // 鼠标抬起的坐标
    upPoint: { x: number; y: number} = { x: 0, y: 0 }
    points: number[] = []
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
    }

    /**
     * 创建一个偏移量数组
     * @param num 边的数量
     * @param maxOffset 最大偏移量
     */
    createOffsetArr (num: number, maxOffset = 5) {
      /**
       * 一条线由开始点(x,y)、移动点(x,y)和控制点(x,y)组成，共6个
       */
      const createRandomNum = () => Math.random() * (maxOffset * 2) - maxOffset
      // *2绘制两次
      return new Array(num * 6 * 2)
        .fill(0)
        .map(createRandomNum)
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
      const shapeArr = this.ghContainer?.children
        .map((graphics: any) =>
          toRaw(graphics).geometry.graphicsData[0].shape
        )
      this.ghContainer?.removeChildren()
      shapeArr?.forEach((shape: PIXI.IShape) => {
        const graphics = new PIXI.Graphics()
        this.ghContainer?.addChild(graphics)
        this.setGraphicsStyle(graphics)
        graphics.drawShape(shape)
        if (config.context.fillStyle !== 'fill') {
          config.drawInstance.fillBgColor(graphics)
        }
        if (config.context.lineStyle === 'stroke') {
          stroke(graphics, (this.ghContainer as any)?.points)
        }
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
      this.points = this.createOffsetArr(4)
      this.downPoint = {
        x: x + Math.abs(this.app.stage.x) / 2,
        y: y + Math.abs(this.app.stage.y) / 2
      }
      this.ghContainer = new PIXI.Container()
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

    _handlePointerup (e: PointerEvent) {
      this.isDraw = false
      this.points = []
      this.ghContainer = undefined
      config.drawType = 'select'
    }

    _handlePointermove (e: PointerEvent) {
      if (!this.isDraw) return
      this.app.stage.addChild(this.ghContainer as PIXI.Container)
      const { x: sX, y: sY} = this.downPoint
      const mX = e.x + Math.abs(this.app.stage.x) / 2
      const mY = e.y + Math.abs(this.app.stage.y) / 2
      const width = mX - sX
      const height = mY - sY
      // 顶点信息
      const vertex = [
        sX, sY, sX + width / 2, sY, mX, sY,
        mX, sY, mX, sY + height / 2, mX, mY,
        mX, mY, sX + width / 2, mY, sX, mY,
        sX, mY, sX, sY + height / 2, sX, sY
      ]
      this.points = this.createOffsetArr(4)
        .map((item, index) => {
          const vertexIndex = index % vertex.length
          return item + vertex[vertexIndex]
        });
      (this.ghContainer as any).points = this.points
      const type: any = {
        rect: () => (this as any).drawRect(mX, mY)
      }
      type[config.drawType]()
    }

    installEventListener () {
      this.app.stage.on('wheel', (e: WheelEvent) => this._handleWheel(e))
      this.app.stage.on('pointerdown', (e: PointerEvent) => this._handlePointerdown(e))
      this.app.stage.on('pointerup', (e: PointerEvent) => this._handlePointerup(e))
      this.app.stage.on('pointermove', (e: PointerEvent) => this._handlePointermove(e))
    }
  }
  return {
    CreateSceen
  }
}
