import Application from "@/actions/application"
/**
 * 滚动事件处理
 * @param e 事件对象
 */
export function handleWheel (
  this: Application,
  { deltaX, deltaY }: WheelEvent
) {
  // 输入时禁止滚动
  const textareaList = document.querySelectorAll('textarea')
  if (textareaList.length) return
  this.app.stage.x += deltaX * -1
  this.app.stage.y += deltaY * -1
  const screenWidth = this.app.screen.width,
        screenHeight = this.app.screen.height
  // 过滤掉网格元素
  const elements = this.app.stage.children.filter(item => item.name !== 'mesh')
  if (this.app.stage.x >= 0 || this.app.stage.x <= -screenWidth) {
    elements
      .forEach(item => {
        item.x = item.x + (screenWidth / this.scale) / 2 * (deltaX < 0 ? 1 : -1)
      })
    this.app.stage.x = -(screenWidth / this.scale)
  }
  if (this.app.stage.y >= 0 || this.app.stage.y <= -screenHeight) {
    elements
      .forEach(item => {
        item.y = item.y + (screenHeight / this.scale) / 2 * (deltaY < 0 ? 1 : -1)
      })
    this.app.stage.y = -(screenHeight / this.scale)
  }
}