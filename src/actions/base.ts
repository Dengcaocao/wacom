import * as PIXI from 'pixi.js'
import { getPoint2PointInfo } from '@/utils/utils'
import installElmEvent, { equalContainer } from '@/event/elmEvent'
import type { IBaseParams, ExtendContainer, IExtendAttribute, IGraphicsConfig } from './types'
import type { IElementStyle } from '@/stores/types'
import { drawExtremePoint } from './mark'

class Base {
  app: PIXI.Application
  dom: HTMLElement
  scale: number
  // 样式配置对象
  graphicsConfig: IGraphicsConfig
  container: ExtendContainer | undefined
  isDraw: boolean = false
  startPoints: { x: number, y: number } = { x: 0, y: 0 }
  constructor ({ width, height, bgColor, graphicsConfig, dom }: IBaseParams) {
    this.app = new PIXI.Application({
      width: width * 2,
      height: height * 2,
      antialias: true,
      eventMode: 'static',
      backgroundColor: bgColor || 0xffffff,
      resolution: window.devicePixelRatio || 1
    })
    this.dom = dom
    this.scale = this.app.screen.width / width
    this.graphicsConfig = graphicsConfig
    this.initCanvas()
    dom.appendChild(this.app.view as HTMLCanvasElement)
  }

  /**
   * 初始化画布
   */
  initCanvas () {
    const { width, height } = this.app.screen
    const innerWidth = width / this.scale
    const innerHeight = height / this.scale
    const canvasView = <HTMLCanvasElement>this.app.view
    canvasView.setAttribute('style', `width: ${innerWidth}px;height: ${innerHeight}px`)
    this.createMesh()
    // 添加可交互区域
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height)
    // 放大2倍
    this.app.stage.scale.set(this.scale)
    this.app.stage.position = { x: -innerWidth, y: -innerHeight }
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
    mesh.name = 'mesh'
    const { width, height } = this.app.screen
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
   * 更新画布背景
   */
  updateCanvasBg () {
    this.app.renderer.background.init({
      backgroundColor: this.graphicsConfig.bgColor,
      backgroundAlpha: 1,
      clearBeforeRender: true
    })
  }

  /**
   * 创建一个主元素，并添加事件监听
   */
  createElement () {
    const container = this.container as ExtendContainer
    container.removeChildren()
    const graphics = new PIXI.Graphics()
    graphics.name = 'main_graphics'
    container.addChild(graphics)
    installElmEvent.call(<any>this, graphics)
    this.drawStroke(graphics)
    this.drawBackground(graphics)
    return graphics
  }

  /**
   * 手绘描边
   * @param elm 描边元素
   * @param vertexData 元素顶点数据
   * @returns 
   */
  drawStroke (elm: PIXI.Graphics, vertexData?: number[]) {
    const container = this.container as ExtendContainer
    const customInfo = container.customInfo as IExtendAttribute
    const { drawType, styleConfig, randomOffset, vertexData: MainVertexData } = customInfo
    elm.beginFill(0, 0)
    elm.lineStyle({
      ...this.graphicsConfig.styleConfig,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND
    })
    const currVertexData = vertexData || MainVertexData
    if (drawType === 'paintingBrush') {
      // 处理自由绘制
      let [x, y] = currVertexData.slice(0, 2)
      const movePArr = currVertexData.slice(2)
      for (let i = 0; i < movePArr.length; i +=2) {
        const [toX,  toY] = movePArr.slice(i, i+2)
        elm.moveTo(x, y)
        elm.lineTo(toX, toY)
        x = toX, y = toY
      }
      return
    }
    // 根据顶点数据创建随机偏移点
    if (
      !randomOffset ||
      randomOffset.length/currVertexData.length !== 2
    ) {
      customInfo.randomOffset = currVertexData
        .concat(currVertexData)
        .map((_, index) => {
          const max = 3
          const random = Math.random() * (max * 2) - max
          if (drawType !== 'arc') return random
          // 只对原的控制点进行偏移
          return drawType === 'arc' && [3, 4].includes(index % 6)
            ? random
            : 0
        })
    }
    const controlPoints = styleConfig.type === 'simple'
      ? currVertexData
      : (customInfo.randomOffset as number[])
          .map((item, index) => {
            const vertexIndex = index % currVertexData.length
            return item + currVertexData[vertexIndex]
          })
    // 获取累加基数 [x, y, cpX, cpY, toX, toY] ==> [cpX, cpY, toX, toY, toX2, toY2]
    const getAccrualBase = (i: number) => (drawType === 'arc' && i) ? 4 : 6
    // 2 是让能取到最后一个点
    for (let i = 0; i < controlPoints.length; i+= getAccrualBase(i)) {
      const [x, y, cpX, cpY, toX, toY] = controlPoints.slice(i, i+6)
      elm.moveTo(x, y)
      // 都使用贝塞尔曲线能拿到图形上每个点的信息
      elm.quadraticCurveTo(cpX, cpY, toX, toY)
    }
  }

  /**
   * 背景绘制
   * @param elm 绘制背景的元素
   * @returns 
   */
  drawBackground (elm: PIXI.Graphics) {
    const container = this.container as ExtendContainer
    const {
      drawType,
      randomOffset,
      vertexData,
      styleConfig: {
        alpha, type, fillColor, fillStyle
      }
    } = <IExtendAttribute>container.customInfo
    if (fillColor === 'transparent' || ['mark', 'straightLine', 'paintingBrush'].includes(drawType)) return
    this.setHitArea(elm)
    // 创建背景图形
    let backgroundElm_left = container.getChildByName('background_elm_left') as PIXI.Graphics
    if (!backgroundElm_left) {
      backgroundElm_left = new PIXI.Graphics()
      backgroundElm_left.name = 'background_elm_left'
      container.addChild(backgroundElm_left)
      container.setChildIndex(backgroundElm_left, 0)
    }
    backgroundElm_left.lineStyle({
      width: 1,
      color: fillColor,
      alpha,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND
    })
    if (fillStyle === 'simple') {
      backgroundElm_left.beginFill(fillColor, alpha)
      backgroundElm_left.drawPolygon(vertexData)
      return
    }
    // 获取图形上的每个点
    elm.getBounds()
    const graphicsData = elm.geometry.graphicsData
    let p: number[] = []
    const length = type === 'simple'
      ? graphicsData.length
      : graphicsData.length / 2 // 绘制了2条曲线
    for (let i = 0; i < length; i++) {
      // 处理不同类型使绘制方向一样
      if (drawType === 'rect') {
        p = [...p, ...graphicsData[i].points]
      }
      if (drawType === 'arc') {
        // 每隔2个点取一个
        const points = graphicsData[i].points
          .filter((_, index) => [0, 1].includes(index % 6))
        p = [...p, ...points]
      }
      if (drawType === 'diamond' && i % 2 === 1) {
        p = [...p, ...graphicsData[i].points]
      }
    }
    // 绘制背景曲线
    for (let i = 0; i < p.length/2; i+=2) {
      let [x, y] = p.slice(i, i + 2)
      let [toX, toY] = p.slice(p.length - 2 - i)
      for (let j = 0; j < 2; j++) {
        const [o1, o2, o3, o4] = <number[]>randomOffset
          ?.sort(() => Math.random() - 0.5)
          .slice(-4)
        x += o1, y+= o2
        toX += o3, toY+= o4
        const { width, height } = getPoint2PointInfo({x, y}, {x: toX, y: toY})
        backgroundElm_left.moveTo(x, y)
        backgroundElm_left.quadraticCurveTo(x + width/2, y + height/2, toX, toY)
      }
    }
    if (fillStyle === 'grid') {
      let backgroundElm_right = container.getChildByName('background_elm_right') as PIXI.Graphics
      backgroundElm_right = backgroundElm_right || new PIXI.Graphics()
      backgroundElm_right.name = 'background_elm_right'
      container.addChild(backgroundElm_right)
      container.setChildIndex(backgroundElm_right, 0)
      const { minX, maxX } = elm.geometry.bounds
      const positionX = Math.abs(minX) < Math.abs(maxX) ? maxX : minX
      backgroundElm_right.lineStyle(backgroundElm_left.line)
      backgroundElm_right.scale.set(-1, 1)
      backgroundElm_right.position.set(positionX, elm.y)
      backgroundElm_left.geometry.graphicsData.forEach(item => {
        backgroundElm_right.drawShape(item.shape)
      })
    }
  }

  /**
   * 设置元素可交互区域
   * @param elm 
   * @returns 
   */
  setHitArea (elm: PIXI.Graphics) {
    const container = <ExtendContainer>elm.parent
    const { drawType, vertexData, styleConfig: { fillColor } } = <IExtendAttribute>container.customInfo
    // 如果选中将交互区域设置为选中范围
    const selectedElm = <PIXI.Graphics>container.getChildByName('selected')
    if (selectedElm) {
      const { minX, minY, maxX, maxY } = elm.geometry.bounds
      elm.hitArea = new PIXI.Rectangle(minX, minY, maxX - minX, maxY - minY)
    }
    // 如果图形被填充交互设置为整个图形
    const isFill = ['rect', 'arc', 'diamond'].includes(drawType) && fillColor !== 'transparent'
    if (isFill) elm.hitArea = new PIXI.Polygon(vertexData)
    // 为图形上的每个点创建一个可交互的区域
    elm.getBounds()
    const points = elm.geometry.graphicsData
      .map(item => item.points)
      .flat()
    // 创建一个装载交互区域的容器
    let hitAreaContainer = <PIXI.Container>container.getChildByName('hitArea_Container')
    if (hitAreaContainer) return
    hitAreaContainer = new PIXI.Container()
    hitAreaContainer.name = 'hitArea_Container'
    container.addChild(hitAreaContainer)
    // 设置层级为最低
    container.setChildIndex(hitAreaContainer, 0)
    hitAreaContainer.removeChildren()
    for (let i = 0; i < points.length; i+=2) {
      const [x, y] = points.slice(i, i+2)
      const hitAreaElm = new PIXI.Graphics()
      hitAreaContainer.addChild(hitAreaElm)
      hitAreaElm.hitArea = new PIXI.Circle(x, y, 8)
      hitAreaElm.on('pointerenter', () => {
        hitAreaElm.cursor = this.graphicsConfig.drawType === 'select'
          ? 'move'
          : 'crosshair'
      })
      hitAreaElm.on('pointerdown', e => {
        if (this.graphicsConfig.drawType !== 'select') return
        e.stopPropagation()
        equalContainer.call(<any>this, elm.parent);
        (this as any).drawSelected()
      })
    }
  }

  /**
   * 重写渲染元素
   * @param lastStyleConfig 样式配置
   * @returns 
   */
  reRender (lastStyleConfig: IElementStyle) {
    if (!this.container) return
    const container = <ExtendContainer>this.container
    const { styleConfig } = <IExtendAttribute>container.customInfo
    // 查找改变的key
    let updateKey: string = ''
    for (const i in styleConfig) {
      if (styleConfig[i] !== lastStyleConfig[i]) {
        updateKey = i
        break
      }
    }
    Object.assign(styleConfig, lastStyleConfig)
    // 递归清楚样式
    const clearStyle = (elm: PIXI.Graphics) => {
      elm.children.forEach(childElm => {
        clearStyle(<PIXI.Graphics>childElm)
      })
      elm.clear()
    }
    // 获取主元素，设置新的样式
    const mainElm = container.children.find(elm => /^main/.test(<string>elm.name))
    if (!mainElm) return
    // 文本
    if (/text$/.test(<string>mainElm.name)) {
      (mainElm as PIXI.Text).style.fill = lastStyleConfig.color
      return mainElm.alpha = lastStyleConfig.alpha
    }
    // 图片
    if (/sprite$/.test(<string>mainElm.name)) return mainElm.alpha = lastStyleConfig.alpha
    /**
     * 更新端点
     * @param mainElm 父元素
     * @param isAll 将更新父元素下所有端点
     */
    const updateExtremePoint = (mainElm: PIXI.Graphics, isAll: boolean = false) => {
      if (!isAll) {
        const direction = <'left'|'right'>updateKey.split('_')[1]
        const childElmName = `extreme_point_elm_${direction}`
        const updateElm = mainElm.getChildByName(childElmName)
        !updateElm && drawExtremePoint.call(<any>this, {
          elm: mainElm,
          type: styleConfig[`extremePoint_${direction}`],
          direction
        })
      }
      mainElm.children
        .forEach(childElm => {
          const direction = childElm.name?.slice(18)
          const type = styleConfig[`extremePoint_${direction}`]
          clearStyle(<PIXI.Graphics>childElm)
          drawExtremePoint.call(<any>this, { elm: mainElm, type, direction: <'left'|'right'>direction })
        })
    }
    const triggerReExtremePointProperty = ['extremePoint_left', 'extremePoint_right']
    if (triggerReExtremePointProperty.includes(updateKey)) return updateExtremePoint(<PIXI.Graphics>mainElm)
    // 描边
    const triggerReStrokeProperty = ['width', 'color', 'type', 'style', 'horn', 'alpha']
    if (triggerReStrokeProperty.includes(updateKey)) {
      clearStyle(<PIXI.Graphics>mainElm)
      this.drawStroke(<PIXI.Graphics>mainElm)
      updateExtremePoint(<PIXI.Graphics>mainElm, true)
    }
    // 填充
    const triggerReFillProperty = ['fillColor', 'fillStyle', 'alpha']
    if (triggerReFillProperty.includes(updateKey)) {
      container.children
        .filter(elm => /^background_elm/.test(<string>elm.name))
        .forEach(elm => clearStyle(<PIXI.Graphics>elm))
      this.drawBackground(<PIXI.Graphics>mainElm)
    }
  }

  copy (copyElm: PIXI.Graphics) {}
 
  /**
   * 删除元素或清空画布
   * @param isDelElm 是否是删除元素
   * @returns 
   */
  clear (isDelElm: boolean) {
    if (isDelElm) {
      this.app.stage.removeChild(this.container as PIXI.DisplayObject)
    } else {
      this.app.stage.children
        .filter(item => item.name !== 'mesh')
        .forEach(item => this.app.stage.removeChild(item))
    }
    this.container = undefined
  }

  /**
   * 将canvas 转为 base64
   * @param type 图片类型 png | jpeg
   * @returns 
   */
  async canvas2Base64 (type: string = 'image/jpeg') {
    // 获取需要保存的元素
    const saveElms = this.container
      ? this.container.children.filter(item => item.name !== 'selected')
      : this.app.stage.children.filter(item => item.name !== 'mesh')
    if (!saveElms.length) return await this.app.renderer.extract.base64(this.app.stage, type)
    // 创建一个保存容器对象,并将元素添加进去
    const saveDisplayObject = new PIXI.Container()
    saveDisplayObject.addChild(...saveElms)
    // 获取容器的大小信息
    const { x, y, width, height } = saveDisplayObject.getBounds()
    // 创建白色背景元素并添加到 saveDisplayObject
    const imgBgElm = new PIXI.Graphics()
    type === 'image/jpeg' && saveDisplayObject.addChildAt(imgBgElm, 0)
    imgBgElm.position.set(x, y)
    imgBgElm.beginFill(this.graphicsConfig.bgColor, 1)
    imgBgElm.drawRect(
      0, 0, width, height
    )
    const base64 = await this.app.renderer.extract.base64(saveDisplayObject, type)
    // 将元素添加到另一个容器中后，导致stage中的图形消失，需再次添加stage中，并删除白色背景
    this.container
      ? this.container.addChild(...saveElms)
      : this.app.stage.addChild(...saveElms)
    return base64
  }
}

export default Base
