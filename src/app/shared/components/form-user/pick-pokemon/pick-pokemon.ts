import { Component, OnInit } from '@angular/core';
import { PokemonService } from '@services/pokemon.service'; // Ajusta la ruta según tu proyecto
import { Pokemon } from '@models/pokemon.models'; // Ajusta la ruta según tu proyecto

@Component({
  selector: 'app-pick-pokemon',
  imports: [],
  templateUrl: './pick-pokemon.html',
  styleUrl: './pick-pokemon.scss'
})
export class PickPokemon implements OnInit {

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    // Obtener todos los Pokémon de primera generación
    this.pokemonService.getFirstGenerationPokemon().subscribe({
      next: (pokemon: Pokemon[]) => {
        console.log('Pokémon de primera generación:', pokemon);
        console.log(`Total de Pokémon obtenidos: ${pokemon.length}`);
      },
      error: (error) => {
        console.error('Error al obtener los Pokémon:', error);
      },
      complete: () => {
        console.log('Carga de Pokémon completada');
      }
    });
  }
}
