
export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}


export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    other: {
      home: {
        front_default: string;
      };
    };
  };
}


export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasicInfo[];
}


export interface PokemonBasicInfo {
  name: string;
  url: string;
}
