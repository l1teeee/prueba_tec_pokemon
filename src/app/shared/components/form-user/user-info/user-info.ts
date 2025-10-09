import { Component, EventEmitter, Input, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ValidationErrors {
  nombre?: string;
  pasatiempo?: string;
  cumpleanos?: string;
  dui?: string;
  carnet?: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss'
})
export class Userinfo implements OnChanges {
  @Input() userData: any = {};
  @Input() showValidationError: boolean = false;
  @Output() formDataChange = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<void>();
  @Output() imageSelected = new EventEmitter<string>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  private readonly MAX_SIZE_MB = 2;
  private readonly MAX_SIZE_BYTES = this.MAX_SIZE_MB * 1024 * 1024;
  private readonly MIN_IMAGE_SIZE = 100;
  private readonly VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  private readonly MIN_AGE = 5;
  private readonly ADULT_AGE = 18;
  private readonly MAX_AGE = 120;

  currentImage?: string;
  errorMessage: string = '';
  fileName: string = '';
  isAdult: boolean = false;
  isMinor: boolean = false;
  age: number = 0;
  errors: ValidationErrors = {};
  touched: TouchedFields = {};
  today: string = new Date().toISOString().split('T')[0];

  ngOnChanges() {
    this.checkAge();
    this.currentImage = this.userData.imagen;
  }

  // IMAGEN
  getDisplayError(): string {
    return this.showValidationError && !this.currentImage
      ? 'Debes seleccionar una imagen de perfil'
      : this.errorMessage;
  }

  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.errorMessage = '';
    const validation = this.validateImageFile(file);

    if (!validation.valid) {
      this.errorMessage = validation.error!;
      (event.target as HTMLInputElement).value = '';
      return;
    }

    this.readImageFile(file);
  }

  private validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!this.VALID_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: 'Solo se permiten archivos JPG, PNG, GIF o WebP' };
    }

    if (file.size > this.MAX_SIZE_BYTES) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      return { valid: false, error: `Imagen muy grande (${fileSizeInMB}MB). Máximo ${this.MAX_SIZE_MB}MB` };
    }

    return { valid: true };
  }

  private readImageFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.src = result;

      img.onload = () => {
        if (img.width < this.MIN_IMAGE_SIZE || img.height < this.MIN_IMAGE_SIZE) {
          this.errorMessage = `La imagen debe ser al menos de ${this.MIN_IMAGE_SIZE}x${this.MIN_IMAGE_SIZE} píxeles`;
          return;
        }

        this.updateImage(result, file.name);
      };

      img.onerror = () => this.errorMessage = 'Error al cargar la imagen';
    };

    reader.onerror = () => this.errorMessage = 'Error al leer el archivo';
    reader.readAsDataURL(file);
  }

  private updateImage(imageData: string, fileName: string) {
    this.fileName = fileName;
    this.currentImage = imageData;
    this.userData.imagen = imageData;
    this.imageSelected.emit(imageData);
    this.emitChanges();
  }

  removeImage() {
    this.currentImage = '';
    this.userData.imagen = '';
    this.fileName = '';
    this.errorMessage = '';
    this.imageSelected.emit('');
    this.emitChanges();
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  getFileSizeLabel(): string {
    return `Máximo ${this.MAX_SIZE_MB}MB`;
  }

  // Validación
  onInputChange(field?: string) {
    if (field) this.touched[field] = true;
    this.checkAge();
    if (field) this.validateField(field);
    this.emitChanges();
  }

  private emitChanges() {
    this.formDataChange.emit(this.userData);
  }

  validateField(field: string) {
    const validators: { [key: string]: () => void } = {
      nombre: () => this.validateNombre(),
      pasatiempo: () => this.validatePasatiempo(),
      cumpleanos: () => this.validateCumpleanos(),
      dui: () => this.validateDui(),
      carnet: () => this.validateCarnet()
    };

    validators[field]?.();
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
    this.userData.pasatiempo
      ? delete this.errors.pasatiempo
      : this.errors.pasatiempo = 'Debes seleccionar un pasatiempo';
  }

  validateCumpleanos() {
    const cumpleanos = this.userData.cumpleanos;

    if (!cumpleanos) {
      this.errors.cumpleanos = 'La fecha de cumpleaños es requerida';
      return;
    }

    const birthDate = new Date(cumpleanos);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - this.MAX_AGE, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - this.MIN_AGE, today.getMonth(), today.getDate());

    if (birthDate > today) {
      this.errors.cumpleanos = 'La fecha no puede ser futura';
    } else if (birthDate < minDate) {
      this.errors.cumpleanos = 'La fecha no puede ser tan antigua';
    } else if (birthDate > maxDate) {
      this.errors.cumpleanos = `Debes tener al menos ${this.MIN_AGE} años`;
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
      this.errors.dui = `El DUI es requerido para mayores de ${this.ADULT_AGE} años`;
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
    if (!this.userData.cumpleanos) return;

    const birthDate = new Date(this.userData.cumpleanos);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.age = age;
    this.isAdult = age >= this.ADULT_AGE;
    this.isMinor = age >= this.MIN_AGE && age < this.ADULT_AGE;

    this.cleanupAgeFields();
  }

  private cleanupAgeFields() {
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

  validateAll(): boolean {
    this.touched = { nombre: true, pasatiempo: true, cumpleanos: true, dui: true, carnet: true };

    this.validateNombre();
    this.validatePasatiempo();
    this.validateCumpleanos();

    if (this.isAdult) this.validateDui();
    else if (this.isMinor) this.validateCarnet();

    return Object.keys(this.errors).length === 0;
  }

  onSubmit() {
    this.submitForm.emit();
  }

  formatDui(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 9);

    if (value.length > 8) {
      value = `${value.substring(0, 8)}-${value.substring(8, 9)}`;
    }

    this.userData.dui = value;
    this.onInputChange('dui');
  }

  onDuiKeyPress(event: KeyboardEvent) {
    const allowedKeys = [8, 9, 27, 13, 46];
    const isCtrlCommand = event.ctrlKey && [65, 67, 86, 88].includes(event.keyCode);
    const isNumber = event.keyCode >= 48 && event.keyCode <= 57;

    if (!allowedKeys.includes(event.keyCode) && !isCtrlCommand && !isNumber) {
      event.preventDefault();
    }
  }

  clearPasatiempo() {
    this.userData.pasatiempo = '';
    this.onInputChange('pasatiempo');
  }
}
