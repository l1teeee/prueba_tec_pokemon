import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {
  isOpen = false;
  searchQuery = '';

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  toggleSearch() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 100);
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
    }
  }

  onBlur() {
    setTimeout(() => {
      if (!this.searchQuery.trim()) {
        this.isOpen = false;
      }
    }, 200);
  }
}
