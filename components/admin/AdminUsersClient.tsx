'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import type { ManagedUser } from '@/lib/db/users';
import { saveUser } from '@/lib/actions/users';
import { TurnstileForm, TurnstileField } from '@/components/shared/TurnstileForm';

export function AdminUsersClient({ users, currentUserId }: { users: ManagedUser[]; currentUserId: string }) {
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return <div className="space-y-4">
    {message && <p role="status" className="p-3 rounded-xl border">{message}</p>}
    <div className="overflow-x-auto border border-pbs-gray-200 dark:border-pbs-gray-800 rounded-2xl">
      <table className="w-full text-left text-sm"><thead className="bg-pbs-gray-100 dark:bg-pbs-gray-900"><tr>{['Name', 'Email', 'Company', 'Role', 'Verified', ''].map((label, i) => <th key={i} className="p-4">{label}</th>)}</tr></thead>
        <tbody>{users.map(user => <tr key={user.id} className="border-t border-pbs-gray-200 dark:border-pbs-gray-800"><td className="p-4">{user.name}</td><td className="p-4">{user.email}</td><td className="p-4">{user.company || '—'}</td><td className="p-4">{user.role}</td><td className="p-4">{user.emailVerified ? 'Yes' : 'No'}</td><td className="p-4"><button className="text-pbs-red font-semibold" onClick={() => { setEditing(user); setMessage(''); }}>Edit<span className="sr-only"> {user.name}</span></button></td></tr>)}</tbody>
      </table>{users.length === 0 && <p className="p-8 text-center">No users found.</p>}
    </div>
    {editing && <TurnstileForm key={editing.id} actionName="user_edit" className="border rounded-2xl p-6 space-y-4" onSubmit={async (event, token) => {
      event.preventDefault();
      setPending(true);
        try {
          const result = await saveUser(editing, token);
          if (result.error) { setMessage(result.error); return; }
          setEditing(null); setMessage('User updated.'); router.refresh();
        } catch { setMessage('Unable to update this user. Please try again.'); }
        finally { setPending(false); }
    }}>
      <h2 className="text-lg font-bold">Edit {editing.email}</h2>
      {(['name', 'company', 'phone'] as const).map(field => <label key={field} className="block capitalize">{field}<input required={field === 'name'} maxLength={field === 'phone' ? 50 : 200} value={editing[field]} onChange={event => setEditing({ ...editing, [field]: event.target.value })} className="block border rounded-lg p-2 mt-1 w-full bg-transparent" /></label>)}
      <label className="block">Role<select className="block border rounded-lg p-2 mt-1 bg-white dark:bg-pbs-gray-900" value={editing.role} disabled={editing.id === currentUserId} onChange={event => setEditing({ ...editing, role: event.target.value })}><option value="customer">Customer</option><option value="admin">Admin</option></select></label>
      <p className="text-sm text-pbs-gray-500">Admins can manage all website users.</p>
      <TurnstileField />
      <div className="flex gap-3"><button disabled={pending} className="bg-pbs-red text-white px-5 py-2 rounded-lg disabled:opacity-50">{pending ? 'Saving…' : 'Save changes'}</button><button type="button" disabled={pending} onClick={() => setEditing(null)}>Cancel</button></div>
    </TurnstileForm>}
  </div>;
}
