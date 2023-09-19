import * as PIXI from 'pixi.js'
import { toRefs, type Ref } from 'vue'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'

const { drawType, updateDrawType, context } = toRefs(useConfigStore(pinia))

export const useDraw = () => {
  class CreateSceen {
    app: PIXI.Application<PIXI.ICanvas>
    container: Ref
    isDraw: boolean
    startPoint: { x: number; y: number}
    lastPoint: { x: number; y: number}
    graphics: PIXI.Graphics | undefined
    constructor (container: Ref, width: number, height: number) {
      this.app = new PIXI.Application({
        width,
        height,
        backgroundColor: 0xffffff,
        antialias: true,
        eventMode: 'static'
      })
      this.container = container
      this.isDraw = false
      this.startPoint = this.lastPoint = { x: 0, y: 0 }
      this.initSize(width, height)
      this.bgMesh()
      this.installEvent()
      container.value.appendChild(this.app.view)
    }
    /**
     * @description: 网格背景绘制
     * @return {*}
     */
    bgMesh () {
      const mesh = new PIXI.Graphics()
      mesh.beginFill('transparent')
      mesh.drawRect(0, 0, this.app.screen.width, this.app.screen.height)
      mesh.endFill()
      const hitArea = new PIXI.Rectangle(0, 0, this.app.screen.width, this.app.screen.height)
      mesh.hitArea = hitArea
      mesh.lineStyle(1, 0x000000, 0.1)
      // 垂直线条
      for (let i = 0; i < this.app.screen.width; i+=20) {
        mesh.moveTo(i, 0)
        mesh.lineTo(i, this.app.screen.height)
      }
      // 水平线条
      for (let i = 0; i < this.app.screen.height; i+=20) {
        mesh.moveTo(0, i)
        mesh.lineTo(this.app.screen.width, i)
      }
      this.app.stage.addChild(mesh)
    }
    initSize (width: number, height: number) {
      if (this.app.view.style) {
        this.app.view.style.width = `${width / 2}px`
        this.app.view.style.height = `${height / 2}px`
      }
      this.app.stage.scale.set(2)
      this.app.stage.x = -window.innerWidth / 2
      this.app.stage.y = -window.innerHeight / 2
    }
    installEvent () {
      // 添加滚动事件，超出边界值重置容器的位置
      this.app.stage.on('wheel', e => {
        this.app.stage.x += e.deltaX * -1
        this.app.stage.y += e.deltaY * -1
        this.app.stage.children
          .slice(1)
          .forEach(item => {
            item.x += e.deltaX * -1
            item.y += e.deltaY * -1
          })
        if (this.app.stage.x >=0 || this.app.stage.x <= -this.app.screen.width || this.app.stage.y >= 0 || this.app.stage.y <= -this.app.screen.height) {
          this.app.stage.x = -window.innerWidth / 2
          this.app.stage.y = -window.innerHeight / 2
        }
      })
      this.app.stage.on('pointerdown', e => {
        // 除2是因为stage容器放大了1倍
        const x = e.x + Math.abs(this.app.stage.x) / 2
        const y = e.y + Math.abs(this.app.stage.y) / 2
        if (drawType.value === 'text') return this.text(x, y)
        this.startPoint = this.lastPoint = { x, y }
        this.isDraw = true
      })
      this.app.stage.on('pointerup', () => {
        drawType.value !== 'arrow' && this.graphics?.removeChildren()
        this.isDraw = false
        this.graphics = undefined
        updateDrawType.value('select')
      })
      this.app.stage.on('pointermove', e => {
        if (!this.isDraw) return
        const x = e.x + Math.abs(this.app.stage.x) / 2
        const y = e.y + Math.abs(this.app.stage.y) / 2
        const actionType = drawType.value
        this[actionType](x, y)
      })
    }
    select () {

    }
    pen (mx: number, my: number) {
      this.line(mx, my)
    }
    pic () {

    }
    /**
     * @description: 创建图形对象实例&监听事件
     * @return {*} graphics
     */
    createGraphics () {
      const graphics: PIXI.Graphics & { isMove?: boolean, startPoint?: { x: number, y: number } } = new PIXI.Graphics()
      const that = this
      graphics.isMove = false
      graphics.cursor = 'grab'
      graphics.on('pointerenter', () => graphics.cursor = 'move')
      graphics.on('pointerdown', function (this: PIXI.Graphics, e) {
        e.stopPropagation()
        that.graphics?.removeChildren()
        that.graphics = graphics
        graphics.isMove = true
        graphics.startPoint = {
          x: e.x,
          y: e.y
        }
        const { minX, minY, maxX, maxY } = this.geometry.bounds
        const skeleton = [
          [minX - 10, minY - 10],
          [maxX + 2, minY - 10],
          [maxX + 2, maxY + 2],
          [minX - 10, maxY + 2]
        ]
        const skeletonChild = new PIXI.Graphics()
        this.addChild(skeletonChild)
        skeletonChild.lineStyle({
          width: 1,
          color: 0x000000,
          alpha: 0.8
        })
        skeletonChild.beginFill(0xffffff, 0)
        skeletonChild.drawRect(minX - 2, minY - 2, maxX - minX + 4, maxY - minY + 4)
        skeleton.forEach(([x, y]) => {
          skeletonChild.beginFill(0xffffff, 0)
          skeletonChild.drawRect(x, y, 8, 8)
        })
      })
      graphics.on('pointermove', e => {
        const x = e.x - (graphics.startPoint?.x || 0)
        const y = e.y - (graphics.startPoint?.y || 0)
        if (!graphics.isMove) return
        graphics.x += x
        graphics.y += y
        graphics.startPoint = {
          x: e.x,
          y: e.y
        }
      })
      graphics.on('pointerup', e => {
        e.stopPropagation()
        graphics.isMove = false
      })
      this.app.stage.addChild(graphics)
      return graphics
    }
    /**
     * @description: 设置线条样式
     * @param {PIXI} graphics 图形
     * @return {*}
     */
    setLineStyle (graphics = this.graphics) {
      if (!graphics) return
      // clear 会清除线的样式
      drawType.value !== 'pen' && graphics.clear()
      graphics.beginFill(
        context.value.fillColor,
        context.value.fillColor === 'transparent' ? 0 : context.value.alpha
      )
      graphics.lineStyle({
        width: context.value.strokeWidth,
        color: context.value.strokeColor,
        alpha: context.value.alpha,
        cap: PIXI.LINE_CAP.ROUND
      })
    }
    /**
     * @description: 矩形绘制
     * @param {number} mx 鼠标移动坐标
     * @param {number} my 鼠标移动坐标
     * @return {*}
     */
    rect (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.setLineStyle()
      // drawRect 宽高不能为负数
      this.graphics.drawPolygon([
        this.startPoint.x, this.startPoint.y,
        mx, this.startPoint.y,
        mx, my,
        this.startPoint.x, my
      ])
    }
    /**
     * @description: 菱形绘制
     * @param {number} mx 鼠标移动坐标
     * @param {number} my 鼠标移动坐标
     * @return {*}
     */
    diamond (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.setLineStyle()
      const distanceX = mx - this.startPoint.x
      const distanceY = my - this.startPoint.y
      this.graphics.drawPolygon([
        this.startPoint.x, this.startPoint.y,
        this.startPoint.x + distanceX, this.startPoint.y + distanceY/2,
        this.startPoint.x, this.startPoint.y + distanceY,
        this.startPoint.x - distanceX, this.startPoint.y + distanceY/2
      ])
    }
    /**
     * @description: 圆形绘制
     * @param {number} mx 鼠标移动坐标
     * @param {number} my 鼠标移动坐标
     * @return {*}
     */
    arc (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.setLineStyle()
      const distanceX = mx - this.startPoint.x
      const distanceY = my - this.startPoint.y
      const r = Math.pow(distanceX * distanceX + distanceY * distanceY, 1/2) / 2
      this.graphics.drawEllipse(this.startPoint.x + distanceX/2, this.startPoint.y + distanceY/2, r, Math.abs(distanceY)/2)
    }
    /**
     * @description: 箭头绘制
     * @param {number} mx 鼠标移动坐标
     * @param {number} my 鼠标移动坐标
     * @return {*}
     */
    arrow (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.setLineStyle()
      this.graphics.moveTo(this.lastPoint.x, this.lastPoint.y)
      this.graphics.lineTo(mx, my)
      const child = this.graphics.children.length
        ? this.graphics.children[0] as PIXI.Graphics
        : this.createGraphics()
      this.graphics.addChild(child)
      const distanceX = mx - this.startPoint.x
      const distanceY = my - this.startPoint.y
      // 箭头方向
      const direction = distanceX < 0 ? -1 : 1
      // 旋转角度
      let deg = Math.atan2(distanceY, distanceX)
      if (direction === -1) {
        deg = distanceY < 0 ? -Math.PI + deg : Math.PI + deg
      }
      this.setLineStyle(child)
      child.x = mx
      child.y = my
      child.rotation = deg
      child.moveTo(0, 0)
      child.lineTo(-20 * direction, -8)
      child.moveTo(0, 0)
      child.lineTo(-20 * direction, 8)
    }
    /**
     * @description: 线段绘制
     * @param {number} mx 鼠标移动坐标
     * @param {number} my 鼠标移动坐标
     * @return {*}
     */
    line (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.setLineStyle()
      this.graphics.moveTo(this.lastPoint.x, this.lastPoint.y)
      this.graphics.lineTo(mx, my)
      drawType.value === 'pen' && (this.lastPoint = { x: mx, y: my })
    }
    /**
     * @description: 文本绘制
     * @param {number} x 鼠标点击坐标
     * @param {number} y 鼠标点击坐标
     * @return {*}
     */
    text (x: number, y: number) {
      updateDrawType.value('select')
      const fontSize = context.value.fontSize
      const text = new PIXI.Text('', {
        fontFamily: 'Arial',
        fontSize: context.value.fontSize,
        letterSpacing: 2,
        fill: context.value.fillColor
      })
      text.alpha = context.value.alpha
      text.x = x
      text.y = y - fontSize
      const input = document.createElement('input')
      input.style.cssText = `
        position: absolute;
        top: ${y - Math.abs(this.app.stage.x) / 2}px;
        left: ${x - Math.abs(this.app.stage.y) / 2}px;
        width: 10px;
        outline: none;
        border: none;
        font-size: ${fontSize}px;
        text-indent: 2px;
        letter-spacing: 4px;
        transform: translateY(-72%);
        color: transparent;
        caret-color: ${context.value.fillColor};
        background-color: transparent;
      `
      this.container.value.appendChild(input)
      setTimeout(() => input.focus())
      input.oninput = (e:any) => {
        text.text = e.target.value
        input.style.width = `${text.width}px`
        this.app.stage.addChild(text)
      }
      input.onblur = () => input.parentNode?.removeChild(input)
    }
  }
  return { CreateSceen }
}
