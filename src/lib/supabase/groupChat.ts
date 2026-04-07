import { createClient } from './client';

export type GroupInvitePolicy = 'admins_only' | 'all_members';
export type GroupMemberRole = 'owner' | 'admin' | 'member';

function unwrapRpc<T>(data: unknown): T | null {
  if (data == null) return null;
  if (typeof data === 'object' && data !== null && 'success' in data) {
    const o = data as Record<string, unknown>;
    if (o.success === false) return null;
    if ('data' in o && o.data !== undefined) return o.data as T;
  }
  return data as T;
}

export async function rpcCreateGroupConversation(params: {
  creatorId: string;
  name: string;
  participantIds: string[];
  groupInvitePolicy: GroupInvitePolicy;
}): Promise<{ data: { conversation_id?: string; name?: string; group_invite_policy?: string; member_count?: number } | null; error: Error | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('create_group_conversation', {
    p_creator_id: params.creatorId,
    p_name: params.name.trim().slice(0, 200),
    p_participant_ids: params.participantIds,
    p_group_invite_policy: params.groupInvitePolicy,
  });
  if (error) return { data: null, error: new Error(error.message) };
  const raw = unwrapRpc<Record<string, unknown>>(data) ?? (data as Record<string, unknown> | null);
  if (!raw || typeof raw !== 'object') return { data: null, error: new Error('Invalid response') };
  const conversationId =
    (raw.conversation_id as string) ||
    (raw.conversationId as string) ||
    (typeof raw.id === 'string' ? raw.id : undefined);
  return {
    data: {
      conversation_id: conversationId,
      name: raw.name as string | undefined,
      group_invite_policy: raw.group_invite_policy as string | undefined,
      member_count: typeof raw.member_count === 'number' ? raw.member_count : undefined,
    },
    error: null,
  };
}

export type GroupConversationMember = {
  user_id: string;
  name?: string;
  role?: GroupMemberRole;
  is_active?: boolean;
};

export type GroupConversationDetails = {
  name: string;
  your_role?: GroupMemberRole;
  group_invite_policy?: GroupInvitePolicy;
  member_count_active: number;
  members: GroupConversationMember[];
};

/**
 * Supports RPC shapes:
 * - `{ success, data: { name, members, ... } }`
 * - `{ success, name, your_role, group_invite_policy, member_count_active, members }` (flat)
 */
export function normalizeGroupConversationDetailsPayload(data: unknown): GroupConversationDetails | null {
  if (data == null) return null;

  let root: Record<string, unknown>;
  if (typeof data === 'string') {
    try {
      root = JSON.parse(data) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else if (typeof data === 'object' && data !== null) {
    root = data as Record<string, unknown>;
  } else {
    return null;
  }

  if ('success' in root && root.success === false) {
    return null;
  }

  let payload: Record<string, unknown> = root;
  if ('data' in root && root.data !== undefined && typeof root.data === 'object' && root.data !== null) {
    payload = root.data as Record<string, unknown>;
  } else if ('success' in root && !('data' in root)) {
    payload = { ...root };
    delete payload.success;
  }

  const membersRaw = payload.members;
  const members: GroupConversationMember[] = Array.isArray(membersRaw)
    ? membersRaw
        .filter((row): row is Record<string, unknown> => row != null && typeof row === 'object')
        .map((row) => ({
          user_id: String(row.user_id ?? row.id ?? ''),
          name: typeof row.name === 'string' ? row.name : undefined,
          role: (row.role as GroupMemberRole) || undefined,
          is_active: typeof row.is_active === 'boolean' ? row.is_active : true,
        }))
        .filter((m) => m.user_id.length > 0)
    : [];

  const countFromPayload =
    typeof payload.member_count_active === 'number'
      ? payload.member_count_active
      : typeof (payload as { memberCountActive?: number }).memberCountActive === 'number'
        ? (payload as { memberCountActive: number }).memberCountActive
        : undefined;

  const activeListed = members.filter((m) => m.is_active !== false).length;
  const member_count_active = countFromPayload ?? activeListed ?? members.length;

  const name = typeof payload.name === 'string' ? payload.name : 'Group';

  const your_role = payload.your_role as GroupMemberRole | undefined;
  const group_invite_policy = payload.group_invite_policy as GroupInvitePolicy | undefined;

  return {
    name,
    your_role,
    group_invite_policy,
    member_count_active,
    members,
  };
}

export async function rpcGetGroupConversationDetails(params: {
  userId: string;
  conversationId: string;
}): Promise<{
  data: GroupConversationDetails | null;
  error: Error | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_group_conversation_details', {
    p_user_id: params.userId,
    p_conversation_id: params.conversationId,
  });
  if (error) return { data: null, error: new Error(error.message) };

  const normalized = normalizeGroupConversationDetailsPayload(data);
  if (!normalized) {
    return { data: null, error: new Error('Could not load group details') };
  }
  return { data: normalized, error: null };
}

export async function rpcAddConversationParticipant(params: {
  adderId: string;
  conversationId: string;
  newUserId: string;
}): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.rpc('add_conversation_participant', {
    p_adder_id: params.adderId,
    p_conversation_id: params.conversationId,
    p_new_user_id: params.newUserId,
  });
  if (error) return { success: false, error: new Error(error.message) };
  return { success: true, error: null };
}

export async function rpcRemoveConversationParticipant(params: {
  actorId: string;
  conversationId: string;
  targetUserId: string;
}): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.rpc('remove_conversation_participant', {
    p_actor_id: params.actorId,
    p_conversation_id: params.conversationId,
    p_target_user_id: params.targetUserId,
  });
  if (error) return { success: false, error: new Error(error.message) };
  return { success: true, error: null };
}

export async function rpcLeaveConversation(params: {
  userId: string;
  conversationId: string;
}): Promise<{ ownershipTransferredTo?: string; error: Error | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('leave_conversation', {
    p_user_id: params.userId,
    p_conversation_id: params.conversationId,
  });
  if (error) return { error: new Error(error.message) };
  const raw = unwrapRpc<Record<string, unknown>>(data) ?? (data as Record<string, unknown> | null);
  const transferred =
    raw && typeof raw === 'object'
      ? (raw.ownership_transferred_to as string | undefined) ||
        (raw.ownershipTransferredTo as string | undefined)
      : undefined;
  return { ownershipTransferredTo: transferred, error: null };
}

export async function rpcRejoinConversation(params: {
  userId: string;
  conversationId: string;
}): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.rpc('rejoin_conversation', {
    p_user_id: params.userId,
    p_conversation_id: params.conversationId,
  });
  if (error) return { success: false, error: new Error(error.message) };
  return { success: true, error: null };
}

export async function rpcUpdateGroupConversation(params: {
  actorId: string;
  conversationId: string;
  name: string;
}): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.rpc('update_group_conversation', {
    p_actor_id: params.actorId,
    p_conversation_id: params.conversationId,
    p_name: params.name.trim().slice(0, 200),
  });
  if (error) return { success: false, error: new Error(error.message) };
  return { success: true, error: null };
}

export async function rpcUpdateGroupInvitePolicy(params: {
  actorId: string;
  conversationId: string;
  groupInvitePolicy: GroupInvitePolicy;
}): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.rpc('update_group_invite_policy', {
    p_actor_id: params.actorId,
    p_conversation_id: params.conversationId,
    p_group_invite_policy: params.groupInvitePolicy,
  });
  if (error) return { success: false, error: new Error(error.message) };
  return { success: true, error: null };
}

export async function rpcSetGroupParticipantRole(params: {
  ownerId: string;
  conversationId: string;
  targetUserId: string;
  newRole: 'admin' | 'member';
}): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.rpc('set_group_participant_role', {
    p_owner_id: params.ownerId,
    p_conversation_id: params.conversationId,
    p_target_user_id: params.targetUserId,
    p_new_role: params.newRole,
  });
  if (error) return { success: false, error: new Error(error.message) };
  return { success: true, error: null };
}

export async function rpcTransferGroupOwnership(params: {
  currentOwnerId: string;
  conversationId: string;
  newOwnerId: string;
}): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.rpc('transfer_group_ownership', {
    p_current_owner_id: params.currentOwnerId,
    p_conversation_id: params.conversationId,
    p_new_owner_id: params.newOwnerId,
  });
  if (error) return { success: false, error: new Error(error.message) };
  return { success: true, error: null };
}
