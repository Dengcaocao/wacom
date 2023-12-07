import { Container, Graphics, Text } from 'pixi.js'
import SpriteImage from './image'
import type { ExtendGraphics, ExtendSprite } from '@/actions/types'
import installElmEvent from '@/event/elmEvent'
import type { IElementStyle } from '@/stores/types'

class Copy extends SpriteImage {
  copy () {
    if (!this.container) return
    let { x, y } = this.container
    x += 10, y+= 10
    const sprite = this.container.getChildByName('main_sprite') as ExtendSprite
    const text = this.container.getChildByName('main_text') as Text
    if (sprite) {
      const url = sprite.texture.baseTexture.cacheId
      this.drawImage(url, { x, y })
      return
    }
    if (text) {
      this.removeSelected()
      this.drawText(text.text, { x, y })
      return this.drawSelected()
    }
    const container = new Container()
    container.position.set(x, y)
    this.app.stage.addChild(container)
    this.container.children
      .filter(elm => elm.name !== 'selected')
      .forEach((elm) => {
        const graphicsData = (elm as ExtendGraphics).geometry.graphicsData
        const graphics: ExtendGraphics = new Graphics()
        container.addChild(graphics)
        graphics.name = elm.name
        graphics.hitArea = elm.hitArea
        graphics.scale = elm.scale
        if (elm.name === 'main_graphics') {
          graphics.styleConfig = { ...(elm as ExtendGraphics).styleConfig as IElementStyle }
          installElmEvent.call(this, graphics)
        }
        graphics.beginFill(
          (elm as ExtendGraphics).fill.color,
          (elm as ExtendGraphics).fill.alpha
        )
        graphics.lineStyle({
          ...(elm as ExtendGraphics).line
        })
        graphicsData.forEach(item => graphics.drawShape(item.shape))
      })
    this.removeSelected()
    this.container = container
    this.drawSelected()
  }
}

export default Copy
