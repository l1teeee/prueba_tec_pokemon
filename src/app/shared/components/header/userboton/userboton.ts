import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Search} from './search/search'

@Component({
  selector: 'app-userboton',
  standalone: true,
  imports: [CommonModule, FormsModule, Search],
  templateUrl: './userboton.html',
  styleUrls: ['./userboton.css'],
})
export class Userboton {
  selectedAction = '';

  constructor(
    // private router: Router,
    // private auth: AuthService
  ) {}

  onActionChange(): void {
    if (this.selectedAction === 'profile') {
      // this.router.navigate(['/perfil']);
    } else if (this.selectedAction === 'logout') {
      // this.auth.logout();
    }
    // volver al placeholder
    this.selectedAction = '';
  }
}
