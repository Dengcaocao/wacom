import * as PIXI from 'pixi.js'
import type { IElementStyle } from '@/stores/types'

export interface IGraphicsConfig {
  drawType: string
  styleConfig: IElementStyle
}
export interface IBaseParams {
  width: number
  height: number,
  bgColor?: number,
  graphicsConfig: IGraphicsConfig
  dom: HTMLElement
}

export interface IPoint {
  x: number
  y: number
}
// 扩展容器或图形上的属性
export interface IExtendAttribute {
  drawType: string
  isMove?: boolean
  startPoint?: IPoint
  styleConfig: IElementStyle
  randomOffset?: number[]
  vertexData: number[]
}

export type ExtendContainer = PIXI.Container & { customInfo?: IExtendAttribute }

export type ExtendGraphics = PIXI.Graphics & { customVertexData?: number[] }

export interface IExtremePoint {
  elm: PIXI.Graphics
  type: string
  point: IPoint
  direction: string
  angle: number
  distance: number
}

export type MainElm = PIXI.Graphics | PIXI.Text | PIXI.Sprite
