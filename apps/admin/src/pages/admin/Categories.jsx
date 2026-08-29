import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  FolderOpen,
  Edit3,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { useCategories } from '../../../hooks/useCategories';
import { useSettings } from '@ethio-buna/shared';

const Categories = () => {
  const {
    categories = [],
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const { theme } = useSettings();

  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline Editing State
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    const cleanName = newName.trim();
    if (!cleanName) return;

    // Local Duplicate Check (Case-Insensitive)
    const exists = categories.some(
      (c) => c.name.toLowerCase() === cleanName.toLowerCase(),
    );

    if (exists) {
      return toast.error(`"${cleanName}" already exists!`, {
        icon: <AlertCircle className="text-red-500" />,
      });
    }

    setIsSubmitting(true);
    try {
      await createCategory(cleanName);
      setNewName('');
      toast.success('Category added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    const cleanEdit = editValue.trim();
    if (!cleanEdit) return setEditingId(null);

    const exists = categories.some(
      (c) => c.id !== id && c.name.toLowerCase() === cleanEdit.toLowerCase(),
    );

    if (exists) {
      return toast.error('Another category already has this name');
    }

    try {
      await updateCategory({ id, name: cleanEdit });
      toast.success('Category updated');
      setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Delete this category? Dishes in this category will become uncategorized.',
      )
    )
      return;
    try {
      await deleteCategory(id);
      toast.success('Category removed');
    } catch (error) {
      toast.error('Could not delete category');
    }
  };

  return (
    <AdminLayout title="Menu Categories">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* CREATE CARD */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className={`text-xs font-black ${theme.textPrimary} uppercase tracking-[0.2em] mb-4 ml-1`}>
              Add New Category
            </h3>
            <form
              onSubmit={handleAdd}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Appetizers, Main Courses, Hot Drinks, Desserts..."
                className={`w-full border-none bg-slate-50 p-4 rounded-2xl outline-none ring-1 ring-slate-200 ${theme.ring} focus:ring-2 transition-all font-bold text-xs text-slate-800 placeholder:text-slate-300`}
              />
              <button
                disabled={isSubmitting}
                className={`w-full sm:w-auto ${theme.primary} ${theme.primaryHover} text-white px-6 sm:px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg ${theme.shadow} transition-all active:scale-95 flex items-center justify-center min-w-[150px]`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Plus size={18} className="mr-1.5" /> Add Category
                  </>
                )}
              </button>
            </form>
          </div>
          <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bgLight} rounded-full -mr-16 -mt-16 opacity-50`}></div>
        </div>

        {/* LIST SECTION */}
        <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Active Categories ({categories?.length || 0})
            </h3>
            {loading && (
              <Loader2 className={`animate-spin ${theme.textPrimary}`} size={20} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className={`flex justify-between items-center p-5 border rounded-[2rem] transition-all group ${
                  editingId === cat.id
                    ? `${theme.borderLight} ring-4 ring-orange-50 bg-white`
                    : `border-slate-100 bg-white hover:${theme.borderLight} hover:shadow-xl`
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                      editingId === cat.id
                        ? `${theme.primary} text-white`
                        : `${theme.bgLight} ${theme.textPrimary}`
                    }`}
                  >
                    <FolderOpen size={20} />
                  </div>

                  {editingId === cat.id ? (
                    <input
                      autoFocus
                      className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 text-sm"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleUpdate(cat.id)
                      }
                    />
                  ) : (
                    <span className="font-black text-slate-800 text-sm tracking-tight uppercase truncate">
                      {cat.name}
                    </span>
                  )}
                </div>

                <div className="flex gap-1.5 ml-3 shrink-0">
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="p-2.5 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition-all"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditValue(cat.name);
                        }}
                        className={`p-2.5 text-slate-400 hover:${theme.textPrimary} hover:${theme.bgLight} rounded-xl transition-all`}
                        title="Edit Name"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {categories?.length === 0 && !loading && (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No categories created yet. Add your first category above!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Categories;
