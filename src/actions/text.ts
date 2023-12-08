import Mark from './mark'
import * as PIXI from 'pixi.js'
import installElmEvent from '@/event/elmEvent'
import type { ExtendText } from './types'

/**
 * 创建dom
 * @param tag 标签
 * @param position 位置
 * @param strokeColor 文本色彩
 * @returns elm
 */
const fontSize = 28
const createElm = (
  tag: string,
  position: { x: number, y: number },
  strokeColor: string
) => {
  const elm = document.createElement(tag)
  elm.style.cssText = `
    overflow: hidden;
    position: absolute;
    top: ${position.y - fontSize/2}px;
    left: ${position.x}px;
    width: ${fontSize}px;
    height: ${fontSize}px;
    line-height: 1;
    font-family: LongCang-Regular;
    font-size: ${fontSize}px;
    resize: none;
    border: none;
    outline: none;
    color: transparent;
    caret-color: ${strokeColor};
    background-color: transparent;
  `
  return elm
}

class Text extends Mark {
  drawText (txt: string = '', position?: { x: number, y: number }) {
    const elm = createElm(
      'textarea',
      {
        // 将stage位置处理为屏幕位置
        x: this.startPoints.x - Math.abs(this.app.stage.x) / this.scale,
        y: this.startPoints.y - Math.abs(this.app.stage.y) / this.scale
      },
      this.styleConfig.color
    )
    position = position || { ...this.startPoints }
    position.y -= txt ? 0 : fontSize / 2
    this.container = new PIXI.Container()
    this.container.position = position
    this.app.stage.addChild(this.container)
    // PIXI.Text.defaultResolution = window.devicePixelRatio || 1
    // PIXI.Text.defaultAutoResolution = false
    const text: ExtendText = new PIXI.Text(txt, {
      fontFamily: 'LongCang-Regular',
      fontSize: fontSize,
      lineHeight: fontSize,
      fill: this.styleConfig.color
    })
    text.name = 'main_text'
    text.alpha = this.styleConfig.alpha
    text.styleConfig = { ...this.styleConfig }
    this.container.addChild(text)
    installElmEvent.call(this as any, text)
    elm.oninput = (e: any) => {
      text.text = e.target.value
      elm.style.width = text.width + fontSize + 'px'
      elm.style.height = text.height + 'px'
    }
    elm.onblur = () => {
      this.container = undefined
      elm.parentNode?.removeChild(elm)
    }
    !txt && this.dom.appendChild(elm)
    setTimeout(() => elm.focus())
  }
}

export default Text
