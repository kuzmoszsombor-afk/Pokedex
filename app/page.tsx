'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { getTypes, getPokemonsByType } from '../services/pokemonApi';
import PokemonCard from '../components/PokemonCard';

// Típus definíciók a hibák elkerülésére
interface Pokemon {
  name: string;
  url: string;
}

interface Type {
  name: string;
  url: string;
}

export default function Home() {
  // Állapotok típusokkal
  const [types, setTypes] = useState<Type[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Szűrők állapota
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyCaught, setShowOnlyCaught] = useState(false);
  
  // Kiválasztott Pokémon (A 2. lépésben ez még csak egy placeholder lesz)
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);

  const caughtPokemonNames = useSelector((state: RootState) => state.pokemon.caughtPokemonNames);

  // 1. Típusok betöltése induláskor
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTypes().then((data: any) => setTypes(data.results));
  }, []);

  // 2. Pokémonok betöltése típusváltáskor
  const handleTypeChange = async (url: string) => {
    setSelectedType(url);
    if (!url) {
      setPokemons([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getPokemonsByType(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPokemons(data.pokemon.map((p: any) => p.pokemon));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Szűrési logika (Keresés + Caught)
  const filteredPokemons = useMemo(() => {
    return pokemons.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCaught = showOnlyCaught ? caughtPokemonNames.includes(p.name) : true;
      return matchesSearch && matchesCaught;
    });
  }, [pokemons, searchTerm, showOnlyCaught, caughtPokemonNames]);

  // HA van kiválasztott pokémon -> A 2. lépésben itt még csak egy egyszerű üzenetet mutatunk
  if (selectedPokemonName) {
    return (
       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4 capitalize">{selectedPokemonName}</h2>
            <p className="mb-4 text-gray-600">Detailed view coming in Step 3!</p>
            <button 
              onClick={() => setSelectedPokemonName(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fejléc */}
      <header className="bg-red-600 p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
            <h1 className="text-yellow-400 text-3xl font-bold tracking-wider drop-shadow-md">
              PokéDex
            </h1>
            <span className="text-white text-sm opacity-80 ml-auto hidden sm:block">PokeAPI Integration</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        
        {/* Szűrő szekció */}
        <div className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow-sm border">
          
          {/* Kereső */}
          <div>
             <label className="block text-sm font-bold text-gray-600 mb-1">Filters</label>
             <input 
               type="text"
               placeholder="Search..."
               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          {/* Típusválasztó */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Pokemon Types</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) => handleTypeChange(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select...</option>
              {types.map((t) => (
                <option key={t.name} value={t.url}>
                  {t.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="caughtFilter"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
              onChange={(e) => setShowOnlyCaught(e.target.checked)}
            />
            <label htmlFor="caughtFilter" className="text-gray-700 font-medium cursor-pointer select-none">
              Only show caught Pokemon
            </label>
          </div>
        </div>

        {/* Eredmény Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedType ? (
              filteredPokemons.map((p) => (
                <PokemonCard 
                  key={p.name} 
                  name={p.name} 
                  onClick={() => setSelectedPokemonName(p.name)}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 italic py-10 border-2 border-dashed rounded-lg">
                Please select a type above to start hunting!
              </div>
            )}
            
            {selectedType && filteredPokemons.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">
                    No Pokémon found.
                </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}