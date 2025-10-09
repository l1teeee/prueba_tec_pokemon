import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrls: ['./image-upload.css']
})
export class Imageupload {
  @Input({ transform: (value: string | undefined) => value ?? null }) currentImage: string | null = null;
  @Input() showValidation = false;
  @Output() imageChange = new EventEmitter<string | null>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName: string = '';
  imageError: string = '';
  private maxFileSize = 5 * 1024 * 1024;

  getDisplayError(): string {
    if (this.showValidation && !this.currentImage) {
      return 'La imagen de perfil es obligatoria';
    }
    return this.imageError;
  }

  getFileSizeLabel(): string {
    return 'Máximo 5MB';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.imageError = 'Formato no válido. Use JPG, PNG, GIF o WebP';
      return;
    }

    if (file.size > this.maxFileSize) {
      this.imageError = 'La imagen no debe superar 5MB';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentImage = e.target?.result as string;
      this.fileName = file.name;
      this.imageError = '';
      this.imageChange.emit(this.currentImage);
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.currentImage = null;
    this.fileName = '';
    this.imageError = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.imageChange.emit(null);
  }
}
