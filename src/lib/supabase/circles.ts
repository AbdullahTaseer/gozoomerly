import { createClient } from './client';

export interface CircleMemberPreview {
  user_id: string;
  profile_pic_url: string;
  name: string;
}

export interface Circle {
  id: string;
  name: string;
  slug: string;
  circle_type?: string;
  description?: string;
  color?: string;
  icon?: string;
  image_url?: string;
  is_default?: boolean;
  is_system_generated?: boolean;
  display_order?: number;
  member_count: number;
  member_previews?: CircleMemberPreview[];
  owner_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CircleWithDetails extends Circle {
  avatars: string[];
  memberCount: number;
}

export async function getUserCircles(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_circles', {
    p_user_id: userId
  });

  if (error) {
    return { data: null, error };
  }

  if (!data || data.length === 0) {
    return { data: [], error: null };
  }

  const circlesWithDetails = data.map((circle: any) => {
    let avatars: string[] = [];
    let memberCount = circle.member_count || 0;

    if (circle.member_previews && Array.isArray(circle.member_previews) && circle.member_previews.length > 0) {
      avatars = circle.member_previews
        .slice(0, 3)
        .map((m: any) => m.profile_pic_url)
        .filter(Boolean);
    }

    return {
      ...circle,
      avatars,
      memberCount,
      member_count: memberCount
    } as CircleWithDetails;
  });

  return { data: circlesWithDetails, error: null };
}

export async function getAllCircles() {
  const supabase = createClient();

  const { data: circleData, error: circleError } = await supabase
    .from('circles')
    .select('*')
    .order('created_at', { ascending: false });

  if (circleError) {
    return { data: null, error: circleError };
  }

  if (!circleData || circleData.length === 0) {
    return { data: [], error: null };
  }

  const circlesWithDetails = circleData.map((circle) => {
    let avatars: string[] = [];
    let memberCount = circle.member_count || 0;

    if (circle.member_previews && Array.isArray(circle.member_previews)) {
      avatars = circle.member_previews
        .slice(0, 3)
        .map((m: any) => m.profile_pic_url)
        .filter(Boolean);
    }

    return {
      ...circle,
      avatars,
      memberCount,
      member_count: memberCount
    } as CircleWithDetails;
  });

  return { data: circlesWithDetails, error: null };
}

export async function getCircleById(circleId: string) {
  const supabase = createClient();

  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', circleId)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: circle, error: null };
}

export async function getCircleMembers(circleId: string, limit: number = 50, offset: number = 0) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_circle_members', {
    p_circle_id: circleId,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function isUserInCircle(circleId: string, userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

export async function addCircleMember(
  circleId: string,
  memberId: string,
  isPinned: boolean = false,
  notes?: string
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('add_circle_member', {
    p_circle_id: circleId,
    p_member_user_id: memberId,
    p_is_pinned: isPinned,
    p_notes: notes || null,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function removeCircleMember(circleId: string, memberId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('remove_circle_member', {
    p_circle_id: circleId,
    p_member_user_id: memberId,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export interface CreateCircleData {
  name: string;
  circle_type?: string;
  description?: string;
  color?: string;
  icon?: string;
  image_url?: string;
  is_default?: boolean;
  display_order?: number;
}

export async function createCircle(circleData: CreateCircleData) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('create_circle', {
    p_name: circleData.name,
    p_circle_type: circleData.circle_type || 'custom',
    p_description: circleData.description || null,
    p_color: circleData.color || null,
    p_icon: circleData.icon || null,
    p_image_url: circleData.image_url || null,
    p_is_default: circleData.is_default || false,
    p_display_order: circleData.display_order || 0,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function deleteCircle(circleId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('delete_circle', {
    p_circle_id: circleId,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updateCircle(circleId: string, circleData: CreateCircleData) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('update_circle', {
    p_circle_id: circleId,
    p_name: circleData.name,
    p_description: circleData.description || null,
    p_color: circleData.color || null,
    p_icon: circleData.icon || null,
    p_image_url: circleData.image_url || null,
    p_is_default: circleData.is_default || null,
    p_display_order: circleData.display_order || null,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

