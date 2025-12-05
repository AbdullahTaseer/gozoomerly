import { createClient } from './client';

export interface UserConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: string;
  created_at: string;
  name?: string;
  profile_pic_url?: string;
  email?: string;
}

export async function getAllUserConnections(userId: string, limit: number = 50, offset: number = 0) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_all_user_connections', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

