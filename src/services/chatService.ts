import { supabase, ChatMessage } from '../lib/supabase';

export class ChatService {
  /**
   * Saves a new chat message to Supabase.
   * @param userId The ID of the user.
   * @param role The role of the sender ('user' or 'assistant').
   * @param content The content of the message.
   * @returns The saved chat message.
   */
  static async saveChatMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ user_id: userId, role, content })
        .select()
        .single();

      if (error) {
        console.error('Error saving chat message:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to save chat message:', error);
      return null;
    }
  }

  /**
   * Fetches the last N chat messages for a given user.
   * @param userId The ID of the user.
   * @param limit The maximum number of messages to retrieve (default: 20).
   * @returns An array of chat messages, ordered by creation time.
   */
  static async getChatHistory(userId: string, limit: number = 20): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }) // Order by time to maintain conversation flow
        .limit(limit);

      if (error) {
        console.error('Error fetching chat history:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return [];
    }
  }
}
