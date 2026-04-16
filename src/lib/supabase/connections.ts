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

export async function getAllUserConnections(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_all_user_connections', {
    p_user_id: userId,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

