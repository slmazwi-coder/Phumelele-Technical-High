import React, { useState } from 'react';
import { getActivities, setActivities, generateId, type Activity } from '../utils/storage';
import { runFullDefenseScan } from '../utils/defense';
import { Plus, Trash2, Save, X, ImageIcon, Pencil, Loader2 } from 'lucide-react';

const categories = ['Sport', 'Academic', 'Culture'];

export const ActivitiesEditor = () => {
  const [items, setItems] = useState<Activity[]>(getActivities());
  const [editing, setEditing] = useState<Activity | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const save = async () => {
    if (!editing) return;
    setIsScanning(true);
    const result = await runFullDefenseScan(editing, 'activities');
    setIsScanning(false);
    if (!result.safe) { alert(`🛡️ AMD ALERT: ${result.reason}`); return; }
    const updated = isNew ? [...items, editing] : items.map(i => i.id === editing.id ? editing : i);
    setActivities(updated); setItems(updated); setEditing(null); setIsNew(false);
  };

  const remove = (id: string) => {
    if (!confirm('Remove?')) return;
    const u = items.filter(i => i.id !== id);
    setActivities(u); setItems(u);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onload = () => setEditing({ ...editing, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Activities Editor</h1>
          <p className="text-gray-400 text-sm mt-1">Manage sport, academic & cultural activities</p>
        </div>
        <button onClick={() => { setEditing({ id: generateId(), name: '', description: '', category: categories[0], image: '' }); setIsNew(true); }} className="flex items-center gap-2 bg-school-navy text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-900">
          <Plus size={18} /> Add Item
        </button>
      </div>
      {editing && (
        <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{isNew ? 'New Item' : 'Edit Item'}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={20} className="text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Name" className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
            <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} placeholder="Description" className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white" />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-600 text-white text-sm">
                <ImageIcon size={16} /> Image <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {editing.image && <img src={editing.image} className="h-12 w-12 rounded-lg object-cover" />}
            </div>
            <button onClick={save} disabled={isScanning} className="flex items-center gap-2 bg-school-navy text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-900 disabled:opacity-50">
              {isScanning ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save</>}
            </button>
          </div>
        </div>
      )}
      {items.length === 0 && !editing ? (
        <p className="text-center py-16 text-gray-500">No items yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex gap-4">
              {item.image ? <img src={item.image} className="w-16 h-16 rounded-lg object-cover shrink-0" /> : <div className="w-16 h-16 bg-gray-700 rounded-lg shrink-0" />}
              <div className="flex-grow min-w-0">
                <p className="font-bold text-white text-sm">{item.name}</p>
                <span className="text-xs text-school-gold">{item.category}</span>
                <p className="text-xs text-gray-400 truncate mt-1">{item.description}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => { setEditing(item); setIsNew(false); }} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
