import React from 'react';
import { Pencil, Trash2, Eye, EyeOff, Flame } from 'lucide-react';
import MenuImageCarousel from './MenuImageCarausel';
import { useSettings } from '@ethio-buna/shared';

const MenuCard = ({ item, onEdit, onDelete, onToggle }) => {
  const { theme, formatPrice } = useSettings();

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all">
      {/* IMAGE */}
      <MenuImageCarousel images={item.images} />

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate flex-1">
              {item.name}
            </h2>
            {item.spicyLevel > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-lg">
                <Flame size={12} className="fill-current" /> {item.spicyLevel}
              </span>
            )}
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{item.category?.name || 'General'}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`font-black text-xl ${theme.textPrimary}`}>
              {formatPrice(item.price)}
            </p>

            {item.oldPrice && parseFloat(item.oldPrice) > parseFloat(item.price) && (
              <p className="text-slate-400 line-through text-xs font-bold">
                {formatPrice(item.oldPrice)}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={item.isAvailable}
              onChange={() => onToggle(item.id, !item.isAvailable)}
              className="hidden"
            />

            {/* Toggle UI */}
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-all ${
                item.isAvailable ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${
                  item.isAvailable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>

            <span className="text-xs font-black uppercase text-slate-600">
              {item.isAvailable ? 'Active' : 'Hidden'}
            </span>
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <button
            onClick={() => onToggle(item.id, !item.isAvailable)}
            title={item.isAvailable ? 'Hide Item' : 'Show Item'}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          <button
            onClick={() => onEdit(item)}
            title="Edit Dish"
            className={`p-2.5 rounded-xl ${theme.bgLight} ${theme.textPrimary} hover:opacity-80 transition`}
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            title="Delete Dish"
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
