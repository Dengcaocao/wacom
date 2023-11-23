import * as PIXI from 'pixi.js'
import { createOffsetArr } from '@/utils/utils'
import installElmEvent from '@/event/elmEvent'
import type { IBaseParams, ExtendContainer, ExtendGraphics } from './types'
import type { IElementStyle } from '@/stores/types'

class Base {
  app: PIXI.Application
  scale: number
  // 样式配置对象
  styleConfig: IElementStyle
  container: ExtendContainer | undefined
  startPoints: { x: number, y: number } = { x: 0, y: 0 }
  isDraw: boolean = false
  constructor ({ width, height, bgColor, styleConfig, dom }: IBaseParams) {
    this.app = new PIXI.Application({
      width: width * 2,
      height: height * 2,
      backgroundColor: bgColor || 0xffffff,
      antialias: true,
      eventMode: 'static'
    })
    this.scale = this.app.screen.width / width
    this.styleConfig = styleConfig
    this.initCanvasSize(width, height)
    this.createMesh()
    dom.appendChild(this.app.view as HTMLCanvasElement)
  }

  /**
   * 初始化画布大小
   * @param width 原始宽度
   * @param height 原始高度
   */
  initCanvasSize (width: number, height: number) {
    if (this.app.view.style) {
      this.app.view.style.width = `${width}px`
      this.app.view.style.height = `${height}px`
    }
    // 放大2倍
    this.app.stage.scale.set(this.scale)
    this.app.stage.position = { x: -width, y: -height }
  }

  /**
   * 网格线
   * @param isShow 是展示网格线，false 将会被销毁 
   * @returns 
   */
  createMesh (isShow: boolean = true) {
    if (!isShow) {
      const element = this.app.stage.getChildByName('mesh')
      return element?.destroy()
    }
    const mesh = new PIXI.Graphics()
    this.app.stage.addChildAt(mesh, 0)
    const width = this.app.screen.width
    const height = this.app.screen.height
    // 添加可交互区域
    mesh.name = 'mesh'
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
   * 获取映射点
   */
  getMappingPoints (x: number, y: number) {
    return {
      x: x + Math.abs(this.app.stage.x) / this.scale,
      y: y + Math.abs(this.app.stage.y) / this.scale
    }
  }

  /**
   * 初始化元素样式
   * @param elm 元素
   * @param config 样式配置
   */
  initElementStyle (elm: ExtendGraphics, styleConfig: IElementStyle) {
    elm.styleConfig = styleConfig
    const { width, color, alpha, type, fillStyle, fillColor } = styleConfig
    type === 'simple' && elm.lineStyle({
      width,
      color,
      alpha,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND
    })
    fillStyle === 'simple' &&
    fillColor !== 'transparent' &&
    elm.beginFill(fillColor, alpha)
  }

  /**
   * 手绘描边
   * @param elm 元素
   * @param vertex 顶点信息
   * @returns 
   */
  handDrawStroke (
    elm: ExtendGraphics,
    vertex: number[] = []
  ) {
    if (elm.styleConfig?.type !== 'stroke') return
    elm.beginFill(0, 0)
    elm.lineStyle({
      ...elm.styleConfig,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND
    })
    // 记录点位消息
    const index = (this.container as ExtendContainer).getChildIndex(elm)
    const offsetPoints = (this.container as ExtendContainer).offsetPoints || []
    const qcPoints = offsetPoints[index]
      .map((item, index) => {
        const vertexIndex = index % vertex.length
        return item + vertex[vertexIndex]
      })
    elm.qcPoints = qcPoints.length
      ? qcPoints
      : elm.qcPoints
    for (let i = 0; i < (elm.qcPoints as number[]).length; i+=6) {
      const [x, y, cpX, cpY, toX, toY] = (elm.qcPoints as number[]).slice(i, i+6)
      elm.moveTo(x, y)
      elm.quadraticCurveTo(cpX, cpY, toX, toY)
    }
  }

  /**
   * 创建一个主元素，并添加事件监听
   * @param maxNum 随机值的最大数
   * @returns 
   */
  createElement (maxNum: number) {
    this.container = this.container || new PIXI.Container()
    this.container.removeChildren()
    this.app.stage.addChild(this.container)
    const graphics = new PIXI.Graphics()
    graphics.name = 'main_graphics'
    this.container.addChild(graphics)
    installElmEvent.call(this as any, graphics)
    // 获取图形在容器中位置，并设置随机偏移点
    const index = this.container.getChildIndex(graphics)
    if (!this.container.offsetPoints) {
      this.container.offsetPoints = [createOffsetArr(maxNum)]
    } else {
      this.container.offsetPoints[index] = this.container.offsetPoints[index] || createOffsetArr(4)
    }
    return graphics
  }
}

export default Base
