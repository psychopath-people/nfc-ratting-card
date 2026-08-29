import { google } from 'googleapis'
import { randomBytes } from 'crypto'

const SHEET_NAME = 'Cards'

// Read env vars inside functions so they're evaluated at request time, not build time
function getSheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID
  if (!id) throw new Error('GOOGLE_SHEET_ID env var tidak di-set')
  return id
}

function getAuth() {
  const raw = process.env.GOOGLE_PRIVATE_KEY || ''
  const privateKey = raw.replace(/\\n/g, '\n')
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() })
}

function generateCardId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const bytes = randomBytes(6)
  return Array.from(bytes).map((b) => chars[b % chars.length]).join('')
}

export type CardStatus = 'registered' | 'active'

export type Card = {
  cardId: string
  cafeName: string
  mapsUrl: string
  tapCount: number
  status: CardStatus
  createdAt: string
  rowNumber: number
}

async function getAllRows() {
  const sheets = getSheets()
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `${SHEET_NAME}!A:G`,
  })
  const rows = response.data.values || []
  return rows.slice(1)
}

export async function findCard(cardId: string): Promise<Card | null> {
  const dataRows = await getAllRows()
  const rowIndex = dataRows.findIndex((row) => row[0] === cardId)
  if (rowIndex === -1) return null
  const row = dataRows[rowIndex]
  return {
    cardId: row[0] || '',
    cafeName: row[1] || '',
    mapsUrl: row[2] || '',
    tapCount: parseInt(row[3] || '0', 10),
    status: (row[4] as CardStatus) || 'registered',
    createdAt: row[5] || '',
    rowNumber: rowIndex + 2,
  }
}

export async function getAllCards(): Promise<Card[]> {
  const dataRows = await getAllRows()
  return dataRows.map((row, i) => ({
    cardId: row[0] || '',
    cafeName: row[1] || '',
    mapsUrl: row[2] || '',
    tapCount: parseInt(row[3] || '0', 10),
    status: (row[4] as CardStatus) || 'registered',
    createdAt: row[5] || '',
    rowNumber: i + 2,
  }))
}

export async function registerCard(): Promise<string> {
  const sheets = getSheets()
  const existingCards = await getAllCards()
  const existingIds = new Set(existingCards.map((c) => c.cardId))
  let cardId = generateCardId()
  while (existingIds.has(cardId)) cardId = generateCardId()

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: `${SHEET_NAME}!A:G`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[cardId, '', '', 0, 'registered', new Date().toISOString(), '']],
    },
  })
  return cardId
}

export async function setupCard(cardId: string, cafeName: string, mapsUrl: string) {
  const sheets = getSheets()
  const existing = await findCard(cardId)
  if (!existing) throw new Error('Card not registered')

  await sheets.spreadsheets.values.update({
    spreadsheetId: getSheetId(),
    range: `${SHEET_NAME}!A${existing.rowNumber}:G${existing.rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[cardId, cafeName, mapsUrl, existing.tapCount, 'active', existing.createdAt, new Date().toISOString()]],
    },
  })
}

export async function incrementTapCount(rowNumber: number, currentCount: number) {
  const sheets = getSheets()
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSheetId(),
    range: `${SHEET_NAME}!D${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[currentCount + 1]] },
  })
}
