'use client';
import { useEffect, useState } from 'react';
import { contactsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import AdminModal from '@/components/admin/AdminModal';
import FilterTabs from '@/components/ui/FilterTabs';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Mail, Phone, Building, Globe, CheckCircle, Trash2, Eye } from 'lucide-react';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const fetchContacts = () => {
    setLoading(true);
    const params: Record<string, string> = filterRead !== '' ? { is_read: filterRead } : {};
    contactsAPI.list(params).then((r) => setContacts(r.data.results || r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchContacts(); }, [filterRead]);

  const markRead = async (id: number) => {
    try {
      await contactsAPI.markRead(id);
      fetchContacts();
      if (selected?.id === id) setSelected({ ...selected, is_read: true });
      toast.success('Marked as read');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await contactsAPI.delete(id);
      setSelected(null);
      toast.success('Deleted');
      fetchContacts();
    } catch { toast.error('Failed'); }
  };

  const INTEREST_LABELS: Record<string, string> = {
    virtual_assistant: 'AI Virtual Assistant',
    schedule_demo: 'Schedule Demo',
    events: 'Events',
    sales: 'Sales Chat',
    general: 'General',
  };

  const READ_TABS = [{value:'',label:'All'},{value:'false',label:'Unread'},{value:'true',label:'Read'}];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Contact Inquiries</h1>
        <p className="text-[var(--text-secondary)] mt-1">Customer messages and demo requests</p>
      </div>

      <FilterTabs tabs={READ_TABS} active={filterRead} onChange={setFilterRead} />

      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Company</th>
                <th>Interest</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-[var(--text-muted)]">No inquiries yet</td></tr>
              ) : contacts.map((c: any) => (
                <tr key={c.id} className={!c.is_read ? 'bg-accent/5' : ''}>
                  <td>
                    <div>
                      <p className={`font-medium text-sm ${!c.is_read ? 'text-white' : 'text-[var(--text-secondary)]'}`}>{c.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        <a
                          href={`mailto:${c.email}`}
                          onClick={(e) => { e.stopPropagation(); window.open(`mailto:${c.email}`); }}
                          className="hover:text-accent transition-colors underline underline-offset-2 cursor-pointer"
                        >{c.email}</a>
                      </p>
                    </div>
                  </td>
                  <td className="text-sm">
                    <div className="flex items-center gap-1.5">
                      <Building size={12} className="text-[var(--text-muted)]" /> {c.company_name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
                      <Globe size={11} /> {c.country}
                    </div>
                  </td>
                  <td><span className="badge badge-cyan text-[10px]">{INTEREST_LABELS[c.interest] || c.interest}</span></td>
                  <td className="text-xs">{new Date(c.created_at).toLocaleDateString('en-GB')}</td>
                  <td>
                    {c.is_read
                      ? <span className="badge badge-green text-[10px]">Read</span>
                      : <span className="badge badge-orange text-[10px]">New</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(c)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-all">
                        <Eye size={14} />
                      </button>
                      {!c.is_read && (
                        <button onClick={() => markRead(c.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-green-400 hover:bg-green-400/10 transition-all">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <AdminModal title={selected.name} onClose={() => setSelected(null)}>
            <p className="text-sm text-[var(--text-muted)] -mt-4 mb-6">{selected.job_title || 'No title'} at {selected.company_name}</p>
            <div className="space-y-3 mb-6">
              {[
                { icon: Mail, label: 'Email', value: selected.email, isEmail: true },
                { icon: Phone, label: 'Phone', value: selected.phone },
                { icon: Globe, label: 'Country', value: selected.country },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <r.icon size={14} className="text-accent" />
                  <span className="text-xs text-[var(--text-muted)] w-12">{r.label}</span>
                  {r.isEmail ? (
                    <a href={`mailto:${r.value}`} onClick={(e) => { e.stopPropagation(); window.open(`mailto:${r.value}`); }} className="text-sm text-accent hover:underline cursor-pointer">{r.value}</a>
                  ) : (
                    <span className="text-sm text-[var(--text-secondary)]">{r.value}</span>
                  )}
                </div>
              ))}
              <div className="flex items-start gap-3">
                <span className="badge badge-cyan mt-0.5">{INTEREST_LABELS[selected.interest]}</span>
              </div>
            </div>
            <div className="glass rounded-xl p-4 mb-6">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Message</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selected.message}</p>
            </div>
            <div className="flex gap-3">
              {!selected.is_read && (
                <button onClick={() => markRead(selected.id)} className="btn-primary flex items-center gap-2 text-sm">
                  <CheckCircle size={14} /> Mark as Read
                </button>
              )}
              <a
                onClick={(e) => { e.stopPropagation(); window.open(`mailto:${selected.email}?subject=Re: Your Inquiry&body=Hi ${selected.name},%0D%0A%0D%0A`); }}
                className="btn-ghost text-sm flex items-center gap-2 cursor-pointer"
              >
                <Mail size={14} /> Reply via Email
              </a>
            </div>
        </AdminModal>
      )}
    </div>
  );
}

const INTEREST_LABELS: Record<string, string> = {
  virtual_assistant: 'AI Virtual Assistant',
  schedule_demo: 'Schedule Demo',
  events: 'Events',
  sales: 'Sales Chat',
  general: 'General',
};
