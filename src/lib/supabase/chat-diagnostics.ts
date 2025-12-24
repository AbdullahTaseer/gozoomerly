import { createClient } from './client';

export async function checkChatTablesSetup(): Promise<{
  tablesExist: boolean;
  errors: string[];
  details: any;
}> {
  const supabase = createClient();
  const errors: string[] = [];
  const details: any = {};

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);

    if (error) {
      errors.push(`conversations table: ${error.message || JSON.stringify(error)}`);
      details.conversations = { error: error.message || error };
    } else {
      details.conversations = { exists: true, accessible: true };
    }
  } catch (err: any) {
    errors.push(`conversations table: ${err.message || 'Unknown error'}`);
    details.conversations = { error: err.message || err };
  }

  try {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select('id')
      .limit(1);

    if (error) {
      errors.push(`conversation_participants table: ${error.message || JSON.stringify(error)}`);
      details.conversation_participants = { error: error.message || error };
    } else {
      details.conversation_participants = { exists: true, accessible: true };
    }
  } catch (err: any) {
    errors.push(`conversation_participants table: ${err.message || 'Unknown error'}`);
    details.conversation_participants = { error: err.message || err };
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .limit(1);

    if (error) {
      errors.push(`messages table: ${error.message || JSON.stringify(error)}`);
      details.messages = { error: error.message || error };
    } else {
      details.messages = { exists: true, accessible: true };
    }
  } catch (err: any) {
    errors.push(`messages table: ${err.message || 'Unknown error'}`);
    details.messages = { error: err.message || err };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      errors.push(`profiles table: ${error.message || JSON.stringify(error)}`);
      details.profiles = { error: error.message || error };
    } else {
      details.profiles = { exists: true, accessible: true };
    }
  } catch (err: any) {
    errors.push(`profiles table: ${err.message || 'Unknown error'}`);
    details.profiles = { error: err.message || err };
  }

  return {
    tablesExist: errors.length === 0,
    errors,
    details,
  };
}

