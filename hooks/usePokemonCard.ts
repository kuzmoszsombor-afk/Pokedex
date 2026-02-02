import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { toggleCatch } from '../features/pokemonSlice';
import React from 'react';

export const usePokemonCard = (name: string) => {
  const dispatch = useDispatch();
  const caughtPokemonNames = useSelector((state: RootState) => state.pokemon.caughtPokemonNames);
  const isCaught = caughtPokemonNames.includes(name);

  const handleCatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleCatch(name));
  };

  return {
    isCaught,
    handleCatchClick
  };
};