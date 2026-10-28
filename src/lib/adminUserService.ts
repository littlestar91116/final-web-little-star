import { getSupabaseClient, getSupabaseConfig } from './supabase';
import { UserAccount, UserRole } from '../types';

export interface AdminUserPayload {
  id?: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  childStudentId?: string;
  staffId?: string;
  isFrozen?: boolean;
  freezeReason?: string;
  status?: 'active' | 'frozen' | 'suspended';
  customPermissions?: string[];
}

/**
 * Resolves a login identifier (username or email) to an email address.
 * If the user inputs an email, returns it directly.
 * If the user inputs a username, queries Supabase profiles or local accounts to find the associated email.
 */
export async function resolveIdentifierToEmail(
  identifier: string,
  localAccounts: UserAccount[]
): Promise<string> {
  const cleanId = identifier.trim().toLowerCase();
  if (cleanId.includes('@')) {
    return cleanId;
  }

  // 1. Check local accounts first
  const localMatch = localAccounts.find(
    (a) => a.username.toLowerCase() === cleanId
  );
  if (localMatch && localMatch.email) {
    return localMatch.email.toLowerCase();
  }

  // 2. If Supabase is connected, check profiles table
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', cleanId)
        .maybeSingle();

      if (!error && data?.email) {
        return data.email.toLowerCase();
      }
    } catch {
      // Fallback
    }
  }

  // 3. Fallback: synthetic domain for usernames without full email
  return `${cleanId}@littlestar.sch.id`;
}

/**
 * Super Admin: Create a new user account via secure backend or Supabase Edge function.
 * If Supabase is configured, creates the user in auth.users and public.profiles.
 */
export async function createAdminUser(
  payload: AdminUserPayload,
  callerAccessToken?: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  const cleanUsername = payload.username.trim().toLowerCase();
  const cleanEmail = (payload.email?.trim() || `${cleanUsername}@littlestar.sch.id`).toLowerCase();
  const cleanPassword = payload.password?.trim() || '12345';

  if (cleanPassword.length < 6) {
    return {
      success: false,
      error: 'Password minimal harus 6 karakter untuk memenuhi standar keamanan Supabase Auth.'
    };
  }

  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();

  // If Supabase is connected, call backend API or Supabase Edge Function
  if (supabase && config.isConnected) {
    try {
      // 1. Try local/server backend endpoint
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(callerAccessToken ? { Authorization: `Bearer ${callerAccessToken}` } : {})
        },
        body: JSON.stringify({
          action: 'createUser',
          payload: {
            ...payload,
            username: cleanUsername,
            email: cleanEmail,
            password: cleanPassword
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
      }

      // 2. If backend endpoint returned an error or 404, try Supabase Edge Function
      if (response.status === 404 || !response.ok) {
        const edgeRes = await supabase.functions.invoke('admin-users', {
          body: {
            action: 'createUser',
            payload: {
              ...payload,
              username: cleanUsername,
              email: cleanEmail,
              password: cleanPassword
            }
          }
        });

        if (!edgeRes.error && edgeRes.data?.success) {
          return { success: true, user: edgeRes.data.user };
        } else if (edgeRes.error) {
          console.warn('Edge function error:', edgeRes.error);
        }
      }
    } catch (err: any) {
      console.warn('Backend call failed, evaluating fallback:', err);
    }
  }

  // Local / Mock fallback mode
  return {
    success: true,
    user: {
      id: payload.id || `acc-${Date.now().toString().slice(-6)}`,
      username: cleanUsername,
      email: cleanEmail,
      name: payload.name,
      role: payload.role,
      phone: payload.phone,
      avatarUrl: payload.avatarUrl,
      childStudentId: payload.childStudentId,
      staffId: payload.staffId,
      status: payload.status || (payload.isFrozen ? 'frozen' : 'active'),
      freezeReason: payload.freezeReason,
      customPermissions: payload.customPermissions
    }
  };
}

/**
 * Super Admin: Update user credentials, role, status, or profile.
 */
export async function updateAdminUser(
  payload: AdminUserPayload & { id: string },
  callerAccessToken?: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();

  if (supabase && config.isConnected) {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(callerAccessToken ? { Authorization: `Bearer ${callerAccessToken}` } : {})
        },
        body: JSON.stringify({
          action: 'updateUser',
          payload
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
      }

      // Try edge function if local route not configured
      const edgeRes = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'updateUser',
          payload
        }
      });

      if (!edgeRes.error && edgeRes.data?.success) {
        return { success: true, user: edgeRes.data.user };
      }

      // If backend was not available, try direct profile update via Supabase RLS
      const { data: directProfile, error: directErr } = await supabase
        .from('profiles')
        .update({
          full_name: payload.name,
          phone: payload.phone,
          avatar_url: payload.avatarUrl,
          role_id: payload.role,
          status: payload.status || (payload.isFrozen ? 'frozen' : 'active'),
          freeze_reason: payload.freezeReason,
          staff_id: payload.staffId,
          child_student_id: payload.childStudentId,
          custom_permissions: payload.customPermissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', payload.id)
        .select()
        .single();

      if (!directErr && directProfile) {
        return { success: true, user: directProfile };
      }
    } catch (err: any) {
      console.warn('Admin update error:', err);
    }
  }

  // Local / fallback mode
  return {
    success: true,
    user: payload
  };
}

/**
 * Super Admin: Delete user from auth and profiles.
 */
export async function deleteAdminUser(
  userId: string,
  callerAccessToken?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();

  if (supabase && config.isConnected) {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(callerAccessToken ? { Authorization: `Bearer ${callerAccessToken}` } : {})
        },
        body: JSON.stringify({
          action: 'deleteUser',
          payload: { id: userId }
        })
      });

      if (response.ok) {
        return { success: true };
      }

      const edgeRes = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'deleteUser',
          payload: { id: userId }
        }
      });

      if (!edgeRes.error) {
        return { success: true };
      }

      // Direct profile delete fallback
      await supabase.from('profiles').delete().eq('id', userId);
      return { success: true };
    } catch (err: any) {
      console.warn('Admin delete error:', err);
    }
  }

  return { success: true };
}

