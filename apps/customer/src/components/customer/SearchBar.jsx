import React from 'react';
import { Search } from 'lucide-react';
import { useSettings } from '@ethio-buna/shared';

const SearchBar = ({ search, setSearch }) => {
  const { t } = useSettings();

  return (
    <div className="relative w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={20}
      />
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full 
          bg-white
          border border-slate-200/80
          shadow-sm
          rounded-2xl 
          py-4 
          pl-12 
          pr-4 
          outline-none 
          focus:ring-2 
          focus:ring-orange-500/20 
          transition-all 
          font-bold
          text-xs
          text-slate-800
          placeholder:text-slate-400
        "
      />
    </div>
  );
};

export default SearchBar;
