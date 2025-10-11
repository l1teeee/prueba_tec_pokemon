import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '@services/user-data.service';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-header.html',
  styleUrl: './form-header.scss'
})
export class FormHeader implements OnInit {
  isRegistered: boolean = false;
  isTrainerComplete: boolean = false;
  userName: string = '';

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.checkRegistrationStatus();
    this.checkTrainerStatus();
    this.loadUserName();
  }

  private checkRegistrationStatus(): void {
    const userData = this.userDataService.getCurrentUserData();
    this.isRegistered = userData.registerComplete === true;
  }

  private checkTrainerStatus(): void {
    this.isTrainerComplete = localStorage.getItem('entrenadorComplete') === 'true';
  }

  private loadUserName(): void {
    const userData = this.userDataService.getCurrentUserData();
    this.userName = userData.nombre || '';
  }

  isBothComplete(): boolean {
    return this.isRegistered && this.isTrainerComplete;
  }

  getGreeting(): string {
    if (this.isBothComplete()) {
      return `¡Hola ${this.userName}!`;
    }
    return this.isRegistered
      ? '¡Ya casi terminamos!'
      : '¡Hola! Configuremos tu perfil';
  }

  getSubtitle(): string {
    return this.isRegistered
      ? 'Revisa la información, y completa lo solicitado.'
      : 'Queremos conocerte mejor.';
  }

  showSubtitle(): boolean {
    return !this.isBothComplete();
  }

  onEditProfile(): void {
    try {
      localStorage.removeItem('entrenadorComplete');
      const currentData = this.userDataService.getCurrentUserData();
      const updatedData = {
        ...currentData,
        registerComplete: false
      };
      const saved = this.userDataService.saveUserData(updatedData);

      if (saved) {
        localStorage.setItem('registerComplete', 'false');

        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error('Error al editar perfil:', error);
    }
  }

  onBack(): void {
    try {
      const currentData = this.userDataService.getCurrentUserData();
      const updatedData = {
        ...currentData,
        registerComplete: false
      };
      const saved = this.userDataService.saveUserData(updatedData);
      if (saved) {
        localStorage.setItem('registerComplete', 'false');

        this.isRegistered = false;
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }
}
