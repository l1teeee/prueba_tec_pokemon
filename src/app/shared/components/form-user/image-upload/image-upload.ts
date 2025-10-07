import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class Imageupload {
  @Input() currentImage?: string;
  @Input() showValidationError: boolean = false;
  @Output() imageSelected = new EventEmitter<string>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  errorMessage: string = '';
  fileName: string = '';
  maxSizeInMB: number = 2;
  maxSizeInBytes: number = this.maxSizeInMB * 1024 * 1024;

  // Método para obtener el mensaje de error a mostrar
  getDisplayError(): string {
    if (this.showValidationError && !this.currentImage) {
      return 'Debes seleccionar una imagen de perfil';
    }
    return this.errorMessage;
  }

  // Método para abrir el selector de archivos
  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.errorMessage = '';

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Solo se permiten archivos JPG, PNG, GIF o WebP';
        input.value = '';
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > this.maxSizeInBytes) {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        this.errorMessage = `La imagen es muy grande (${fileSizeInMB}MB). Máximo ${this.maxSizeInMB}MB`;
        input.value = '';
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();
        img.src = result;

        img.onload = () => {
          // Validar dimensiones mínimas
          if (img.width < 100 || img.height < 100) {
            this.errorMessage = 'La imagen debe ser al menos de 100x100 píxeles';
            input.value = '';
            return;
          }

          // Todo correcto, emitir la imagen
          this.fileName = file.name;
          this.imageSelected.emit(result);
        };

        img.onerror = () => {
          this.errorMessage = 'Error al cargar la imagen';
          input.value = '';
        };
      };

      reader.onerror = () => {
        this.errorMessage = 'Error al leer el archivo';
        input.value = '';
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageSelected.emit('');
    this.fileName = '';
    this.errorMessage = '';

    // Limpiar el input
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  getFileSizeLabel(): string {
    return `Máximo ${this.maxSizeInMB}MB`;
  }
}
