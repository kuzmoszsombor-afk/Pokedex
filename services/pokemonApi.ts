const BASE_URL = 'https://pokeapi.co/api/v2';

export const getTypes = async () => {
  const res = await fetch(`${BASE_URL}/type`);
  return res.json();
};

export const getPokemonsByType = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export const getPokemonDetails = async (name: string) => {
  const res = await fetch(`${BASE_URL}/pokemon/${name}`);
  return res.json();
};