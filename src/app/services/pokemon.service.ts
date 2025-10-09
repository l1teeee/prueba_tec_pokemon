import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon, PokemonDetail } from '@models/pokemon.models';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private readonly FIRST_GENERATION_LIMIT = 151;

  constructor(private http: HttpClient) {}

  /* Primera generación ) */
  getFirstGenerationPokemon(): Observable<Pokemon[]> {
    const requests: Observable<PokemonDetail>[] = [];

    for (let i = 1; i <= this.FIRST_GENERATION_LIMIT; i++) {
      requests.push(this.getPokemonDetail(i));
    }

    return forkJoin(requests).pipe(
      map(pokemonList => pokemonList.map(detail => this.mapToViewModel(detail)))
    );
  }

  /* Obtiene los detalles de un Pokémon específico por ID */
  getPokemonById(id: number): Observable<Pokemon> {
    return this.getPokemonDetail(id).pipe(
      map(detail => this.mapToViewModel(detail))
    );
  }

  /* Obtiene los detalles de un Pokémon específico por nombre */
  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${name.toLowerCase()}`).pipe(
      map(detail => this.mapToViewModel(detail))
    );
  }

  /* Método privado para obtener detalles completos del Pokémon */
  private getPokemonDetail(id: number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${id}`);
  }

  /* Mapea el modelo de la API al modelo de vista */
  private mapToViewModel(detail: PokemonDetail): Pokemon {
    return {
      id: detail.id,
      name: detail.name,
      sprite: detail.sprites.other.home.front_default
    };
  }
}
