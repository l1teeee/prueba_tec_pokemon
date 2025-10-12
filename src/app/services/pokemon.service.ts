import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Pokemon, PokemonDetail, PokemonStats } from '@models/pokemon.models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = environment.pokemonApiUrl;
  private readonly FIRST_GENERATION_LIMIT = environment.firstGenerationLimit;
  private readonly CACHE_KEY = environment.cacheKey;
  private readonly CACHE_EXPIRATION_KEY = environment.cacheExpirationKey;
  private readonly CACHE_DURATION_DAYS = environment.cacheDurationDays;
  private readonly TEAM_STORAGE_KEY = 'pokemon-selected-team';

  constructor(private http: HttpClient) {}

  getFirstGenerationPokemon(): Observable<Pokemon[]> {
    const cachedData = this.getFromCache();

    if (cachedData) {
      console.log('Pokémon cargados desde caché');
      return of(cachedData);
    }

    console.log('Cargando Pokémon desde API...');
    const requests: Observable<PokemonDetail>[] = [];

    for (let i = 1; i <= this.FIRST_GENERATION_LIMIT; i++) {
      requests.push(this.getPokemonDetail(i));
    }

    return forkJoin(requests).pipe(
      map(pokemonList => pokemonList.map(detail => this.mapToViewModel(detail))),
      tap(pokemon => {
        this.saveToCache(pokemon);
        console.log('Pokémon guardados en caché');
      })
    );
  }



  /* Guarda el equipo de Pokémon en localStorage */
  saveTeam(team: Pokemon[]): void {
    try {
      localStorage.setItem(this.TEAM_STORAGE_KEY, JSON.stringify(team));
      console.log('Equipo guardado en localStorage:', team);
    } catch (error) {
      console.error('Error al guardar equipo en localStorage:', error);
    }
  }

  /* Obtiene el equipo de Pokémon guardado en localStorage */
  getTeam(): Pokemon[] {
    try {
      const savedTeam = localStorage.getItem(this.TEAM_STORAGE_KEY);
      if (savedTeam) {
        const team = JSON.parse(savedTeam) as Pokemon[];
        console.log('Equipo cargado desde localStorage:', team);
        return team;
      }
      return [];
    } catch (error) {
      console.error('Error al cargar equipo desde localStorage:', error);
      return [];
    }
  }


  private getPokemonDetail(id: number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${id}`);
  }

  private mapToViewModel(detail: PokemonDetail): Pokemon {
    return {
      id: detail.id,
      name: detail.name,
      sprite: detail.sprites.other.home.front_default,
      types: detail.types.map(t => t.type.name),
      stats: this.mapStats(detail.stats)
    };
  }

  private mapStats(statsArray: PokemonDetail['stats']): PokemonStats {
    const statsMap: { [key: string]: number } = {};

    statsArray.forEach(stat => {
      statsMap[stat.stat.name] = stat.base_stat;
    });

    return {
      hp: statsMap['hp'] || 0,
      attack: statsMap['attack'] || 0,
      defense: statsMap['defense'] || 0,
      specialAttack: statsMap['special-attack'] || 0,
      specialDefense: statsMap['special-defense'] || 0,
      speed: statsMap['speed'] || 0
    };
  }

  private saveToCache(pokemon: Pokemon[]): void {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + this.CACHE_DURATION_DAYS);

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(pokemon));
      localStorage.setItem(this.CACHE_EXPIRATION_KEY, expirationDate.toISOString());
    } catch (error) {
      console.error('Error al guardar caché:', error);
    }
  }

  private getFromCache(): Pokemon[] | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      const expiration = localStorage.getItem(this.CACHE_EXPIRATION_KEY);

      if (!cached || !expiration) {
        return null;
      }

      const expirationDate = new Date(expiration);
      const now = new Date();

      if (now > expirationDate) {
        console.log('Caché expirado, limpiando...');
        this.clearCache();
        return null;
      }

      return JSON.parse(cached);
    } catch (error) {
      console.error('Error al leer caché:', error);
      this.clearCache();
      return null;
    }
  }

  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_EXPIRATION_KEY);
    console.log('Caché limpiado');
  }

}
