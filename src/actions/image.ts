import Draw from './draw'
import { Container, Sprite } from 'pixi.js'
import installElmEvent from '@/event/elmEvent'
import type { ExtendSprite } from './types'

class spriteImage extends Draw {
  drawImage (url: string) {
    this.removeSelected()
    this.container = new Container()
    this.app.stage.addChild(this.container)
    const sprite: ExtendSprite = Sprite.from(url)
    installElmEvent.call(this as any, sprite)
    sprite.name = 'main_sprite'
    sprite.styleConfig = { ...this.styleConfig }
    const image = new Image()
    image.src = url
    image.onload = () => {
      const width = 200,
            height = width * image.height / image.width
      sprite.width = width
      sprite.height = height
      const { x, y } = this.getMappingPoints(window.innerWidth / 2, window.innerHeight / 2)
      sprite.position.set(x - width / 2, y - height / 2)
      this.container?.addChild(sprite)
      this.drawSelected()
    }
  }
}

export default spriteImage
