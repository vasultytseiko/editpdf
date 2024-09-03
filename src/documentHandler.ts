import { Table } from './models'
import { Color, Styles, UserOptions } from './config'

let globalDefaults: UserOptions = {}

export type jsPDFConstructor = any
export type jsPDFDocument = any

type Opts = { [key: string]: string | number }

export class DocHandler {
  private readonly jsPDFDocument: jsPDFDocument
  readonly userStyles: Partial<Styles>

  constructor(jsPDFDocument: jsPDFDocument) {
    this.jsPDFDocument = jsPDFDocument
    this.userStyles = {
      textColor: jsPDFDocument.getTextColor
        ? this.jsPDFDocument.getTextColor()
        : 0,
      fontSize: jsPDFDocument.internal.getFontSize(),
      fontStyle: jsPDFDocument.internal.getFont().fontStyle,
      font: jsPDFDocument.internal.getFont().fontName,
      lineWidth: jsPDFDocument.getLineWidth
        ? this.jsPDFDocument.getLineWidth()
        : 0,
      lineColor: jsPDFDocument.getDrawColor
        ? this.jsPDFDocument.getDrawColor()
        : 0,
    }
  }

  static setDefaults(defaults: UserOptions, doc: jsPDFDocument | null = null) {
    if (doc) {
      doc.__autoTableDocumentDefaults = defaults
    } else {
      globalDefaults = defaults
    }
  }

  private static unifyColor(c: Color | undefined): number[] | string[] | null {
    if (Array.isArray(c)) {
      return c
    } else if (typeof c === 'number') {
      return [c, c, c]
    } else if (typeof c === 'string') {
      return [c]
    } else {
      return null
    }
  }

  applyStyles(styles: Partial<Styles>, fontOnly = false) {
  

    if (styles.fontStyle)
      this.jsPDFDocument.setFontStyle &&
        this.jsPDFDocument.setFontStyle(styles.fontStyle)
    let { fontStyle, fontName } = this.jsPDFDocument.internal.getFont()
    if (styles.font) fontName = styles.font
    if (styles.fontStyle) {
      fontStyle = styles.fontStyle
      const availableFontStyles = this.getFontList()[fontName]
      if (
        availableFontStyles &&
        availableFontStyles.indexOf(fontStyle) === -1
      ) {
       
        this.jsPDFDocument.setFontStyle &&
          this.jsPDFDocument.setFontStyle(availableFontStyles[0])
        fontStyle = availableFontStyles[0]
      }
    }
    this.jsPDFDocument.setFont(fontName, fontStyle)

    if (styles.fontSize) this.jsPDFDocument.setFontSize(styles.fontSize)

    if (fontOnly) {
    }

    let color = DocHandler.unifyColor(styles.fillColor)
    if (color) this.jsPDFDocument.setFillColor(...color)

    color = DocHandler.unifyColor(styles.textColor)
    if (color) this.jsPDFDocument.setTextColor(...color)

    color = DocHandler.unifyColor(styles.lineColor)
    if (color) this.jsPDFDocument.setDrawColor(...color)

    if (typeof styles.lineWidth === 'number') {
      this.jsPDFDocument.setLineWidth(styles.lineWidth)
    }
  }

  splitTextToSize(text: string | string[], size: number, opts: Opts): string[] {
    return this.jsPDFDocument.splitTextToSize(text, size, opts)
  }

  rect(
    x: number,
    y: number,
    width: number,
    height: number,
    fillStyle: 'S' | 'F' | 'DF' | 'FD',
  ) {
    // null is excluded from fillStyle possible values because it isn't needed
    // and is prone to bugs as it's used to postpone setting the style
    // https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html#rect
    return this.jsPDFDocument.rect(x, y, width, height, fillStyle)
  }

  getLastAutoTable(): Table | null {
    return this.jsPDFDocument.lastAutoTable || null
  }

  getTextWidth(text: string | string[]): number {
    return this.jsPDFDocument.getTextWidth(text)
  }

  getDocument() {
    return this.jsPDFDocument
  }

  setPage(page: number) {
    this.jsPDFDocument.setPage(page)
  }

  addPage() {
    return this.jsPDFDocument.addPage()
  }

  getFontList(): { [key: string]: string[] | undefined } {
    return this.jsPDFDocument.getFontList()
  }

  getGlobalOptions(): UserOptions {
    return globalDefaults || {}
  }

  getDocumentOptions(): UserOptions {
    return this.jsPDFDocument.__autoTableDocumentDefaults || {}
  }

  pageSize(): { width: number; height: number } {
    let pageSize = this.jsPDFDocument.internal.pageSize

    if (pageSize.width == null) {
      pageSize = {
        width: pageSize.getWidth(),
        height: pageSize.getHeight(),
      }
    }

    return pageSize
  }

  scaleFactor(): number {
    return this.jsPDFDocument.internal.scaleFactor
  }

  getLineHeightFactor(): number {
    const doc = this.jsPDFDocument
    return doc.getLineHeightFactor ? doc.getLineHeightFactor() : 1.15
  }

  getLineHeight(fontSize: number): number {
    return (fontSize / this.scaleFactor()) * this.getLineHeightFactor()
  }

  pageNumber(): number {
    const pageInfo = this.jsPDFDocument.internal.getCurrentPageInfo()
    if (!pageInfo) {
      return this.jsPDFDocument.internal.getNumberOfPages()
    }
    return pageInfo.pageNumber
  }
}
