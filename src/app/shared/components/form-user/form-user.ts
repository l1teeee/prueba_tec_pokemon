import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormHeader } from './form-header/form-header';
import { Imageupload } from './image-upload/image-upload';
import { Userinfo } from './user-info/user-info';

interface UserData {
  nombre: string;
  apellido: string;
  cumpleanos: string;
  pasatiempo?: string;
  documento: string;
  dui?: string;
  carnet?: string;
  imagen?: string;
}

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormHeader,
    Imageupload,
    Userinfo,
  ],
  templateUrl: './form-user.html',
  styleUrl: './form-user.css'
})
export class Formuser {
  userData: UserData = {
    nombre: '',
    apellido: '',
    cumpleanos: '',
    pasatiempo: '',
    documento: '',
    imagen: ''
  };

  // Nueva propiedad para rastrear si hay imagen
  hasProfileImage: boolean = false;

  onImageSelected(imageUrl: string) {
    this.userData.imagen = imageUrl;
    // Actualizar el estado de si hay imagen o no
    this.hasProfileImage = !!imageUrl;
  }

  onFormDataChange(data: Partial<UserData>) {
    this.userData = { ...this.userData, ...data };
  }

  onSubmit() {
    // La validación ahora se hace en el componente user-info
    // Si llegamos aquí, significa que todo está validado

    // Guardar en localStorage
    localStorage.setItem('userData', JSON.stringify(this.userData));
    console.log('Datos guardados:', this.userData);
    alert('✅ Perfil guardado exitosamente');
  }

  ngOnInit() {
    // Cargar datos si existen
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      this.userData = JSON.parse(savedData);
      // Verificar si hay imagen guardada
      this.hasProfileImage = !!this.userData.imagen;
    }
  }
}
