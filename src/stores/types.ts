export type IDrawType =
  'select' |
  'rect' |
  'diamond' |
  'arc' |
  'mark' |
  'straightLine' |
  'paintingBrush' |
  'text' |
  'image'

export type markType = 'none' | 'arrow' | 'line'

export interface IElementStyle {
  width: 1 | 2 | 4
  color: string
  style: 'solid' | 'dashed'
  alpha: number
  type: 'simple' | 'stroke'
  fillColor: string
  fillStyle: 'simple' | 'line' | 'grid'
  extremePoint_left: markType
  extremePoint_right: markType
  horn: 'right' | 'round'
  [key: string]: any
}
