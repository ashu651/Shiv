import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function Admin() {
  const [counts, setCounts] = useState(null);
  const [reports, setReports] = useState([]);

  const load = async () => {
    const [s, r] = await Promise.all([
      api.get('/moderation/stats'),
      api.get('/moderation/reports'),
    ]);
    setCounts(s.data.counts);
    setReports(r.data.items);
  };

  useEffect(() => { load(); }, []);

  const updateReport = async (id, status) => {
    await api.put(`/moderation/reports/${id}`, { status });
    load();
  };

  if (!counts) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="border rounded p-3"><div className="text-sm text-gray-500">Users</div><div className="text-xl font-bold">{counts.users}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-gray-500">Posts</div><div className="text-xl font-bold">{counts.posts}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-gray-500">Open Reports</div><div className="text-xl font-bold">{counts.openReports}</div></div>
      </div>
      <div className="border rounded p-3">
        <div className="font-medium mb-2">Reports</div>
        <div className="space-y-2">
          {reports.map((rp) => (
            <div key={rp._id} className="border rounded p-3">
              <div className="text-sm text-gray-500">{rp.type} · {rp.status}</div>
              <div className="">{rp.reason}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => updateReport(rp._id, 'resolved')} className="px-3 py-1 rounded border">Resolve</button>
                <button onClick={() => updateReport(rp._id, 'dismissed')} className="px-3 py-1 rounded border">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}