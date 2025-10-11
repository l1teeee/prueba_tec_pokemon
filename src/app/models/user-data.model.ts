export type DocumentoType = '' | 'dui' | 'carnet';

export interface UserData {
  nombre: string;
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
  cumpleanos: '',
  pasatiempo: '',
  documento: '',
  dui: '',
  carnet: '',
  imagen: '',
  registerComplete: false,
});
