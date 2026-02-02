'use client';

import React from 'react';
import { usePokemonCard } from '../hooks/usePokemonCard';

interface PokemonCardProps {
  name: string;
  type?: string;
  onClick: () => void;
}

export default function PokemonCard({ name, type, onClick }: PokemonCardProps) {
  // Itt hívjuk meg a logikát, a kód többi része tiszta UI marad
  const { isCaught, handleCatchClick } = usePokemonCard(name);

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-6 py-2 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <div className="w-64">
        <div className={`
          border-2 rounded-2xl px-4 h-12 flex items-center capitalize bg-white transition-colors shadow-sm font-medium
          ${isCaught ? 'border-yellow-400 text-gray-500' : 'border-blue-200 text-gray-700'}
        `}>
          {name}
        </div>
      </div>

      <div className="w-40">
        <div className="border-2 border-blue-200 rounded-2xl px-4 h-12 flex items-center justify-center text-gray-600 capitalize bg-white text-sm shadow-sm font-medium">
          {type || '-'}
        </div>
      </div>

      <div className="w-24 text-center font-bold text-gray-400 text-xs uppercase tracking-wider">
        {isCaught ? 'Caught' : '-'}
      </div>

      <div className="w-32 flex justify-end">
        <button
          onClick={handleCatchClick}
          className={`
            w-full h-12 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center
            ${isCaught 
              ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900' 
              : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {isCaught ? 'Release' : 'Catch'}
        </button>
      </div>
    </div>
  );
}