import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { toggleCatch } from '../features/pokemonSlice';
import { getPokemonDetails } from '../services/pokemonApi';

// Szükséges típusok másolása (vagy kiszervezhetnéd egy types.ts-be is)
interface Ability {
  ability: { name: string };
  is_hidden: boolean;
}

interface PokemonData {
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
    other: { 'official-artwork': { front_default: string } };
  };
  abilities: Ability[];
}

export const usePokemonDetails = (pokemonName: string) => {
  const [details, setDetails] = useState<PokemonData | null>(null);
  const dispatch = useDispatch();
  const caughtPokemonNames = useSelector((state: RootState) => state.pokemon.caughtPokemonNames);

  useEffect(() => {
    getPokemonDetails(pokemonName).then((data) => setDetails(data));
  }, [pokemonName]);

  const isCaught = caughtPokemonNames.includes(pokemonName);

  const toggleStatus = () => {
    dispatch(toggleCatch(pokemonName));
  };

  return {
    details,
    isCaught,
    toggleStatus
  };
};