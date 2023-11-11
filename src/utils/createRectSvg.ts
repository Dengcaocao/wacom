/**
 * 将SVGEmelent转在线地址
 * @param svg 
 * @returns url
 */
export const getBlobUrl = (svg: SVGSVGElement) => {
  const svgString = new XMLSerializer().serializeToString(svg)
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(svgBlob)
  return url
}

/**
 * 生成svg图片
 * @param width 
 * @param height 
 * @returns svg
 */
export default (width: number, height: number) => {
  // 创建svg标签
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  // 获取点偏移量
  const maxOffset = 5
  const offset = () => Math.random() * 10 - maxOffset // -5 - 5
  width = width - maxOffset
  height = height - maxOffset
  // 创建路径
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  // 设置路径数据
  const pathData = `
    M${maxOffset + offset()},${maxOffset + offset()} Q${width/2},${maxOffset} ${width + offset()},${maxOffset + offset()}
    M${maxOffset + offset()},${maxOffset + offset()} Q${width/2},${maxOffset} ${width + offset()},${maxOffset + offset()}

    M${width - offset()},${maxOffset + offset()} Q${width - maxOffset},${height/2} ${width + offset()},${height - offset()}
    M${width - offset()},${maxOffset + offset()} Q${width - maxOffset},${height/2} ${width + offset()},${height - offset()}

    M${width + offset()},${height + offset()} Q${width/2},${height - maxOffset} ${maxOffset + offset()},${height - offset()}
    M${width + offset()},${height + offset()} Q${width/2},${height - maxOffset} ${maxOffset + offset()},${height - offset()}

    M${maxOffset + offset()},${height + offset()} Q${maxOffset},${height/2} ${maxOffset + offset()},${maxOffset - offset()}
    M${maxOffset + offset()},${height + offset()} Q${maxOffset},${height/2} ${maxOffset + offset()},${maxOffset - offset()}
  `
  path.setAttribute('d', pathData)
  path.setAttribute('stroke', 'black')
  path.setAttribute('stroke-width', '1')
  path.setAttribute('fill', 'none') // 去掉填充
  svg.appendChild(path)

  return svg
}
