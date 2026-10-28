// Supabase Edge Function: admin-users
// Secure administrative user management for Little Star Learning Center
// Requires caller to be an authenticated Super Admin.
// Uses server-side SUPABASE_SERVICE_ROLE_KEY to manipulate auth.users safely.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase server environment configuration." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Verify caller authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user: callerUser }, error: callerError } = await userClient.auth.getUser();
    if (callerError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session token." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Admin client with service role
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 3. Verify caller is Super Admin
    const { data: callerProfile, error: profileError } = await adminClient
      .from("profiles")
      .select("role_id")
      .eq("id", callerUser.id)
      .maybeSingle();

    if (profileError || callerProfile?.role_id !== "super_admin") {
      return new Response(
        JSON.stringify({ error: "Access denied. Super Admin privileges required." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Parse request body
    const { action, payload } = await req.json();

    switch (action) {
      case "createUser": {
        const { email, password, username, name, role, phone, avatarUrl, childStudentId, staffId, customPermissions } = payload;
        
        if (!email || !password || !name || !role) {
          return new Response(
            JSON.stringify({ error: "Email, password, name, and role are required." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (password.length < 6) {
          return new Response(
            JSON.stringify({ error: "Password must be at least 6 characters." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Create auth user in Supabase Auth
        const { data: newUserData, error: createAuthError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            username: username ? username.toLowerCase() : email.split("@")[0],
            full_name: name,
            role,
            phone: phone || null,
            avatar_url: avatarUrl || null,
            child_student_id: childStudentId || null,
            staff_id: staffId || null,
            custom_permissions: customPermissions || []
          }
        });

        if (createAuthError || !newUserData?.user) {
          return new Response(
            JSON.stringify({ error: createAuthError?.message || "Failed to create user in Supabase Auth." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const newUserId = newUserData.user.id;

        // Upsert profile in public.profiles to guarantee profile exists
        const { data: profileRecord, error: profileInsertError } = await adminClient
          .from("profiles")
          .upsert({
            id: newUserId,
            username: username ? username.toLowerCase() : email.split("@")[0],
            email,
            full_name: name,
            role_id: role,
            phone: phone || null,
            avatar_url: avatarUrl || null,
            child_student_id: childStudentId || null,
            staff_id: staffId || null,
            status: "active",
            custom_permissions: customPermissions || [],
            updated_at: new Date().toISOString()
          }, { onConflict: "id" })
          .select()
          .single();

        if (profileInsertError) {
          // Rollback: delete created auth user to maintain strict consistency
          await adminClient.auth.admin.deleteUser(newUserId);
          return new Response(
            JSON.stringify({ error: `Failed to create profile: ${profileInsertError.message}. Rolled back auth user creation.` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, user: profileRecord }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "updateUser": {
        const { id, email, password, username, name, role, phone, avatarUrl, childStudentId, staffId, customPermissions, status, freezeReason } = payload;
        
        if (!id) {
          return new Response(
            JSON.stringify({ error: "User ID is required for update." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Prepare auth update attributes
        const authUpdates: any = {};
        if (email) authUpdates.email = email;
        if (password && password.trim().length >= 6) authUpdates.password = password.trim();

        const metaUpdates: any = {};
        if (username) metaUpdates.username = username.toLowerCase();
        if (name) metaUpdates.full_name = name;
        if (role) metaUpdates.role = role;
        if (phone !== undefined) metaUpdates.phone = phone;
        if (avatarUrl !== undefined) metaUpdates.avatar_url = avatarUrl;
        if (childStudentId !== undefined) metaUpdates.child_student_id = childStudentId;
        if (staffId !== undefined) metaUpdates.staff_id = staffId;
        if (customPermissions) metaUpdates.custom_permissions = customPermissions;
        if (status) metaUpdates.status = status;

        if (Object.keys(metaUpdates).length > 0) {
          authUpdates.user_metadata = metaUpdates;
        }

        if (Object.keys(authUpdates).length > 0) {
          const { error: updateAuthError } = await adminClient.auth.admin.updateUserById(id, authUpdates);
          if (updateAuthError) {
            return new Response(
              JSON.stringify({ error: `Failed to update auth credentials: ${updateAuthError.message}` }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        // Update profile in public.profiles
        const profileUpdates: any = {
          updated_at: new Date().toISOString()
        };
        if (username) profileUpdates.username = username.toLowerCase();
        if (email) profileUpdates.email = email;
        if (name) profileUpdates.full_name = name;
        if (role) profileUpdates.role_id = role;
        if (phone !== undefined) profileUpdates.phone = phone;
        if (avatarUrl !== undefined) profileUpdates.avatar_url = avatarUrl;
        if (childStudentId !== undefined) profileUpdates.child_student_id = childStudentId;
        if (staffId !== undefined) profileUpdates.staff_id = staffId;
        if (status) profileUpdates.status = status;
        if (freezeReason !== undefined) profileUpdates.freeze_reason = freezeReason;
        if (customPermissions) profileUpdates.custom_permissions = customPermissions;

        const { data: updatedProfile, error: profileErr } = await adminClient
          .from("profiles")
          .update(profileUpdates)
          .eq("id", id)
          .select()
          .single();

        if (profileErr) {
          return new Response(
            JSON.stringify({ error: `Failed to update profile: ${profileErr.message}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, user: updatedProfile }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "deleteUser": {
        const { id } = payload;
        if (!id) {
          return new Response(
            JSON.stringify({ error: "User ID is required for deletion." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Delete from auth.users (cascades to profiles via FK)
        const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(id);
        if (deleteAuthError) {
          // If user not found in auth.users, try deleting directly from profiles
          await adminClient.from("profiles").delete().eq("id", id);
        }

        return new Response(
          JSON.stringify({ success: true, message: "User deleted successfully." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

