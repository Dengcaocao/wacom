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
    position: absolute;
    top: ${position.y}px;
    left: ${position.x}px;
    transform: translateY(-50%);
    height: ${fontSize}px;
    line-height: 1;
    font-family: LongCang-Regular;
    font-size: ${fontSize}px;
    resize: none;
    box-sizing: content-box;
    border: none;
    outline: none;
    color: transparent;
    caret-color: ${strokeColor};
    background-color: transparent;
  `
  return elm
}

class Text extends Mark {
  drawText (point: { x: number, y: number }) {
    const elm = createElm(
      'textarea',
      {
        // 将stage位置处理为屏幕位置
        x: point.x - Math.abs(this.app.stage.x) / this.scale,
        y: point.y - Math.abs(this.app.stage.y) / this.scale
      },
      this.styleConfig.color
    )
    this.container = new PIXI.Container()
    this.app.stage.addChild(this.container)
    PIXI.Text.defaultResolution = window.devicePixelRatio || 1
    PIXI.Text.defaultAutoResolution = false
    const text: ExtendText = new PIXI.Text('', {
      fontFamily: 'LongCang-Regular',
      fontSize: fontSize,
      fill: this.styleConfig.color
    })
    text.name = 'main_text'
    text.styleConfig = this.styleConfig
    text.position = {
      ...point,
      y: point.y - text.height / 2
    }
    this.container.addChild(text)
    installElmEvent.call(this, text)
    elm.oninput = (e: any) => {
      text.text = e.target.value
      elm.style.width = text.width + 'px'
      elm.style.height = text.height + 'px'
    }
    elm.onblur = () => {
      this.container = undefined
      elm.parentNode?.removeChild(elm)
    }
    this.dom.appendChild(elm)
    setTimeout(() => elm.focus())
  }
}

export default Text
