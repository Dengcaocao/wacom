import Draw from './draw'
import { Container, Sprite } from 'pixi.js'
import installElmEvent from '@/event/elmEvent'

class spriteImage extends Draw {
  drawImage (
    url: string,
    position?: { x: number, y: number },
    size = { width: 0, height: 0 }
  ) {
    const { drawType, styleConfig } = this.graphicsConfig
    let { x, y } = this.getMappingPoints(window.innerWidth / 2, window.innerHeight / 2)
    this.removeSelected()
    const image = new Image()
    image.src = url
    image.onload = () => {
      const width = position ? size.width : 200,
            height = position ? size.height : width * image.height / image.width
      this.container = new Container()
      this.app.stage.addChild(this.container)
      x = position ? position.x : x - width / 2
      y = position ? position.y : y - height / 2
      this.container.position.set(x, y)
      this.container.customInfo = {
        drawType,
        vertexData: [],
        styleConfig: { ...styleConfig }
      }
      const sprite = Sprite.from(url)
      sprite.alpha = styleConfig.alpha
      this.container.addChild(sprite)
      sprite.name = 'main_sprite'
      installElmEvent.call(this as any, sprite)
      sprite.width = width
      sprite.height = height
      this.drawSelected()
    }
  }
}

export default spriteImage
