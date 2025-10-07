import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ValidationErrors {
  nombre?: string;
  pasatiempo?: string;
  cumpleanos?: string;
  dui?: string;
  carnet?: string;
}

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css'
})
export class Userinfo implements OnChanges {
  @Input() userData: any = {};
  @Output() formDataChange = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<void>();

  isAdult: boolean = false;
  isMinor: boolean = false;
  age: number = 0;
  errors: ValidationErrors = {};
  touched: { [key: string]: boolean } = {};
  today: string = new Date().toISOString().split('T')[0];

  ngOnChanges() {
    this.checkAge();
  }

  onInputChange(field?: string) {
    if (field) {
      this.touched[field] = true;
    }
    this.checkAge();
    this.validateField(field);
    this.formDataChange.emit(this.userData);
  }

  validateField(field?: string) {
    if (!field) return;

    switch (field) {
      case 'nombre':
        this.validateNombre();
        break;
      case 'pasatiempo':
        this.validatePasatiempo();
        break;
      case 'cumpleanos':
        this.validateCumpleanos();
        break;
      case 'dui':
        this.validateDui();
        break;
      case 'carnet':
        this.validateCarnet();
        break;
    }
  }

  validateNombre() {
    const nombre = this.userData.nombre?.trim();

    if (!nombre) {
      this.errors.nombre = 'El nombre es requerido';
    } else if (nombre.length < 2) {
      this.errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (nombre.length > 50) {
      this.errors.nombre = 'El nombre no puede exceder 50 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      this.errors.nombre = 'El nombre solo puede contener letras';
    } else {
      delete this.errors.nombre;
    }
  }

  validatePasatiempo() {
    const pasatiempo = this.userData.pasatiempo;

    if (!pasatiempo) {
      this.errors.pasatiempo = 'Debes seleccionar un pasatiempo';
    } else {
      delete this.errors.pasatiempo;
    }
  }

  validateCumpleanos() {
    const cumpleanos = this.userData.cumpleanos;

    if (!cumpleanos) {
      this.errors.cumpleanos = 'La fecha de cumpleaños es requerida';
      return;
    }

    const birthDate = new Date(cumpleanos);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());

    if (birthDate > today) {
      this.errors.cumpleanos = 'La fecha no puede ser futura';
    } else if (birthDate < minDate) {
      this.errors.cumpleanos = 'La fecha no puede ser tan antigua';
    } else if (birthDate > maxDate) {
      this.errors.cumpleanos = 'Debes tener al menos 5 años';
    } else {
      delete this.errors.cumpleanos;
    }
  }

  validateDui() {
    if (!this.isAdult) {
      delete this.errors.dui;
      return;
    }

    const dui = this.userData.dui?.trim();

    if (!dui) {
      this.errors.dui = 'El DUI es requerido para mayores de 18 años';
    } else if (!/^\d{8}-\d$/.test(dui)) {
      this.errors.dui = 'Formato inválido. Use: 12345678-9';
    } else {
      delete this.errors.dui;
    }
  }

  validateCarnet() {
    if (!this.isMinor) {
      delete this.errors.carnet;
      return;
    }

    const carnet = this.userData.carnet?.trim();

    if (!carnet) {
      this.errors.carnet = 'El carnet de minoridad es requerido';
    } else if (carnet.length > 20) {
      this.errors.carnet = 'El carnet no puede exceder 20 caracteres';
    } else {
      delete this.errors.carnet;
    }
  }

  checkAge() {
    if (this.userData.cumpleanos) {
      const birthDate = new Date(this.userData.cumpleanos);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      this.age = age;
      this.isAdult = age >= 18;
      this.isMinor = age >= 5 && age < 18;

      if (this.isAdult) {
        delete this.userData.carnet;
        delete this.errors.carnet;
      } else if (this.isMinor) {
        delete this.userData.dui;
        delete this.errors.dui;
      } else {
        delete this.userData.dui;
        delete this.userData.carnet;
        delete this.errors.dui;
        delete this.errors.carnet;
      }
    }
  }

  isFormValid(): boolean {
    // NO ejecutar validaciones aquí, solo verificar el estado actual

    // Verificar si hay campos vacíos
    if (!this.userData.nombre?.trim() ||
      !this.userData.pasatiempo ||
      !this.userData.cumpleanos) {
      return false;
    }

    // Verificar si hay errores
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Validar campos específicos según edad
    if (this.isAdult && !this.userData.dui?.trim()) {
      return false;
    }

    if (this.isMinor && !this.userData.carnet?.trim()) {
      return false;
    }

    return true;
  }

  validateAll(): boolean {
    // Marcar todos los campos como tocados
    this.touched = {
      nombre: true,
      pasatiempo: true,
      cumpleanos: true,
      dui: true,
      carnet: true
    };

    // Ejecutar todas las validaciones
    this.validateNombre();
    this.validatePasatiempo();
    this.validateCumpleanos();

    if (this.isAdult) {
      this.validateDui();
    } else if (this.isMinor) {
      this.validateCarnet();
    }

    return Object.keys(this.errors).length === 0;
  }

  onSubmit() {
    // Primero validar todo y marcar campos como tocados
    const isValid = this.validateAll();

    if (isValid) {
      this.submitForm.emit();
    } else {
      // Scroll al primer error después de un pequeño delay para que Angular actualice el DOM
      setTimeout(() => {
        const firstError = document.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  formatDui(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 8) {
      value = value.substring(0, 8) + '-' + value.substring(8, 9);
    }

    this.userData.dui = value;
    this.onInputChange('dui');
  }

  clearPasatiempo() {
    this.userData.pasatiempo = '';
    this.onInputChange('pasatiempo');
  }
}
