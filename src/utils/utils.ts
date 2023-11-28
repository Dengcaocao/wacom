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
 * 获取最值
 * @param vertex 控制点或顶点信息
 * @returns 
 */
export const getMaximum = (vertex: number[]) => {
  // 6 ==> (x, y, cpX, cpY, toX, toY)
  const points = vertex.filter((_, index) => [0, 1, 4, 5].includes(index % 6))
  const xArr = points.filter((_, index) => index % 2 === 0)
  const yArr = points.filter((_, index) => index % 2 === 1)
  return {
    minX: Math.min(...xArr),
    minY: Math.min(...yArr),
    maxX: Math.max(...xArr),
    maxY: Math.max(...yArr)
  }
}

/**
 * 根据两点计算返回宽度、高度、倾斜角度和距离
 * @param p1 
 * @param p2 
 * @returns 
 */
export const getAngle = (
  p1: { x: number, y: number },
  p2: { x: number, y: number }
) => {
  const width = p2.x - p1.x, height = p2.y - p1.y
  // 箭头方向&旋转角度
  const direction = width < 0 ? -1 : 1
  const distance = Math.pow(width * width + height * height, 1/2) * direction
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
