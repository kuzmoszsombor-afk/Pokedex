'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { toggleCatch } from '../features/pokemonSlice';
import { getPokemonDetails } from '../services/pokemonApi';

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

  if (!details) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  const isCaught = caughtPokemonNames.includes(pokemonName);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      <header className="bg-red-600 p-4 shadow-md flex items-center justify-center relative">
         <h1 className="text-yellow-400 text-3xl font-bold tracking-wider drop-shadow-md">
            PokéDex
         </h1>
         <span className="absolute right-4 text-white text-sm opacity-90 font-medium hidden sm:block">
           PokeAPI Documentation
         </span>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-6 font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to search
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="w-full md:w-1/2">
             <div className="border-4 border-yellow-400 rounded-lg p-8 flex justify-center items-center bg-blue-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={details.sprites.other['official-artwork'].front_default || details.sprites.front_default} 
                  alt={details.name}
                  className="w-64 h-64 object-contain drop-shadow-xl"
                />
             </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            
            <div className="rounded-lg overflow-hidden border border-gray-200">
              
              <div className="flex text-sm">
                <div className="w-1/3 bg-slate-300 p-3 font-bold text-gray-700 flex items-center">Name</div>
                <div className="w-2/3 bg-slate-200 p-3 font-bold text-gray-900 capitalize">{details.name}</div>
              </div>

              <div className="flex text-sm">
                <div className="w-1/3 bg-yellow-200 p-3 font-bold text-gray-700 flex items-center">Weight</div>
                <div className="w-2/3 bg-yellow-100 p-3 font-bold text-gray-900">{details.weight}</div>
              </div>

              <div className="flex text-sm">
                <div className="w-1/3 bg-slate-300 p-3 font-bold text-gray-700 flex items-center">Height</div>
                <div className="w-2/3 bg-slate-200 p-3 font-bold text-gray-900">{details.height}</div>
              </div>

              <div className="flex text-sm">
                <div className="w-1/3 bg-yellow-200 p-3 font-bold text-gray-700 flex items-center">Abilities</div>
                <div className="w-2/3 bg-yellow-100 p-3 font-bold text-gray-900">
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

              <div className="flex text-sm">
                <div className="w-1/3 bg-slate-300 p-3 font-bold text-gray-700 flex items-center">Status</div>
                <div className="w-2/3 bg-slate-200 p-3 font-bold text-gray-900">
                   {isCaught ? 'Caught' : '-'}
                </div>
              </div>

            </div>

            <button
              onClick={() => dispatch(toggleCatch(pokemonName))}
              className={`
                w-full py-3 rounded font-bold text-lg shadow-md transition-colors
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
    </div>
  );
}