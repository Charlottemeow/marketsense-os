import { createClient } from '@/lib/supabase/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DailyMarketNote, WhyDidItMoveNote, ConfidenceLevel } from '@/types/notes'
import type { TopicDeepDive } from '@/types/notes'
import type { StockPitch, PitchStep, Recommendation, PitchStatus } from '@/types/pitch'

type NoteTable = 'daily_market_notes' | 'why_did_it_move_notes' | 'topic_deep_dives' | 'stock_pitches'

export class NoteService {
  private async getClient(): Promise<SupabaseClient> {
    if (typeof window !== 'undefined') {
      return createClient()
    }
    return createServerSupabaseClient()
  }

  async getDailyNotes(date?: string): Promise<DailyMarketNote[]> {
    const supabase = await this.getClient()
    let query = supabase
      .from('daily_market_notes' as NoteTable)
      .select('*')
      .order('created_at', { ascending: false })

    if (date) {
      query = query.eq('date', date)
    }

    const { data } = await query
    return (data || []) as DailyMarketNote[]
  }

  async getDailyNoteById(id: string): Promise<DailyMarketNote | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('daily_market_notes' as NoteTable)
      .select('*')
      .eq('id', id)
      .single()

    return data as DailyMarketNote | null
  }

  async createDailyNote(note: Omit<DailyMarketNote, 'id' | 'created_at' | 'updated_at'>): Promise<DailyMarketNote | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('daily_market_notes' as NoteTable)
      .insert({
        title: note.title,
        content: note.content,
        date: note.date,
        tags: note.tags,
        is_pinned: note.is_pinned,
        confidence: note.confidence,
        market_context: note.market_context,
      })
      .select()
      .single()

    return data as DailyMarketNote | null
  }

  async updateDailyNote(id: string, updates: Partial<DailyMarketNote>): Promise<DailyMarketNote | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('daily_market_notes' as NoteTable)
      .update({
        title: updates.title,
        content: updates.content,
        tags: updates.tags,
        is_pinned: updates.is_pinned,
        confidence: updates.confidence,
        market_context: updates.market_context,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    return data as DailyMarketNote | null
  }

  async deleteDailyNote(id: string): Promise<boolean> {
    const supabase = await this.getClient()
    const { error } = await supabase
      .from('daily_market_notes' as NoteTable)
      .delete()
      .eq('id', id)

    return !error
  }

  async togglePin(id: string, isPinned: boolean): Promise<DailyMarketNote | null> {
    return this.updateDailyNote(id, { is_pinned: isPinned })
  }

  async getWhyDidItMoveNotes(symbol?: string): Promise<WhyDidItMoveNote[]> {
    const supabase = await this.getClient()
    let query = supabase
      .from('why_did_it_move_notes' as NoteTable)
      .select('*')
      .order('date', { ascending: false })

    if (symbol) {
      query = query.eq('symbol', symbol)
    }

    const { data } = await query
    return (data || []) as WhyDidItMoveNote[]
  }

  async getWhyDidItMoveNoteById(id: string): Promise<WhyDidItMoveNote | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('why_did_it_move_notes' as NoteTable)
      .select('*')
      .eq('id', id)
      .single()

    return data as WhyDidItMoveNote | null
  }

  async createWhyDidItMoveNote(note: Omit<WhyDidItMoveNote, 'id' | 'created_at' | 'updated_at'>): Promise<WhyDidItMoveNote | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('why_did_it_move_notes' as NoteTable)
      .insert({
        title: note.title,
        content: note.content,
        symbol: note.symbol,
        asset_id: note.asset_id,
        date: note.date,
        event_cause: note.event_cause,
        catalyst_summary: note.catalyst_summary,
        confidence: note.confidence,
        related_events: note.related_events,
      })
      .select()
      .single()

    return data as WhyDidItMoveNote | null
  }

  async updateWhyDidItMoveNote(id: string, updates: Partial<WhyDidItMoveNote>): Promise<WhyDidItMoveNote | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('why_did_it_move_notes' as NoteTable)
      .update({
        title: updates.title,
        content: updates.content,
        event_cause: updates.event_cause,
        catalyst_summary: updates.catalyst_summary,
        confidence: updates.confidence,
        related_events: updates.related_events,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    return data as WhyDidItMoveNote | null
  }

  async deleteWhyDidItMoveNote(id: string): Promise<boolean> {
    const supabase = await this.getClient()
    const { error } = await supabase
      .from('why_did_it_move_notes' as NoteTable)
      .delete()
      .eq('id', id)

    return !error
  }

  async getDeepDives(topic?: string): Promise<TopicDeepDive[]> {
    const supabase = await this.getClient()
    let query = supabase
      .from('topic_deep_dives' as NoteTable)
      .select('*')
      .order('created_at', { ascending: false })

    if (topic) {
      query = query.contains('tags', [topic])
    }

    const { data } = await query
    return (data || []) as TopicDeepDive[]
  }

  async getDeepDiveById(id: string): Promise<TopicDeepDive | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('topic_deep_dives' as NoteTable)
      .select('*')
      .eq('id', id)
      .single()

    return data as TopicDeepDive | null
  }

  async createDeepDive(dive: Omit<TopicDeepDive, 'id' | 'created_at' | 'updated_at'>): Promise<TopicDeepDive | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('topic_deep_dives' as NoteTable)
      .insert({
        title: dive.title,
        content: dive.content,
        topic: dive.topic,
        tags: dive.tags,
        related_series_codes: dive.related_series_codes,
        sources: dive.sources,
      })
      .select()
      .single()

    return data as TopicDeepDive | null
  }

  async updateDeepDive(id: string, updates: Partial<TopicDeepDive>): Promise<TopicDeepDive | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('topic_deep_dives' as NoteTable)
      .update({
        title: updates.title,
        content: updates.content,
        tags: updates.tags,
        related_series_codes: updates.related_series_codes,
        sources: updates.sources,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    return data as TopicDeepDive | null
  }

  async deleteDeepDive(id: string): Promise<boolean> {
    const supabase = await this.getClient()
    const { error } = await supabase
      .from('topic_deep_dives' as NoteTable)
      .delete()
      .eq('id', id)

    return !error
  }

  async getPitches(status?: PitchStatus): Promise<StockPitch[]> {
    const supabase = await this.getClient()
    let query = supabase
      .from('stock_pitches' as NoteTable)
      .select('*')
      .order('updated_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data } = await query
    return (data || []) as StockPitch[]
  }

  async getPitchById(id: string): Promise<StockPitch | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('stock_pitches' as NoteTable)
      .select('*, steps(*)')
      .eq('id', id)
      .single()

    return data as StockPitch | null
  }

  async createPitch(pitch: Omit<StockPitch, 'id' | 'created_at' | 'updated_at'>): Promise<StockPitch | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('stock_pitches' as NoteTable)
      .insert({
        symbol: pitch.symbol,
        asset_id: pitch.asset_id,
        title: pitch.title,
        recommendation: pitch.recommendation,
        status: pitch.status || 'draft',
        entry_price: pitch.entry_price,
        current_price: pitch.current_price,
        target_price: pitch.target_price,
        stop_loss: pitch.stop_loss,
        tags: pitch.tags,
        notes: pitch.notes,
        confidence: pitch.confidence,
      })
      .select()
      .single()

    return data as StockPitch | null
  }

  async updatePitch(id: string, updates: Partial<StockPitch>): Promise<StockPitch | null> {
    const supabase = await this.getClient()
    const { data } = await supabase
      .from('stock_pitches' as NoteTable)
      .update({
        recommendation: updates.recommendation,
        status: updates.status,
        current_price: updates.current_price,
        target_price: updates.target_price,
        stop_loss: updates.stop_loss,
        tags: updates.tags,
        notes: updates.notes,
        confidence: updates.confidence,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    return data as StockPitch | null
  }

  async deletePitch(id: string): Promise<boolean> {
    const supabase = await this.getClient()
    const { error } = await supabase
      .from('stock_pitches' as NoteTable)
      .delete()
      .eq('id', id)

    return !error
  }
}
