import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { getTypes, getPokemonsByType } from '../services/pokemonApi';

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

export const useHome = () => {
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

  return {
    types,
    loading,
    selectedType,
    searchTerm,
    setSearchTerm,
    showOnlyCaught,
    setShowOnlyCaught,
    selectedPokemonName,
    setSelectedPokemonName,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleTypeChange,
    filteredPokemons,
    currentTypeName
  };
};