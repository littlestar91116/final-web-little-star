import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/admin/users', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { action, payload } = JSON.parse(body || '{}');
              const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
              const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

              // If Supabase service role key is provided, execute backend admin auth actions
              if (supabaseUrl && serviceRoleKey) {
                const adminClient = createClient(supabaseUrl, serviceRoleKey, {
                  auth: { autoRefreshToken: false, persistSession: false }
                });

                if (action === 'createUser') {
                  const { data, error } = await adminClient.auth.admin.createUser({
                    email: payload.email,
                    password: payload.password,
                    email_confirm: true,
                    user_metadata: {
                      username: payload.username,
                      full_name: payload.name,
                      role: payload.role
                    }
                  });

                  if (error) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: error.message }));
                    return;
                  }

                  const { data: profile, error: pErr } = await adminClient
                    .from('profiles')
                    .upsert({
                      id: data.user.id,
                      username: payload.username,
                      email: payload.email,
                      full_name: payload.name,
                      role_id: payload.role,
                      status: payload.status || 'active',
                      phone: payload.phone,
                      avatar_url: payload.avatarUrl,
                      child_student_id: payload.childStudentId,
                      staff_id: payload.staffId,
                      custom_permissions: payload.customPermissions || []
                    }, { onConflict: 'id' })
                    .select()
                    .single();

                  if (pErr) {
                    // Rollback auth user creation if profile creation fails
                    await adminClient.auth.admin.deleteUser(data.user.id);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: pErr.message }));
                    return;
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, user: profile }));
                  return;
                } else if (action === 'updateUser') {
                  const authUpdates: any = {};
                  if (payload.password && payload.password.trim().length >= 6) {
                    authUpdates.password = payload.password.trim();
                  }
                  if (payload.email) {
                    authUpdates.email = payload.email.trim();
                  }
                  if (Object.keys(authUpdates).length > 0) {
                    await adminClient.auth.admin.updateUserById(payload.id, authUpdates);
                  }

                  const { data: profile, error: pErr } = await adminClient
                    .from('profiles')
                    .update({
                      full_name: payload.name,
                      role_id: payload.role,
                      status: payload.status,
                      phone: payload.phone,
                      avatar_url: payload.avatarUrl,
                      freeze_reason: payload.freezeReason,
                      custom_permissions: payload.customPermissions
                    })
                    .eq('id', payload.id)
                    .select()
                    .single();

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, user: profile }));
                  return;
                } else if (action === 'deleteUser') {
                  await adminClient.auth.admin.deleteUser(payload.id);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                  return;
                }
              }

              // Fallback response for dev/mock mode
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, user: payload, mock: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Server error' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), adminApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
