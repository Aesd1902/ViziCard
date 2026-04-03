import { get, set, del, keys } from 'idb-keyval';
import { VisitingCard } from '../types';

const CARDS_KEY = 'vizi_cards_v2';

/**
 * Vizi Card Storage Service
 * Uses IndexedDB (idb-keyval) for high-capacity, private local storage.
 * Data NEVER leaves the user's device.
 */
export const StorageService = {
  /**
   * Save all cards to IndexedDB
   */
  async saveCards(cards: VisitingCard[]): Promise<void> {
    try {
      await set(CARDS_KEY, cards);
    } catch (error) {
      console.error('Failed to save cards to local device storage:', error);
      throw error;
    }
  },

  /**
   * Load all cards from IndexedDB
   */
  async loadCards(): Promise<VisitingCard[]> {
    try {
      const cards = await get<VisitingCard[]>(CARDS_KEY);
      return cards || [];
    } catch (error) {
      console.error('Failed to load cards from local device storage:', error);
      return [];
    }
  },

  /**
   * Clear all storage (for debugging or user reset)
   */
  async clearAll(): Promise<void> {
    await del(CARDS_KEY);
  }
};
