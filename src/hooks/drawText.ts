import * as PIXI from 'pixi.js'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'

/**
 * 创建dom
 * @param tag 标签
 * @param position 位置
 * @returns elm
 */
const fontSize = 28
const createElm = (tag: string, position: { x: number, y: number }) => {
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
    caret-color: ${config.context.strokeColor};
    background-color: transparent;
  `
  return elm
}

const config = useConfigStore(pinia)

export const useDrawText = (CreateSceen: any) => {

  CreateSceen.prototype.drawText = function (point: { x: number, y: number }) {
    const elm = createElm(
      'textarea',
      {
        x: point.x - Math.abs(this.app.stage.x) / 2,
        y: point.y - Math.abs(this.app.stage.y) / 2
      }
    )
    setTimeout(() => elm.focus())
    elm.onblur = () => {
      this.ghContainer = undefined
      elm.parentNode?.removeChild(elm)
    }
    elm.oninput = (e: any) => {
      this.ghContainer.removeChildren()
      PIXI.Text.defaultAutoResolution = false
      const text = new PIXI.Text(e.target.value, {
        fontFamily: 'LongCang-Regular',
        fontSize: fontSize,
        fill: config.context.strokeColor
      })
      text.position = {
        ...point,
        y: point.y - text.height / 2
      }
      elm.style.width = text.width + 'px'
      elm.style.height = text.height + 'px'
      this.ghContainer.addChild(text)
    }
    config.drawType = 'select'
    this.container.value.appendChild(elm)
  }
}
