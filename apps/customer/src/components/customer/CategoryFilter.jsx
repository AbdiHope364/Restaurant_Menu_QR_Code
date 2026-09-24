import React from 'react';
import { useSettings } from '@ethio-buna/shared';

const CategoryFilter = ({ categories, activeId, onSelect }) => {
  const { theme, t } = useSettings();

  return (
    <div className="flex gap-2.5 overflow-x-auto px-4 sm:px-6 py-2 no-scrollbar">
      <button
        onClick={() => onSelect('all')}
        className={`
          px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0
          ${
            activeId === 'all'
              ? `${theme.primary} text-white shadow-md ${theme.shadow}`
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }
        `}
      >
        {t('allCategories')}
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`
            px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0
            ${
              activeId === cat.id
                ? `${theme.primary} text-white shadow-md ${theme.shadow}`
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }
          `}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
