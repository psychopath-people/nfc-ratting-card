import { supabase } from './supabase'
import { randomBytes } from 'crypto'

export type CardStatus = 'inactive' | 'active'

export type Card = {
  cardId: string
  cafeName: string
  reviewUrl: string
  tapCount: number
  status: CardStatus
  createdAt: string
  updatedAt: string
  pinHash: string
  rowNumber: number
}

function rowToCard(row: Record<string, unknown>): Card {
  const rawStatus = row.status as string
  return {
    cardId: row.id as string,
    cafeName: (row.cafe_name as string) || '',
    reviewUrl: (row.review_url as string) || '',
    tapCount: (row.tap_count as number) || 0,
    status: rawStatus === 'active' ? 'active' : 'inactive',
    createdAt: (row.created_at as string) || '',
    updatedAt: (row.updated_at as string) || '',
    pinHash: (row.pin_hash as string) || '',
    rowNumber: 0,
  }
}

function generateCardId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const bytes = randomBytes(6)
  return Array.from(bytes).map((b) => chars[b % chars.length]).join('')
}

export async function findCard(cardId: string): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (error || !data) return null
  return rowToCard(data)
}

export async function getAllCards(): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(rowToCard)
}

export async function registerCard(): Promise<string> {
  const { data: existing } = await supabase.from('cards').select('id')
  const existingIds = new Set((existing || []).map((r: { id: string }) => r.id))

  let cardId = generateCardId()
  while (existingIds.has(cardId)) cardId = generateCardId()

  const { error } = await supabase.from('cards').insert({
    id: cardId,
    cafe_name: '',
    review_url: '',
    tap_count: 0,
    status: 'inactive',
    pin_hash: '',
  })

  if (error) throw new Error(error.message)
  return cardId
}

export async function activateCard(
  cardId: string,
  cafeName: string,
  reviewUrl: string,
  pinHash: string
) {
  const { error } = await supabase
    .from('cards')
    .update({
      cafe_name: cafeName,
      review_url: reviewUrl,
      status: 'active',
      pin_hash: pinHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cardId)

  if (error) throw new Error(error.message)
}

export async function editCard(
  cardId: string,
  cafeName: string,
  reviewUrl: string,
  newPinHash?: string
) {
  const update: Record<string, unknown> = {
    cafe_name: cafeName,
    review_url: reviewUrl,
    updated_at: new Date().toISOString(),
  }
  if (newPinHash) update.pin_hash = newPinHash

  const { error } = await supabase
    .from('cards')
    .update(update)
    .eq('id', cardId)

  if (error) throw new Error(error.message)
}

export async function resetCard(cardId: string) {
  const { error } = await supabase
    .from('cards')
    .update({
      cafe_name: '',
      review_url: '',
      tap_count: 0,
      status: 'inactive',
      pin_hash: '',
      updated_at: new Date().toISOString(),
    })
    .eq('id', cardId)

  if (error) throw new Error(error.message)
}

export async function incrementTapCount(cardId: string) {
  const { error } = await supabase.rpc('increment_tap_count', { card_id: cardId })
  if (error) {
    // fallback: manual increment
    const card = await findCard(cardId)
    if (card) {
      await supabase
        .from('cards')
        .update({ tap_count: card.tapCount + 1 })
        .eq('id', cardId)
    }
  }
}

export async function setupCard(cardId: string, cafeName: string, mapsUrl: string) {
  await editCard(cardId, cafeName, mapsUrl)
}
