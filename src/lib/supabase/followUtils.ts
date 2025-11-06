import { createClient } from './client';

export async function followUser(followerId: string, followeeId: string) {
  const supabase = createClient();
  
  try {
    // First check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('followee_id', followeeId)
      .single();

    if (existingFollow) {
      return { success: false, error: 'Already following this user' };
    }

    // Create the follow relationship
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
      console.error('Error creating follow:', followError);
      return { success: false, error: followError };
    }

    // Get current counts
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

    // Update counts
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
    console.error('Error in followUser:', error);
    return { success: false, error };
  }
}

export async function unfollowUser(followerId: string, followeeId: string) {
  const supabase = createClient();
  
  try {
    // Delete the follow relationship
    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('followee_id', followeeId);

    if (deleteError) {
      console.error('Error deleting follow:', deleteError);
      return { success: false, error: deleteError };
    }

    // Get current counts
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

    // Update counts
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
    console.error('Error in unfollowUser:', error);
    return { success: false, error };
  }
}