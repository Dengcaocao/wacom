import { Container, Graphics } from 'pixi.js'
import SpriteImage from './image'
import type { ExtendGraphics } from '@/actions/types'
import installElmEvent from '@/event/elmEvent'
import type { IElementStyle } from '@/stores/types'

class Copy extends SpriteImage {
  copy () {
    if (!this.container) return
    const container = new Container()
    this.app.stage.addChild(container)
    this.container.children
      .filter(elm => elm.name !== 'selected')
      .forEach((elm) => {
        const graphicsData = (elm as ExtendGraphics).geometry.graphicsData
        const graphics: ExtendGraphics = new Graphics()
        container.addChild(graphics)
        if (elm.name === 'main_graphics') {
          graphics.styleConfig = { ...(elm as ExtendGraphics).styleConfig as IElementStyle }
          installElmEvent.call(this, graphics)
        }
        graphics.name = elm.name
        graphics.hitArea = elm.hitArea
        graphics.beginFill(
          (elm as ExtendGraphics).fill.color,
          (elm as ExtendGraphics).fill.alpha
        )
        graphics.lineStyle({
          ...(elm as ExtendGraphics).line
        })
        graphics.position.set(elm.parent.x + elm.x + 10, elm.parent.y + elm.y + 10)
        graphicsData.forEach(item => graphics.drawShape(item.shape))
      })
    this.removeSelected()
    this.container = container
    this.drawSelected()
  }
}

export default Copy
