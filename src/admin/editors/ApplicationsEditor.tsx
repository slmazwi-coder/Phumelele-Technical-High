import React, { useMemo, useState } from 'react';
import { getApplications, setApplications, calculateAverageMark, type Application } from '../utils/storage';
import { Download, ChevronDown, Search, User, FileDown, ArrowUpDown, FileText } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-600',
  Reviewed: 'bg-blue-600',
  Accepted: 'bg-green-600',
  Rejected: 'bg-red-600',
};

function downloadDataUrl(dataUrl: string, fileName: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function toCSVRow(values: (string | number)[]) {
  return values
    .map((v) => {
      const s = String(v ?? '');
      const escaped = s.replace(/"/g, '""');
      return `"${escaped}"`;
    })
    .join(',');
}

export const ApplicationsEditor = () => {
  const [apps, setApps] = useState<Application[]>(getApplications());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<'date' | 'averageMark' | 'name'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    const list = apps.filter(
      (a) =>
        (!statusFilter || a.status === statusFilter) &&
        (!typeFilter || a.applicationType === typeFilter) &&
        (!search || `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()))
    );

    const dir = sortDir === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      if (sortKey === 'date') return dir * a.submittedDate.localeCompare(b.submittedDate);
      if (sortKey === 'name') return dir * `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      return dir * ((a.averageMark || 0) - (b.averageMark || 0));
    });
  }, [apps, statusFilter, typeFilter, search, sortKey, sortDir]);

  const updateStatus = (id: string, status: Application['status']) => {
    const updated = apps.map((a) => (a.id === id ? { ...a, status } : a));
    setApplications(updated);
    setApps(updated);
  };

  const updateMarks = (id: string, marksText: string) => {
    const parsed = marksText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [subjectRaw, markRaw] = l.split(':');
        const subject = (subjectRaw || '').trim();
        const mark = Number((markRaw || '').trim());
        if (!subject || !Number.isFinite(mark)) return null;
        return { subject, mark: Math.max(0, Math.min(100, mark)) };
      })
      .filter(Boolean) as { subject: string; mark: number }[];

    const avg = calculateAverageMark(parsed);

    const updated = apps.map((a) => (a.id === id ? { ...a, subjectMarks: parsed, averageMark: avg } : a));
    setApplications(updated);
    setApps(updated);
  };

  const exportCSV = () => {
    const rows: string[] = [];
    rows.push(
      toCSVRow([
        'StudentNumber', 'FirstName', 'LastName', 'DOB', 'Grade', 'Year', 'Stream',
        'ApplicationType', 'Locality', 'Address', 'PreviousSchool', 'AverageMark', 'Status', 'SubmittedDate',
      ])
    );

    apps.forEach((a) => {
      rows.push(
        toCSVRow([
          a.studentNumber, a.firstName, a.lastName, a.dob, a.grade, a.year,
          a.stream || '', a.applicationType, a.locality || '', a.address,
          a.previousSchool || '', a.averageMark || 0, a.status, a.submittedDate,
        ])
      );
    });

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Student Applications</h1>
          <span className="text-gray-400 text-sm">{apps.length} total</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
          >
            <FileDown size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-grow max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white outline-none"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white">
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>Reviewed</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white">
          <option value="">All types</option>
          <option>General</option>
        </select>
        <button onClick={() => toggleSort('date')} className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white hover:bg-gray-700">
          <ArrowUpDown size={14} /> Date
        </button>
        <button onClick={() => toggleSort('name')} className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white hover:bg-gray-700">
          <ArrowUpDown size={14} /> Name
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <User size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="font-bold text-lg">No applications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{app.firstName} {app.lastName}</div>
                    <div className="text-xs text-gray-400">{app.studentNumber} · Grade {app.grade} · {app.year}{app.stream ? ` · ${app.stream}` : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`${statusColors[app.status] || 'bg-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {app.status}
                  </span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${expanded === app.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expanded === app.id && (
                <div className="border-t border-gray-700 p-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-gray-500">DOB:</span> <span className="text-white ml-1">{app.dob}</span></div>
                    <div><span className="text-gray-500">Gender:</span> <span className="text-white ml-1">{app.gender}</span></div>
                    <div><span className="text-gray-500">Address:</span> <span className="text-white ml-1">{app.address}</span></div>
                    <div><span className="text-gray-500">Prev School:</span> <span className="text-white ml-1">{app.previousSchool || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Guardian:</span> <span className="text-white ml-1">{app.guardianName}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="text-white ml-1">{app.guardianPhone}</span></div>
                    <div><span className="text-gray-500">Email:</span> <span className="text-white ml-1">{app.guardianEmail}</span></div>
                    <div><span className="text-gray-500">Submitted:</span> <span className="text-white ml-1">{app.submittedDate}</span></div>
                  </div>

                  {app.uploads && app.uploads.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-300 mb-2">Uploaded Documents</h4>
                      <div className="flex flex-wrap gap-2">
                        {app.uploads.map((u) => (
                          <button
                            key={u.key}
                            onClick={() => downloadDataUrl(u.dataUrl, u.fileName)}
                            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                          >
                            <Download size={12} /> {u.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Subject Marks</h4>
                    <textarea
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white text-sm"
                      rows={4}
                      placeholder="Enter marks (Subject:Mark per line)&#10;e.g.&#10;Mathematics:65&#10;English:72"
                      defaultValue={(app.subjectMarks || []).map(m => `${m.subject}:${m.mark}`).join('\n')}
                      onBlur={(e) => updateMarks(app.id, e.target.value)}
                    />
                    {app.averageMark ? <div className="text-xs text-gray-400 mt-1">Average: {app.averageMark.toFixed(1)}%</div> : null}
                  </div>

                  <div className="flex gap-2">
                    {(['Pending','Reviewed','Accepted','Rejected'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(app.id, s)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          app.status === s ? `${statusColors[s]} text-white` : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
