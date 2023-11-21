import * as PIXI from 'pixi.js'
import { handleWheel } from '@/event/appEvent'
import { type IApplication } from './types'

class Application {
  app: PIXI.Application
  scale: number
  constructor ({ width, height, bgColor, dom }: IApplication) {
    this.app = new PIXI.Application({
      width: width * 2,
      height: height * 2,
      backgroundColor: bgColor || 0xffffff,
      antialias: true,
      eventMode: 'static'
    })
    this.scale = this.app.screen.width / width
    this.initCanvasSize(width, height)
    this.createMesh()
    dom.appendChild(this.app.view as HTMLCanvasElement)
    this.installEventListener()
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
   * 注册事件监听
   */
  installEventListener () {
    this.app.stage.on('wheel', handleWheel.bind(this))
  }
}

export default Application
