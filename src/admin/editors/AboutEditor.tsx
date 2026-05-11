import React, { useState } from 'react';
import { getAbout, setAbout, type AboutInfo } from '../utils/storage';
import { runFullDefenseScan } from '../utils/defense';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';

export const AboutEditor = () => {
  const [info, setInfo] = useState<AboutInfo>(getAbout());
  const [saved, setSaved] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const save = async () => {
    setIsScanning(true);
    const result = await runFullDefenseScan(info, 'about');
    setIsScanning(false);
    if (!result.safe) { alert(`🛡️ AMD ALERT: ${result.reason}`); return; }
    setAbout(info); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">About Page Editor</h1>
        <button onClick={save} disabled={isScanning} className="flex items-center gap-2 bg-school-navy text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-900 disabled:opacity-50">
          {isScanning ? <><Loader2 size={18} className="animate-spin" /> Scanning...</> : <><Save size={18} /> {saved ? 'Saved ✓' : 'Save Changes'}</>}
        </button>
      </div>

      <section className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">School History</h2>
          <button onClick={() => setInfo({ ...info, historyParagraphs: [...info.historyParagraphs, ''] })} className="flex items-center gap-1 text-sm text-school-gold hover:underline">
            <Plus size={14} /> Add Paragraph
          </button>
        </div>
        <div className="space-y-4">
          {info.historyParagraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={p} onChange={e => { const u = [...info.historyParagraphs]; u[i] = e.target.value; setInfo({ ...info, historyParagraphs: u }); }} rows={3} className="flex-grow bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white text-sm" />
              <button onClick={() => setInfo({ ...info, historyParagraphs: info.historyParagraphs.filter((_, j) => j !== i) })} className="text-gray-500 hover:text-red-400 shrink-0"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Principal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input value={info.principalName} onChange={e => setInfo({ ...info, principalName: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input value={info.principalTitle} onChange={e => setInfo({ ...info, principalTitle: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          {info.principalMessage.map((msg, i) => (
            <textarea key={i} value={msg} onChange={e => { const u = [...info.principalMessage]; u[i] = e.target.value; setInfo({ ...info, principalMessage: u }); }} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white text-sm" />
          ))}
        </div>
      </section>
    </div>
  );
};
