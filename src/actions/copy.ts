import { Container, Graphics, Sprite, Text } from 'pixi.js'
import SpriteImage from './image'
import installElmEvent from '@/event/elmEvent'
import type { ExtendContainer, IExtendAttribute, MainElm } from './types'

/**
 * 递归copy元素
 * @param parentElm 父级容器
 * @param elm 当前元素
 */
function deepCloneGraphic (
  this: Copy,
  parentElm: Container | Graphics,
  elm: Graphics
) {
  // 获去图形数据
  const graphicsData = (<Graphics>elm).geometry.graphicsData
  const graphics = new Graphics()
  parentElm.addChild(graphics)
  graphics.name = elm.name
  graphics.position = elm.position
  graphics.rotation = elm.rotation
  graphics.hitArea = elm.hitArea
  graphics.scale = elm.scale
  graphics.beginFill(
    (<Graphics>elm).fill.color,
    (<Graphics>elm).fill.alpha
  )
  graphics.lineStyle({ ...(<Graphics>elm).line })
  graphicsData.forEach(item => graphics.drawShape(item.shape))
  elm.children.forEach(childElm => deepCloneGraphic.call(this, graphics, <Graphics>childElm))
  // 注册事件
  elm.name === 'main_graphics' && installElmEvent.call(<any>this, graphics)
}

class Copy extends SpriteImage {
  copy () {
    if (!this.container) return
    this.removeSelected()
    const customInfo = <IExtendAttribute>this.container.customInfo
    // 获取主元素 main_graphics main_sprite main_text
    const mainElm = <MainElm>this.container.children.find(elm => /^main/.test(<string>elm.name))
    const mainElmName = <string>mainElm.name
    let { x, y } = this.container
    x += 10, y+= 10
    if (/sprite$/.test(mainElmName)) {
      const url = (mainElm as Sprite).texture.baseTexture.cacheId
      return this.drawImage(url, { x, y })
    }
    const container: ExtendContainer = new Container()
    container.position.set(x, y)
    container.customInfo = {
      ...customInfo,
      styleConfig: { ...customInfo.styleConfig }
    }
    this.app.stage.addChild(container)
    if (/text$/.test(mainElmName)) {
      this.container = container
      this.drawText((mainElm as Text).text, { x, y })
    } else {
      this.container.children
        .filter(elm => !['hitArea_Container', 'selected'].includes(<string>elm.name))
        .forEach(elm => deepCloneGraphic.call(this, container, <Graphics>elm))
      this.container = container
    }
    this.drawSelected()
  }
}

export default Copy
