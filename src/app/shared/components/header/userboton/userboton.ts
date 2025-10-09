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
  styleUrls: ['./userboton.css'],
})
export class Userboton implements OnInit, OnDestroy {
  selectedAction = '';
  userName = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private userDataService: UserDataService
    // private router: Router,
    // private auth: AuthService
  ) {}

  ngOnInit() {
    // Suscribirse a los datos del usuario para obtener el nombre
    this.subscription.add(
      this.userDataService.userData$.subscribe(data => {
        // Obtener el nombre, si no existe dejar vacío para mostrar "Acciones"
        this.userName = data.nombre || '';
      })
    );

    // Cargar datos del usuario
    this.userDataService.loadUserData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onActionChange(): void {
    if (this.selectedAction === 'profile') {
      // this.router.navigate(['/perfil']);
    } else if (this.selectedAction === 'logout') {
      // this.auth.logout();
    }
    // Volver al placeholder
    this.selectedAction = '';
  }

  get displayText(): string {
    return this.userName || 'Acciones';
  }
}
