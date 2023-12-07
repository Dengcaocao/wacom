import Draw from './draw'
import { Container, Sprite } from 'pixi.js'
import installElmEvent from '@/event/elmEvent'
import type { ExtendSprite } from './types'

class spriteImage extends Draw {
  drawImage (url: string, position?: { x: number, y: number }) {
    let { x, y } = this.getMappingPoints(window.innerWidth / 2, window.innerHeight / 2)
    this.removeSelected()
    const image = new Image()
    image.src = url
    image.onload = () => {
      const width = 200,
            height = width * image.height / image.width
      this.container = new Container()
      x = position ? position.x : x - width / 2
      y = position ? position.y : y - height / 2
      this.container.position.set(x, y)
      this.app.stage.addChild(this.container)
      const sprite: ExtendSprite = Sprite.from(url)
      sprite.alpha = this.styleConfig.alpha
      this.container.addChild(sprite)
      sprite.name = 'main_sprite'
      sprite.styleConfig = { ...this.styleConfig }
      installElmEvent.call(this as any, sprite)
      sprite.width = width
      sprite.height = height
      this.drawSelected()
    }
  }
}

export default spriteImage
