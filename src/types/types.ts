import * as PIXI from 'pixi.js'

export interface IPoint {
  x: number
  y: number
}
// 扩展容器或图形上的属性
export interface IExtendAttribute {
  isMove?: boolean
  startPoint?: IPoint
  offsetPoints?: number[]
  // 图形
  qcPoints?: number[]
}

export type ExtendContainer = PIXI.Container & IExtendAttribute

export type ExtendGraphics = PIXI.Graphics & IExtendAttribute
