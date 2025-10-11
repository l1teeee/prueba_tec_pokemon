import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Search } from './search/search';
import { UserDataService } from '@services/user-data.service';

@Component({
  selector: 'app-userboton',
  standalone: true,
  imports: [CommonModule, FormsModule, Search],
  templateUrl: './userboton.html',
  styleUrls: ['./userboton.scss'],
})
export class Userboton implements OnInit, OnDestroy {
  selectedAction = '';
  userName = '';
  showUserActions = false;
  private subscription = new Subscription();

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.subscription.add(
      this.userDataService.userData$.subscribe(data => {
        this.userName = data.nombre || '';
        this.checkIfBothComplete();
      })
    );
    this.userDataService.loadUserData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkIfBothComplete(): void {
    const userData = this.userDataService.getCurrentUserData();
    const isRegistered = userData.registerComplete === true;
    const isTrainerComplete = localStorage.getItem('entrenadorComplete') === 'true';
    this.showUserActions = isRegistered && isTrainerComplete;
  }

  onActionChange(): void {
    if (this.selectedAction === 'logout') {
      this.logout();
    }
    this.selectedAction = '';
  }

  logout(): void {
    const cacheKeys = ['pokemon_cache', 'pokemon_cache_expiration'];
    const cacheData = cacheKeys.reduce((acc, key) => {
      const value = localStorage.getItem(key);
      if (value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    localStorage.clear();

    Object.entries(cacheData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    window.location.reload();
  }

  get displayText(): string {
    return this.userName || 'Acciones';
  }
}
