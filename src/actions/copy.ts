import { Container, Graphics, Sprite, Text } from 'pixi.js'
import SpriteImage from './image'
import installElmEvent from '@/event/elmEvent'
import type { ExtendContainer, IExtendAttribute } from './types'

class Copy extends SpriteImage {
  copy () {
    if (!this.container) return
    this.removeSelected()
    const customInfo = <IExtendAttribute>this.container.customInfo
    let { x, y } = this.container
    x += 10, y+= 10
    const sprite = this.container.getChildByName('main_sprite') as Sprite
    const text = this.container.getChildByName('main_text') as Text
    if (sprite) {
      const url = sprite.texture.baseTexture.cacheId
      this.drawImage(url, { x, y })
      return
    }
    const container: ExtendContainer = new Container()
    container.position.set(x, y)
    container.customInfo = {
      ...customInfo,
      styleConfig: { ...customInfo.styleConfig }
    }
    this.app.stage.addChild(container)
    if (text) {
      this.container = container
      this.drawText(text.text, { x, y })
    } else {
      this.container.children
        .filter(elm => elm.name !== 'selected')
        .forEach(elm => {
          const graphicsData = (<Graphics>elm).geometry.graphicsData
          const graphics = new Graphics()
          container.addChild(graphics)
          graphics.name = elm.name
          graphics.hitArea = elm.hitArea
          graphics.scale = elm.scale
          elm.name === 'main_graphics' && installElmEvent.call(this as any, graphics)
          graphics.beginFill(
            (<Graphics>elm).fill.color,
            (<Graphics>elm).fill.alpha
          )
          graphics.lineStyle({ ...(<Graphics>elm).line })
          graphicsData.forEach(item => graphics.drawShape(item.shape))
        })
      this.container = container
    }
    this.drawSelected()
  }
}

export default Copy
