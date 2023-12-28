import * as PIXI from 'pixi.js'
import type { IElementStyle, markType } from '@/stores/types'

export interface IGraphicsConfig {
  bgColor: string
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
  isReSize?: boolean,
  startPoint?: IPoint
  styleConfig: IElementStyle
  randomOffset?: number[]
  vertexData: number[],
  controlIndex?: number
}

export type ExtendContainer = PIXI.Container & { customInfo?: IExtendAttribute }

export interface ISize {
  w: number,
  h: number
}

export type ExtendGraphics = PIXI.Graphics & { customVertexData?: number[], customSize?: ISize }

export interface IExtremePoint {
  elm: PIXI.Graphics
  type: markType
  direction: 'left' | 'right'
}

export type MainElm = PIXI.Graphics | PIXI.Text | PIXI.Sprite
