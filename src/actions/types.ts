import * as PIXI from 'pixi.js'
import type { IElementStyle } from '@/stores/types'
export interface IBaseParams {
  width: number
  height: number,
  bgColor?: number,
  styleConfig: IElementStyle
  dom: HTMLElement
}

export interface IPoint {
  x: number
  y: number
}
// 扩展容器或图形上的属性
export interface IExtendAttribute {
  styleConfig?: IElementStyle
  isMove?: boolean
  startPoint?: IPoint
  offsetPoints?: number[][]
  // 图形
  qcPoints?: number[]
}

export type ExtendContainer = PIXI.Container & IExtendAttribute

export type ExtendGraphics = PIXI.Graphics & IExtendAttribute

export type ExtendText = PIXI.Text & IExtendAttribute

export interface IExtremePoint {
  elm: ExtendGraphics
  type: string
  point: IPoint
  direction: string
  angle: number
  distance: number
}

