/**
 * 创建一个偏移量数组
 * @param num 边的数量
 * @param maxOffset 最大偏移量
 */
export const createOffsetArr = (num: number, maxOffset = 3) => {
  /**
   * 一条线由开始点(x,y)、移动点(x,y)和控制点(x,y)组成，共6个
   */
  const createRandomNum = () => Math.random() * (maxOffset * 2) - maxOffset
  // *2绘制两次
  return new Array(num * 6 * 2)
    .fill(0)
    .map(createRandomNum)
}

/**
 * 根据两点计算返回宽度、高度、倾斜角度和距离
 * @param p1 
 * @param p2 
 * @returns 
 */
export const getPoint2PointInfo = (
  p1: { x: number, y: number },
  p2: { x: number, y: number }
) => {
  const width = p2.x - p1.x, height = p2.y - p1.y
  const distance = Math.pow(width * width + height * height, 1/2)
  // 旋转角度
  const direction = width < 0 ? -1 : 1
  let angle = Math.atan2(height, width)
  if (direction === -1) {
    angle = height < 0 ? -Math.PI + angle : Math.PI + angle
  }
  return {
    width,
    height,
    distance,
    angle
  }
}
