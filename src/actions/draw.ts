import Text from './text'
import type { ExtendContainer, IExtendAttribute } from './types'

class Draw extends Text {
  paintingBrush (mX: number, mY: number) {
    const { x, y } = this.startPoints
    const container = <ExtendContainer>this.container
    const customInfo = <IExtendAttribute>container.customInfo
    customInfo.vertexData.push(mX - x, mY - y)
    this.createElement()
  }
}

export default Draw
