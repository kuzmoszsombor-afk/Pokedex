'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { getTypes, getPokemonsByType } from '../services/pokemonApi';
import PokemonCard from '../components/PokemonCard';
import PokemonDetails from '../components/PokemonDetails';

interface Pokemon {
  name: string;
  url: string;
}

interface Type {
  name: string;
  url: string;
}

interface TypeApiResponse {
  results: Type[];
}

interface PokemonListResponse {
  pokemon: Array<{ pokemon: Pokemon }>;
}

export default function Home() {
  const [types, setTypes] = useState<Type[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyCaught, setShowOnlyCaught] = useState(false);
  
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const caughtPokemonNames = useSelector((state: RootState) => state.pokemon.caughtPokemonNames);

  useEffect(() => {
    getTypes().then((data: TypeApiResponse) => setTypes(data.results));
  }, []);

  const handleTypeChange = async (url: string) => {
    setSelectedType(url);
    if (!url) {
      setPokemons([]);
      return;
    }
    setLoading(true);
    try {
      const data: PokemonListResponse = await getPokemonsByType(url);
      setPokemons(data.pokemon.map((p) => p.pokemon));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPokemons = useMemo(() => {
    return pokemons.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCaught = showOnlyCaught ? caughtPokemonNames.includes(p.name) : true;
      return matchesSearch && matchesCaught;
    });
  }, [pokemons, searchTerm, showOnlyCaught, caughtPokemonNames]);

  const currentTypeName = types.find(t => t.url === selectedType)?.name;

  if (selectedPokemonName) {
    return (
      <PokemonDetails 
        pokemonName={selectedPokemonName} 
        onBack={() => setSelectedPokemonName(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      <header className="bg-red-600 h-20 shadow-md sticky top-0 z-20 flex items-center px-4 md:px-8 justify-between">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white md:hidden focus:outline-none hover:bg-red-700 p-1 rounded"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" 
              alt="Pokemon Logo" 
              className="h-10 md:h-12 drop-shadow-md"
            />
         </div>
         <span className="text-white text-sm opacity-90 font-medium hidden md:block">
           PokeAPI Documentation
         </span>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative bg-red-700 w-64 h-full shadow-xl p-6 flex flex-col">
            <button onClick={() => setIsMobileMenuOpen(false)} className="self-end text-white mb-6 hover:bg-red-600 p-1 rounded">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="space-y-4">
              <div className="text-white text-lg font-bold border-b border-red-500 pb-2">
                PokeAPI Documentation
              </div>
            </nav>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-16">
          
          <aside className="w-full md:w-1/4 space-y-8 pt-2">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Filters</label>
              <div className="relative border-b border-gray-300">
                <input 
                  type="text"
                  placeholder="Search..."
                  className="w-full p-2 pl-8 focus:outline-none bg-transparent placeholder-gray-400"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-1 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Pokemon Types</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleTypeChange(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select...</option>
                {types.map((t) => (
                  <option key={t.name} value={t.url}>{t.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="caught" className="w-4 h-4 cursor-pointer text-blue-600 rounded" onChange={(e) => setShowOnlyCaught(e.target.checked)} />
              <label htmlFor="caught" className="text-gray-600 text-sm font-medium cursor-pointer select-none">
                Only show caught Pokemon
              </label>
            </div>
          </aside>

          <section className="w-full md:w-3/4">
            
            <div className="flex items-center gap-6 mb-4 text-gray-400 font-bold text-sm px-0">
               <div className="w-64 text-center">Name</div>
               <div className="w-40 text-center">Type</div>
               <div className="w-24 text-center">Status</div>
               <div className="w-32"></div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
              </div>
            ) : (
              <div className="flex flex-col">
                {selectedType ? (
                  filteredPokemons.length > 0 ? (
                    filteredPokemons.map((p) => (
                      <PokemonCard 
                        key={p.name} 
                        name={p.name} 
                        type={currentTypeName} 
                        onClick={() => setSelectedPokemonName(p.name)} 
                      />
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-10 border border-gray-100 rounded-lg">
                      No Pokémon found matching your filters.
                    </div>
                  )
                ) : (
                  <div className="text-center text-gray-400 italic py-20 border-2 border-dashed border-gray-200 rounded-lg">
                    Please select a type from the left menu to start!
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}