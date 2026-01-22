import { createClient } from './client';

export interface UserConnection {
  user_id: string;
  follow_id: string;
  name: string;
  profile_pic?: string;
  profile_pic_url?: string;
  is_close_friend: boolean;
  is_favorite: boolean;
  notes?: string;
  followed_at: string;
}

export async function getFollowers(userId: string, limit = 50, offset = 0): Promise<UserConnection[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_user_connections", {
    p_user_id: userId,
    p_type: "followers",
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    throw new Error(`Failed to get followers: ${error.message}`);
  }

  return data || [];
}

export async function getFollowing(userId: string, limit = 50, offset = 0): Promise<UserConnection[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_user_connections", {
    p_user_id: userId,
    p_type: "following",
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    throw new Error(`Failed to get following: ${error.message}`);
  }

  return data || [];
}

export async function recalculateFollowingCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (error) {
    return 0;
  }

  const actualCount = count || 0;

  await supabase
    .from('profiles')
    .update({ following_count: actualCount })
    .eq('id', userId);

  return actualCount;
}

export async function recalculateFollowersCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followee_id', userId);

  if (error) {
    return 0;
  }

  const actualCount = count || 0;

  await supabase
    .from('profiles')
    .update({ followers_count: actualCount })
    .eq('id', userId);

  return actualCount;
}

export async function followUser(followerId: string, followeeId: string) {
  const supabase = createClient();

  try {
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('followee_id', followeeId)
      .single();

    if (existingFollow) {
      return { success: false, error: 'Already following this user' };
    }

    const { data: followData, error: followError } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        followee_id: followeeId,
        is_close_friend: false,
        is_favorite: false
      })
      .select()
      .single();

    if (followError) {
      return { success: false, error: followError };
    }

    const [followerProfile, followeeProfile] = await Promise.all([
      supabase
        .from('profiles')
        .select('following_count')
        .eq('id', followerId)
        .single(),
      supabase
        .from('profiles')
        .select('followers_count')
        .eq('id', followeeId)
        .single()
    ]);

    const updatePromises = [];

    if (!followerProfile.error && followerProfile.data) {
      updatePromises.push(
        supabase
          .from('profiles')
          .update({ following_count: (followerProfile.data.following_count || 0) + 1 })
          .eq('id', followerId)
      );
    }

    if (!followeeProfile.error && followeeProfile.data) {
      updatePromises.push(
        supabase
          .from('profiles')
          .update({ followers_count: (followeeProfile.data.followers_count || 0) + 1 })
          .eq('id', followeeId)
      );
    }

    await Promise.all(updatePromises);

    return {
      success: true,
      data: followData
    };

  } catch (error) {
    return { success: false, error };
  }
}

export async function unfollowUser(followerId: string, followeeId: string) {
  const supabase = createClient();

  try {
    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('followee_id', followeeId);

    if (deleteError) {
      return { success: false, error: deleteError };
    }

    const [followerProfile, followeeProfile] = await Promise.all([
      supabase
        .from('profiles')
        .select('following_count')
        .eq('id', followerId)
        .single(),
      supabase
        .from('profiles')
        .select('followers_count')
        .eq('id', followeeId)
        .single()
    ]);

    const updatePromises = [];

    if (!followerProfile.error && followerProfile.data) {
      updatePromises.push(
        supabase
          .from('profiles')
          .update({ following_count: Math.max((followerProfile.data.following_count || 0) - 1, 0) })
          .eq('id', followerId)
      );
    }

    if (!followeeProfile.error && followeeProfile.data) {
      updatePromises.push(
        supabase
          .from('profiles')
          .update({ followers_count: Math.max((followeeProfile.data.followers_count || 0) - 1, 0) })
          .eq('id', followeeId)
      );
    }

    await Promise.all(updatePromises);

    return {
      success: true
    };

  } catch (error) {
    return { success: false, error };
  }
}