import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PokemonState {
  caughtPokemonNames: string[];
}

const getInitialState = (): string[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('caughtPokemon');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const initialState: PokemonState = {
  caughtPokemonNames: getInitialState(),
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    toggleCatch: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      if (state.caughtPokemonNames.includes(name)) {
        state.caughtPokemonNames = state.caughtPokemonNames.filter(p => p !== name);
      } else {
        state.caughtPokemonNames.push(name);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('caughtPokemon', JSON.stringify(state.caughtPokemonNames));
      }
    },
  },
});

export const { toggleCatch } = pokemonSlice.actions;
export default pokemonSlice.reducer;