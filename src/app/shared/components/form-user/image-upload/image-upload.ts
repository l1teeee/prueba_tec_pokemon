import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrls: ['./image-upload.scss']
})
export class Imageupload implements OnInit {
  @Input({ transform: (value: string | undefined) => value ?? null }) currentImage: string | null = null;
  @Input() showValidation = false;
  @Output() imageChange = new EventEmitter<string | null>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName: string = ''; // Asegúrate que esté inicializado
  imageError: string = '';
  isRegistered: boolean = false;
  userInfo: any = {};
  private maxFileSize = 5 * 1024 * 1024;

  ngOnInit() {
    this.loadUserData();
    const savedFileName = localStorage.getItem('profileImageName');
    if (savedFileName && this.currentImage) {
      this.fileName = savedFileName;
    }
  }

  private loadUserData() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        this.isRegistered = userData.registerComplete === true;
        this.userInfo = userData;
      } catch (error) {
        console.error('Error al leer datos del usuario:', error);
        this.isRegistered = false;
      }
    }
  }

  getDisplayError(): string {
    if (this.showValidation && !this.currentImage) {
      return 'La imagen de perfil es obligatoria';
    }
    return this.imageError;
  }

  getFileSizeLabel(): string {
    return 'Máximo 5MB';
  }

  getAge(): string {
    if (!this.userInfo.cumpleanos) return 'N/A';

    const birthDate = new Date(this.userInfo.cumpleanos);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return `${age} años`;
  }

  getDocumento(): string {
    return this.userInfo.dui || this.userInfo.carnet || 'No especificado';
  }

  getDocumentoLabel(): string {
    return this.userInfo.dui ? 'DUI:' : 'Carnet:';
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

    this.fileName = file.name;
    console.log('Nombre del archivo:', this.fileName); // Para debug
    localStorage.setItem('profileImageName', this.fileName);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentImage = e.target?.result as string;
      this.imageError = '';
      this.imageChange.emit(this.currentImage);
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.currentImage = null;
    this.fileName = '';
    this.imageError = '';
    localStorage.removeItem('profileImageName');
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.imageChange.emit(null);
  }
}
