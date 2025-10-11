import { Component, OnInit, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PokemonService } from '@services/pokemon.service';
import { Pokemon } from '@models/pokemon.models';

@Component({
  selector: 'app-pick-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pick-pokemon.html',
  styleUrl: './pick-pokemon.scss'
})
export class PickPokemon implements OnInit {
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() teamSaved = new EventEmitter<void>();

  allPokemon: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  selectedTeam: Pokemon[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  readonly MAX_TEAM_SIZE = 3;
  readonly ITEM_SIZE = 280;
  readonly ITEMS_PER_ROW = 3;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadTeamFromService();
    this.loadPokemon();
  }

  loadPokemon(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pokemonService.getFirstGenerationPokemon().subscribe({
      next: (pokemon: Pokemon[]) => {
        this.allPokemon = pokemon;
        this.filteredPokemon = [...pokemon];
        this.isLoading = false;
        console.log(`${pokemon.length} Pokémon cargados`);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los Pokémon. Por favor, intenta de nuevo.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  loadTeamFromService(): void {
    this.selectedTeam = this.pokemonService.getTeam();
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredPokemon = [...this.allPokemon];
      return;
    }

    this.filteredPokemon = this.allPokemon.filter(pokemon => {
      const matchesName = pokemon.name.toLowerCase().includes(term);
      const matchesId = pokemon.id.toString().includes(term);
      return matchesName || matchesId;
    });
  }

  togglePokemon(pokemon: Pokemon): void {
    const index = this.selectedTeam.findIndex(p => p.id === pokemon.id);

    if (index !== -1) {
      this.selectedTeam.splice(index, 1);
      console.log(`${pokemon.name} removido del equipo`);
    } else {
      if (this.selectedTeam.length >= this.MAX_TEAM_SIZE) {
        return;
      }
      this.selectedTeam.push(pokemon);
      console.log(`${pokemon.name} agregado al equipo`);
    }

    this.pokemonService.saveTeam(this.selectedTeam);
  }

  isSelected(pokemon: Pokemon): boolean {
    return this.selectedTeam.some(p => p.id === pokemon.id);
  }

  canAddMore(): boolean {
    return this.selectedTeam.length < this.MAX_TEAM_SIZE;
  }

  saveTeam(): void {
    if (this.selectedTeam.length === this.MAX_TEAM_SIZE) {
      this.loadingChange.emit(true);

      // Guardar equipo
      this.pokemonService.saveTeam(this.selectedTeam);
      localStorage.setItem('entrenadorComplete', 'true');
      console.log('Equipo guardado:', this.selectedTeam);

      setTimeout(() => {
        this.loadingChange.emit(false);
        this.teamSaved.emit();
      }, 2000);
    } else {
      alert(`Debes seleccionar ${this.MAX_TEAM_SIZE} Pokémon`);
    }
  }

  getPokemonNumber(id: number): string {
    return `#${id.toString().padStart(3, '0')}`;
  }

  isTrainerComplete(): boolean {
    return localStorage.getItem('entrenadorComplete') === 'true';
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  getStatPercentage(value: number, statName?: string): number {
    const maxStats: { [key: string]: number } = {
      'hp': 255,
      'attack': 190,
      'defense': 230,
      'specialAttack': 194,
      'specialDefense': 230,
      'speed': 180
    };

    const max = statName ? maxStats[statName] || 255 : 255;
    return (value / max) * 100;
  }

  editTeam(): void {
    localStorage.setItem('entrenadorComplete', 'false');
    this.loadTeamFromService();
  }


  getPokemonRows(): Pokemon[][] {
    const rows: Pokemon[][] = [];
    for (let i = 0; i < this.filteredPokemon.length; i += this.ITEMS_PER_ROW) {
      rows.push(this.filteredPokemon.slice(i, i + this.ITEMS_PER_ROW));
    }
    return rows;
  }
}
