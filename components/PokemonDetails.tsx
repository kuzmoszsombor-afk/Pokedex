'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { toggleCatch } from '../features/pokemonSlice';
import { getPokemonDetails } from '../services/pokemonApi';

// Típusok definiálása, hogy a TypeScript boldog legyen
interface Ability {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

interface PokemonData {
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  abilities: Ability[];
}

interface PokemonDetailsProps {
  pokemonName: string;
  onBack: () => void;
}

export default function PokemonDetails({ pokemonName, onBack }: PokemonDetailsProps) {
  const [details, setDetails] = useState<PokemonData | null>(null);
  const dispatch = useDispatch();
  const caughtPokemonNames = useSelector((state: RootState) => state.pokemon.caughtPokemonNames);

  useEffect(() => {
    getPokemonDetails(pokemonName).then((data) => setDetails(data));
  }, [pokemonName]);

  // Töltőképernyő, amíg az adatok megérkeznek
  if (!details) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const isCaught = caughtPokemonNames.includes(pokemonName);

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      
      {/* Fejléc - Vissza gomb és Név */}
      <div className="bg-red-600 p-4 flex items-center">
        <button 
          onClick={onBack} 
          className="text-white hover:bg-red-700 p-2 rounded-full transition flex items-center justify-center"
        >
          {/* Egyszerű Vissza Nyíl ikon (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 className="text-yellow-400 text-2xl font-bold ml-4 tracking-wider drop-shadow-md capitalize">
          {details.name}
        </h2>
      </div>

      <div className="p-6 md:flex gap-8">
        {/* Bal oldal: Nagy Kép */}
        <div className="flex-1 flex justify-center items-center bg-blue-50 rounded-lg border-4 border-yellow-400 p-4 mb-6 md:mb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={details.sprites.other['official-artwork'].front_default || details.sprites.front_default} 
            alt={details.name}
            className="w-64 h-64 object-contain drop-shadow-lg transition-transform hover:scale-110"
          />
        </div>

        {/* Jobb oldal: Adatok Táblázat */}
        <div className="flex-1 space-y-4">
          
          <div className="border rounded-lg overflow-hidden text-sm">
            {/* Név */}
            <div className="flex border-b">
              <div className="w-1/3 bg-gray-200 p-3 font-bold text-gray-600">Name</div>
              <div className="w-2/3 bg-gray-100 p-3 font-bold capitalize">{details.name}</div>
            </div>
            {/* Súly */}
            <div className="flex border-b">
              <div className="w-1/3 bg-yellow-100 p-3 font-bold text-gray-600">Weight</div>
              <div className="w-2/3 bg-yellow-50 p-3 font-bold">{details.weight}</div>
            </div>
            {/* Magasság */}
            <div className="flex border-b">
              <div className="w-1/3 bg-gray-200 p-3 font-bold text-gray-600">Height</div>
              <div className="w-2/3 bg-gray-100 p-3 font-bold">{details.height}</div>
            </div>
            {/* Képességek (Abilities) */}
            <div className="flex border-b">
              <div className="w-1/3 bg-yellow-100 p-3 font-bold text-gray-600">Abilities</div>
              <div className="w-2/3 bg-yellow-50 p-3 font-bold">
                <ul className="list-disc list-inside">
                  {details.abilities
                    .filter((a) => !a.is_hidden)
                    .map((a) => (
                      <li key={a.ability.name} className="capitalize">
                        {a.ability.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            {/* Státusz */}
             <div className="flex">
              <div className="w-1/3 bg-gray-200 p-3 font-bold text-gray-600">Status</div>
              <div className="w-2/3 bg-gray-100 p-3 font-bold">
                 {isCaught ? 'Caught' : '-'}
              </div>
            </div>
          </div>

          {/* Catch/Release Gomb */}
          <button
            onClick={() => dispatch(toggleCatch(pokemonName))}
            className={`
              w-full py-3 rounded-lg font-bold text-lg shadow-md transition-all transform hover:-translate-y-1
              ${isCaught 
                ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
            `}
          >
            {isCaught ? 'Release' : 'Catch'}
          </button>

        </div>
      </div>
    </div>
  );
}