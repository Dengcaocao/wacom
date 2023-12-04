import * as PIXI from 'pixi.js'
import { createOffsetArr } from '@/utils/utils'
import installElmEvent from '@/event/elmEvent'
import type { IBaseParams, ExtendContainer, ExtendGraphics } from './types'
import type { IElementStyle } from '@/stores/types'

class Base {
  app: PIXI.Application
  dom: HTMLElement
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
    this.dom = dom
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
   * 手绘描边
   * @param elm 描边元素
   * @param index 控制点索引
   * @param vertex 顶点信息
   * @returns 
   */
  drawStroke (
    elm: ExtendGraphics,
    index: number,
    vertex: number[] = []
  ) {
    elm.beginFill(0, 0)
    elm.lineStyle({
      ...this.styleConfig,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND
    })
    const { drawType, type } = this.styleConfig as IElementStyle
    if (drawType === 'paintingBrush') return
    if (drawType === 'arc' && type === 'simple' ) {
      return
    }
    // 记录点位消息
    const offsetPoints = (this.container as ExtendContainer).offsetPoints || []
    const qcPoints = (this.styleConfig as IElementStyle).type === 'simple'
      ? vertex
      : offsetPoints[index]
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
      // 都使用贝塞尔曲线能拿到图形上每个点的信息
      elm.quadraticCurveTo(cpX, cpY, toX, toY)
    }
  }

  /**
   * 创建一个主元素，并添加事件监听
   * @param vertex 顶点信息
   * @param maxNum 随机值的最大数
   * @returns 
   */
  createElement (
    vertex: number[] = [],
    maxNum: number
  ) {
    this.container = this.container || new PIXI.Container()
    this.container.removeChildren()
    this.app.stage.addChild(this.container)
    const graphics: ExtendGraphics = new PIXI.Graphics()
    graphics.name = 'main_graphics'
    graphics.styleConfig = { ...this.styleConfig }
    graphics.position.set(this.startPoints.x, this.startPoints.y)
    this.container.addChild(graphics)
    installElmEvent.call(this as any, graphics)
    // 获取图形在容器中位置，并设置随机偏移点
    const index = this.container.getChildIndex(graphics)
    if (!this.container.offsetPoints) {
      this.container.offsetPoints = [createOffsetArr(maxNum)]
    } else {
      this.container.offsetPoints[index] = this.container.offsetPoints[index] || createOffsetArr(4)
    }
    this.drawStroke(graphics, index, vertex)
    this.drawBackground(graphics, vertex)
    return graphics
  }

  /**
   * 背景绘制
   * @param elm 绘制背景的元素
   * @param vertex 顶点信息
   * @returns 
   */
  drawBackground (elm: ExtendGraphics, vertex: number[] = []) {
    const { drawType ,alpha, fillColor, fillStyle } = elm.styleConfig as IElementStyle
    if (fillColor === 'transparent' || ['mark', 'straightLine'].includes(drawType)) return
    // 绘制背景图形
    const backgroundElm = new PIXI.Graphics()
    backgroundElm.name = 'background_elm'
    elm.addChild(backgroundElm)
    elm.setChildIndex(backgroundElm, elm.children.length - 1)
    backgroundElm.lineStyle({
      ...elm.styleConfig,
      width: 1,
      color: fillColor,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND
    })
    if (fillStyle === 'simple') {
      backgroundElm.beginFill(fillColor, alpha)
      drawType !== 'arc' && backgroundElm.drawPolygon(vertex) 
      return
    }
    backgroundElm.line.alpha = 0
    for (let i = 0; i < vertex.length; i+=6) {
      const [x, y, cpX, cpY, toX, toY] = vertex.slice(i, i+6)
      // 使用贝塞尔曲线绘制获取图形上的每个点
      backgroundElm.moveTo(x, y)
      backgroundElm.quadraticCurveTo(cpX, cpY, toX, toY)
    }
    // 调用后才能获取到points
    backgroundElm.getBounds()
    const points = backgroundElm.geometry.points
    let arr: number[][] = []
    for (let i = 0; i < points.length; i += 2) {
      arr.push([points[i], points[i + 1]])
    }
    if (fillStyle === 'grid') {
      // 添加反向绘制
      const count = arr.length / 4
      const left = [...arr.slice(0, count).reverse(), ...arr.slice(-count)]
      const right = [...arr.slice(count * 2, -count), ...arr.slice(count, count * 2).reverse()]
      arr = [...arr.slice(0, count * 2), ...left, ...right, ...arr.slice(-count * 2)]
    }
    backgroundElm.line.alpha = alpha
    for (let i = 0; i < arr.length/2; i++) {
      const [x, y] = arr[i]
      const [toX, toY] = arr[arr.length - 1 - i]
      backgroundElm.moveTo(x, y)
      backgroundElm.lineTo(toX, toY)
    }
  }

  /**
   * 清空画布
   */
  clear () {
    this.app.stage.children
      .filter(item => item.name !== 'mesh')
      .forEach(item => this.app.stage.removeChild(item))
  }

  /**
   * 将canvas转为base64
   */
  async canvas2Base64 (isDownload: boolean = false, type: string = 'image/png') {
    const children = this.app.stage.children.filter(item => item.name !== 'mesh') as ExtendContainer[]
    let position = {
      x: 0,
      y: 0,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    }
    const displayObject = new PIXI.Container()
    children.forEach(item => {
      const mainName = item.children
        .map(elmItem => elmItem.name)
        .filter(name => /^main/.test(name as string))
        .toString()
      const mainElm = item.getChildByName(mainName) as ExtendGraphics
      const { minX, minY, maxX, maxY } = mainElm.geometry.bounds
      position = {
        x: (!position.x || mainElm.x < position.x) ? mainElm.x : position.x,
        y: (!position.y || mainElm.y < position.y) ? mainElm.y : position.y,
        minX: minX < position.minX ? minX : position.minX,
        minY: minY < position.minY ? minY : position.minY,
        maxX: maxX > position.maxX ? maxX : position.maxX,
        maxY: maxY > position.maxY ? maxY : position.maxY,
      }
    })
    const imgBgElm = new PIXI.Graphics()
    imgBgElm.name = 'img_bg'
    if (this.container) {
      (this as any).removeSelected()
      this.container.addChildAt(imgBgElm, 0)
      displayObject.addChild(this.container)
    } else {
      this.app.stage.addChildAt(imgBgElm, 1)
      displayObject.addChild(imgBgElm, ...children)
    }
    const img = await this.app.renderer.extract.image(displayObject, type)
    imgBgElm.beginFill(0xffffff, 1)
    const { x, y,  minX, minY } = position
    imgBgElm.drawRect(x + minX - 6, y + minY - 6, img.width + 6, img.height + 6)
    let base64 = await this.app.renderer.extract.base64(displayObject, type)
    // 根据下载类型移出背景
    if (isDownload && type === 'image/png') {
      if (this.container) {
        const imgBgElm = this.container.getChildByName('img_bg') as PIXI.DisplayObject
        this.container.removeChild(imgBgElm)
      }
      const imgBgElm = displayObject.getChildByName('img_bg') as PIXI.DisplayObject
      displayObject.removeChild(imgBgElm)
      base64 = await this.app.renderer.extract.base64(displayObject, type)
    }
    // 上面将arr添加到另一个容器中后，导致stage中的图形消失，需再次添加
    this.app.stage.addChild(...children)
    if (this.container) {
      const imgBgElm = this.container.getChildByName('img_bg') as PIXI.DisplayObject
      this.container.removeChild(imgBgElm)
    }
    return base64
  }
}

export default Base
