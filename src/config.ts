import { CellHook, PageHook } from './models'

export interface LineWidths {
  bottom: number
  top: number
  left: number
  right: number
}

export type FontStyle = 'normal' | 'bold' | 'italic' | 'bolditalic'
export type StandardFontType = 'helvetica' | 'times' | 'courier'
export type CustomFontType = string
export type FontType = StandardFontType | CustomFontType
export type HAlignType = 'left' | 'center' | 'right' | 'justify'
export type VAlignType = 'top' | 'middle' | 'bottom'
export type OverflowType =
  | 'linebreak'
  | 'ellipsize'
  | 'visible'
  | 'hidden'
  | ((text: string | string[], width: number) => string | string[])
export type CellWidthType = 'auto' | 'wrap' | number

export interface Styles {
  font: FontType
  fontStyle: FontStyle
  overflow: OverflowType
  fillColor: Color
  textColor: Color
  halign: HAlignType
  valign: VAlignType
  fontSize: number
  cellPadding: MarginPaddingInput
  lineColor: Color
  lineWidth: number | Partial<LineWidths>
  cellWidth: CellWidthType
  minCellHeight: number
  minCellWidth: number
}

export type ThemeType = 'striped' | 'grid' | 'plain' | null
export type PageBreakType = 'auto' | 'avoid' | 'always'
export type RowPageBreakType = 'auto' | 'avoid'
export type TableWidthType = 'auto' | 'wrap' | number
export type ShowHeadType = 'everyPage' | 'firstPage' | 'never' | boolean
export type ShowFootType = 'everyPage' | 'lastPage' | 'never' | boolean
export type HorizontalPageBreakBehaviourType = 'immediately' | 'afterAllRows'

export interface UserOptions {
  includeHiddenHtml?: boolean
  useCss?: boolean
  theme?: ThemeType
  startY?: number | false
  margin?: MarginPaddingInput
  pageBreak?: PageBreakType
  rowPageBreak?: RowPageBreakType
  tableWidth?: TableWidthType
  showHead?: ShowHeadType
  showFoot?: ShowFootType
  tableLineWidth?: number
  tableLineColor?: Color
  tableId?: string | number
  head?: RowInput[]
  body?: RowInput[]
  foot?: RowInput[]
  html?: string | HTMLTableElement
  columns?: ColumnInput[]
  horizontalPageBreak?: boolean
  horizontalPageBreakRepeat?: string[] | number[] | string | number
  horizontalPageBreakBehaviour?: HorizontalPageBreakBehaviourType

  // Style
  styles?: Partial<Styles>
  bodyStyles?: Partial<Styles>
  headStyles?: Partial<Styles>
  footStyles?: Partial<Styles>
  alternateRowStyles?: Partial<Styles>
  columnStyles?: {
    [key: string]: Partial<Styles>
  }

  didParseCell?: CellHook
  willDrawCell?: CellHook
  didDrawCell?: CellHook
  willDrawPage?: PageHook
  didDrawPage?: PageHook
}

export type ColumnInput =
  | string
  | number
  | {
      header?: CellInput
      title?: CellInput
      footer?: CellInput
      dataKey?: string | number
      key?: string | number 
    }

export type Color = [number, number, number] | number | string | false
export type MarginPaddingInput =
  | number
  | number[]
  | {
      top?: number
      right?: number
      bottom?: number
      left?: number
      horizontal?: number
      vertical?: number
    }

export interface CellDef {
  rowSpan?: number
  colSpan?: number
  styles?: Partial<Styles>
  content?: string | string[] | number
  title?: string 
  _element?: HTMLTableCellElement
}

export class HtmlRowInput extends Array<CellDef> {
  _element: HTMLTableRowElement

  constructor(element: HTMLTableRowElement) {
    super()
    this._element = element
  }
}

export type CellInput = null | string | string[] | number | boolean | CellDef
export type RowInput = { [key: string]: CellInput } | HtmlRowInput | CellInput[]


export function defaultStyles(scaleFactor: number): Styles {
  return {
    font: 'helvetica', 
    fontStyle: 'normal', 
    overflow: 'linebreak', 
    fillColor: false, 
    textColor: 20,
    halign: 'left',
    valign: 'top', 
    cellPadding: 5 / scaleFactor, 
    lineColor: 200,
    lineWidth: 0,
    cellWidth: 'auto', 
    minCellHeight: 0,
    minCellWidth: 0,
  }
}

export type ThemeName = 'striped' | 'grid' | 'plain'
export function getTheme(name: ThemeName): { [key: string]: Partial<Styles> } {
  const themes: { [key in ThemeName]: { [key: string]: Partial<Styles> } } = {
    striped: {
      table: { fillColor: 255, textColor: 80, fontStyle: 'normal' },
      head: { textColor: 255, fillColor: [41, 128, 185], fontStyle: 'bold' },
      body: {},
      foot: { textColor: 255, fillColor: [41, 128, 185], fontStyle: 'bold' },
      alternateRow: { fillColor: 245 },
    },
    grid: {
      table: {
        fillColor: 255,
        textColor: 80,
        fontStyle: 'normal',
        lineWidth: 0.1,
      },
      head: {
        textColor: 255,
        fillColor: [26, 188, 156],
        fontStyle: 'bold',
        lineWidth: 0,
      },
      body: {},
      foot: {
        textColor: 255,
        fillColor: [26, 188, 156],
        fontStyle: 'bold',
        lineWidth: 0,
      },
      alternateRow: {},
    },
    plain: {
      head: { fontStyle: 'bold' },
      foot: { fontStyle: 'bold' },
    },
  }
  return themes[name]
}
