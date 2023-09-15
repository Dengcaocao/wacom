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
      if (this.app.view.style) {
        this.app.view.style.width = `${width / 2}px`
        this.app.view.style.height = `${height / 2}px`
      }
      this.container = container
      this.isDraw = false
      this.startPoint = this.lastPoint = { x: 0, y: 0 }
      this.app.stage.scale.set(2)
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
    installEvent () {
      // 添加滚动事件，超出边界值重置容器的位置
      this.app.stage.on('wheel', e => {
        this.app.stage.x += e.deltaX * -1
        this.app.stage.y += e.deltaY * -1
        this.app.stage.children.forEach((item, index) => {
          if (index) {
            item.x += e.deltaX * -1
            item.y += e.deltaY * -1
          }
        })
        if (this.app.stage.x >=0 || this.app.stage.x <= -this.app.screen.width || this.app.stage.y >= 0 || this.app.stage.y <= -this.app.screen.height) {
          this.app.stage.x = -this.app.screen.width / 2
          this.app.stage.y = -this.app.screen.height / 2
        }
      })
      this.app.stage.on('pointerdown', e => {
        if (drawType.value === 'text') return this.text(e.x, e.y)
        this.startPoint = this.lastPoint = { x: e.x, y: e.y}
        this.isDraw = true
      })
      this.app.stage.on('pointerup', () => {
        this.isDraw = false
        this.graphics = undefined
        updateDrawType.value('select')
      })
      this.app.stage.on('pointermove', e => {
        if (!this.isDraw) return
        const actionType = drawType.value
        this[actionType](e.x, e.y)
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
      const graphics = new PIXI.Graphics()
      graphics.cursor = 'grab'
      graphics.on('pointerenter', () => graphics.cursor = 'move')
      graphics.on('pointerdown', () => {
        console.log('pointerdown')
      })
      this.app.stage.addChild(graphics)
      return graphics
    }
    setLineStyle () {
      this.graphics?.lineStyle({
        width: context.value.strokeWidth,
        color: context.value.strokeColor
      })
    }
    rect (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      // clear 会清除线的样式
      this.graphics.clear()
      this.setLineStyle()
      this.graphics.beginFill(context.value.fillColor)
      // drawRect 宽高不能为负数
      this.graphics.drawPolygon([
        this.startPoint.x, this.startPoint.y,
        mx, this.startPoint.y,
        mx, my,
        this.startPoint.x, my
      ])
      this.graphics.endFill()
      // const hitArea = new PIXI.Rectangle(this.startPoint.x, this.startPoint.y, distanceY, distanceY)
      // this.graphics.hitArea = hitArea
    }
    diamond (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.graphics.clear()
      this.setLineStyle()
      const distanceX = mx - this.startPoint.x
      const distanceY = my - this.startPoint.y
      this.graphics.beginFill(context.value.fillColor)
      // drawRect 宽高不能为负数
      this.graphics.drawPolygon([
        this.startPoint.x, this.startPoint.y,
        this.startPoint.x + distanceX, this.startPoint.y + distanceY/2,
        this.startPoint.x, this.startPoint.y + distanceY,
        this.startPoint.x - distanceX, this.startPoint.y + distanceY/2
      ])
      this.graphics.endFill()
    }
    arc (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.graphics.clear()
      this.setLineStyle()
      const distanceX = mx - this.startPoint.x
      const distanceY = my - this.startPoint.y
      const r = Math.pow(distanceX * distanceX + distanceY * distanceY, 1/2) / 2
      this.graphics.beginFill(context.value.fillColor)
      this.graphics.drawEllipse(this.startPoint.x + distanceX/2, this.startPoint.y + distanceY/2, r, Math.abs(distanceY)/2)
      this.graphics.endFill()
    }
    arrow (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      this.graphics.clear()
      this.setLineStyle()
      this.graphics.moveTo(this.lastPoint.x, this.lastPoint.y)
      this.graphics.lineTo(mx, my)
      const child = this.graphics.children.length
        ? this.graphics.children[0] as PIXI.Graphics
        : this.createGraphics()
      child.clear()
      const distanceX = mx - this.startPoint.x
      const distanceY = my - this.startPoint.y
      // 箭头方向
      const direction = distanceX < 0 ? -1 : 1
      // 旋转角度
      let deg = Math.atan2(distanceY, distanceX)
      if (direction === -1) {
        deg = distanceY < 0 ? -Math.PI + deg : Math.PI + deg
      }
      child.lineStyle({
        width: context.value.width,
        color: context.value.strokeColor
      })
      // 将旋转点设置为椭圆中心
      child.x = mx
      child.y = my
      child.rotation = deg
      child.moveTo(0, 0)
      child.lineTo(-20 * direction, -8)
      child.moveTo(0, 0)
      child.lineTo(-20 * direction, 8)
      this.graphics.addChild(child)
    }
    line (mx: number, my: number) {
      this.graphics = this.graphics || this.createGraphics()
      drawType.value !== 'pen' && this.graphics.clear()
      this.setLineStyle()
      this.graphics.moveTo(this.lastPoint.x, this.lastPoint.y)
      this.graphics.lineTo(mx, my)
      drawType.value === 'pen' && (this.lastPoint = { x: mx, y: my })
    }
    text (x: number, y: number) {
      updateDrawType.value('select')
      const text = new PIXI.Text('', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xff1010
      })
      text.x = x
      text.y = y - 20
      const input = document.createElement('input')
      input.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: 10px;
        outline: none;
        border: none;
        font-size: 24px;
        text-indent: 2px;
        letter-spacing: 4px;
        transform: translateY(-65%);
        border: none;
        color: transparent;
        caret-color: ${context.value.strokeColor};
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
