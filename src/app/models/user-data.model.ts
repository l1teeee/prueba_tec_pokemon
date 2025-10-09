export type DocumentoType = '' | 'dui' | 'carnet';

export interface UserData {
  nombre: string;
  apellido: string;
  cumpleanos: string;
  pasatiempo?: string;
  documento: DocumentoType;
  dui?: string;
  carnet?: string;
  imagen?: string;
  registerComplete?: boolean;
}

export const createEmptyUserData = (): UserData => ({
  nombre: '',
  apellido: '',
  cumpleanos: '',
  pasatiempo: '',
  documento: '',
  dui: '',
  carnet: '',
  imagen: '',
  registerComplete: false,
});
