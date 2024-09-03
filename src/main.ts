'use strict'

import _applyPlugin from './applyPlugin'
import { UserOptions } from './config'
import { jsPDFConstructor, jsPDFDocument } from './documentHandler'
import { parseInput } from './inputParser'
import { drawTable as _drawTable } from './tableDrawer'
import { createTable as _createTable } from './tableCalculator'
import { Table } from './models'
import { CellHookData } from './HookData'
import { Cell, Column, Row } from './models'

export type autoTable = (options: UserOptions) => void

export function applyPlugin(jsPDF: jsPDFConstructor) {
  _applyPlugin(jsPDF)
}

function autoTable(d: jsPDFDocument, options: UserOptions) {
  const input = parseInput(d, options)
  const table = _createTable(d, input)
  _drawTable(d, table)
}

export function __createTable(d: jsPDFDocument, options: UserOptions): Table {
  const input = parseInput(d, options)
  return _createTable(d, input)
}

export function __drawTable(d: jsPDFDocument, table: Table) {
  _drawTable(d, table)
}

try {
  let jsPDF = require('jspdf')

  if (jsPDF.jsPDF) jsPDF = jsPDF.jsPDF
  applyPlugin(jsPDF)
} catch (error) {

}

export default autoTable
export { CellHookData }
export { Table }
export { Row }
export { Column }
export { Cell }
