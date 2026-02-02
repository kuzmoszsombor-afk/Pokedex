'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { toggleCatch } from '../features/pokemonSlice';

interface PokemonCardProps {
  name: string;
  onClick: () => void;
}

export default function PokemonCard({ name, onClick }: PokemonCardProps) {
  const dispatch = useDispatch();
  const caughtPokemonNames = useSelector((state: RootState) => state.pokemon.caughtPokemonNames);
  const isCaught = caughtPokemonNames.includes(name);

  // Esemény megállítása, hogy a gombnyomás ne aktiválja a kártya kattintást is
  const handleCatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCatch(name));
  };

  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center justify-between p-4 rounded-lg border-2 bg-white cursor-pointer transition-transform hover:scale-105
        ${isCaught ? 'border-yellow-400' : 'border-blue-200'}
      `}
    >
      {/* Név (Nagybetűsítve) */}
      <span className="font-bold text-gray-700 capitalize text-lg">
        {name}
      </span>

      {/* Státusz és Gomb */}
      <div className="flex items-center gap-3">
        {isCaught && (
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Caught
          </span>
        )}
        
        <button
          onClick={handleCatchClick}
          className={`
            px-4 py-1 rounded text-white font-bold text-sm shadow-md transition-colors
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