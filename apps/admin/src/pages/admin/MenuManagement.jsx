import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Plus, Search, Loader2, Utensils } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import MenuCard from '../../components/admin/MenuCard';
import MenuFormModal from '../../components/admin/MenuFormModal';
import { useSettings } from '@ethio-buna/shared';

export default function MenuManagement() {
  const { items, toggleAvailability, deleteMenuItem, loading } = useMenu();
  const { theme } = useSettings();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const itemsArray = Array.isArray(items) ? items : [];

  const filteredItems = itemsArray.filter((item) => {
    const name = item?.name?.toLowerCase() || '';
    const category = item?.category?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return name.includes(search) || category.includes(search);
  });

  if (loading) {
    return (
      <AdminLayout title="Menu Management">
        <div className="flex items-center justify-center h-64">
          <Loader2 className={`animate-spin ${theme.textPrimary}`} size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Menu Management">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* SEARCH */}
        <div className="relative w-full md:max-w-md">
          <Search
            className="absolute left-4 top-3.5 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search dishes, drinks, appetizers..."
            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 outline-none text-xs font-bold ${theme.ring} focus:ring-2 shadow-sm`}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className={`w-full md:w-auto ${theme.primary} ${theme.primaryHover} text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl ${theme.shadow} transition-all active:scale-95`}
        >
          <Plus size={18} /> NEW DISH
        </button>
      </div>

      {/* EMPTY */}
      {filteredItems.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
          <Utensils size={40} className="mx-auto text-slate-300" />
          <h3 className="text-slate-800 font-black uppercase text-base">No Dishes Found</h3>
          <p className="text-slate-400 text-xs">
            Try adjusting your search query or tap "NEW DISH" to create a menu entry.
          </p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={deleteMenuItem}
            onToggle={toggleAvailability}
          />
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <MenuFormModal
          editItem={editingItem}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </AdminLayout>
  );
}
