import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-header.html',
  styleUrl: './form-header.scss'
})
export class FormHeader implements OnInit {
  isRegistered: boolean = false;

  ngOnInit() {
    this.checkRegistrationStatus();
  }

  private checkRegistrationStatus() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        this.isRegistered = userData.registerComplete === true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.isRegistered = false;
      }
    }
  }

  getGreeting(): string {
    return this.isRegistered
      ? '¡Ya casi terminamos!'
      : '¡Hola! Configuremos tu perfil';
  }

  getSubtitle(): string {
    return this.isRegistered ? 'Revisa la información, y completa lo solicitado.' : 'Queremos conocerte mejor.';
  }
}
